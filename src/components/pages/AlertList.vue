<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Alert List
                        <CButton @click="init()">
                            <CIcon name="cil-sync" />
                            Update
                        </CButton>
                    </h2>
                    <CTable align="middle" reponsive v-if="data.length > 0">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Type</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Timestamp</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Description</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.type }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.timestamp }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.description }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    <CButton @click="showImageModel(item)">
                                        <CIcon name="cil-image"/>
                                    </CButton>
                                    <CButton @click="showDeleteModel(item)">
                                        <CIcon name="cil-trash"/>
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    <CPagination align="end" aria-label="Page navigation example" v-if="data.length > 0">
                        <CPaginationItem v-for="item in pages" :key="item.index" :active="page === item ? true : false"
                            @click="page = item">{{ item }}
                        </CPaginationItem>
                    </CPagination>
                </CCardBody>

                <CModal alignment="center" size="lg" :visible="imageModel" @close="() => { imageModel = false }">
                    <CModalHeader>
                        <CModalTitle>Alert</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormLabel>Type</CFormLabel>
                        <CFormInput id="Type"           v-model="item.type" disabled/>
                        <CFormLabel>Timestamp</CFormLabel>
                        <CFormInput id="Timestamp"      v-model="item.timestamp" disabled/>
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput id="Description"    v-model="item.description" disabled/>
                        <br>
                        <div class="clearfix">
                            <CImage fluid rounded :src="imagePath" />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" @click="() => { imageModel = false }">
                            <CIcon name="cil-X"/> Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal size="sm" alignment="center" :visible="deleteModel" @close="() => { deleteModel = false }">
                    <CModalHeader>
                        <CModalTitle>Delete Alert</CModalTitle>
                    </CModalHeader>
                    <CModalFooter>
                        <CButton color="danger"     @click="deleteAlert()" :disabled="buffer"><CIcon name="cil-trash"/>Delete</CButton>
                        <CButton color="secondary"  @click="() => { deleteModel = false }">
                            <CIcon name="cil-X"/> Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CToaster placement="top-end">
                    <CToast v-for="toast in toasts" :key="toast.index" :delay="3000">
                        <CToastHeader closeButton>
                            <span class="me-auto fw-bold">{{ toast.title }}</span>
                        </CToastHeader>
                        <CToastBody>
                            {{ toast.content }}
                        </CToastBody>
                    </CToast>
                </CToaster>

            </CCard>
        </CRow>
    </CContainer>
</template>

<script>
import request from '@/utils/request';
export default {
    name: "AlertList",
    data() {
        return {
            data: [],
            pages: 0,
            page: 1,
            size: 5,

            imageModel: false,
            deleteModel: false,

            item: {},

            imagePath: "",

            buffer: false,

            toasts: []
        };
    },
    mounted() {
        this.checkJWT();
    },
    methods: {
        checkJWT() {
            if (!this.$store.state.jwt) {
                this.toasts.push({
                    title: 'Error',
                    content: '登入金鑰已過期，請重新登入!'
                });
                this.$router.push("/dashboard");
                return
            }

            request({
                method: 'POST',
                url: '/auth/checkJWT',
                headers:{
                    authorization: this.$store.state.jwt
                }
            })
            .then(res => {
                let result = res.data;

                if (result.status) {
                    this.init();
                } else {
                    this.toasts.push({
                        title: 'Error',
                        content: '登入金鑰已過期，請重新登入!'
                    });
                    this.$router.push("/dashboard");
                }
            })
            .catch(err => {
                console.log(err);
            });
        },

        init() {
            this.pages  = 0;
            this.page   = 1;
            this.size   = 5;

            request({
                method: 'GET',
                url: '/alert/' + this.$store.state.userToken
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        let data = [];
                        result.data.forEach((item, index) => {
                            item.index = index + 1;
                            if (item.type === 1) item.type = '有危險行為';
                            if (item.type === 0) item.type = '無危險行為';
                            data.push(item);
                        })
                        this.data = data;
                        if (this.data.length/this.size > 1) {
                            this.pages = Math.ceil(this.data.length/this.size);
                        } else {
                            this.pages = 1;
                        }
                        break;

                    case 0 :
                        this.toasts.push({
                            title: 'Error',
                            content: '系統錯誤，請與管理者聯繫',
                        });
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'token錯誤，請重新登入',
                        })
                        break;

                };
            })
            .catch(err => {
                console.log(err);
            });
        },

        showImageModel(item) {
            this.item = item;
            this.imageModel = true;

            this.imagePath = "http://localhost:3000/image/" + item.image;
        },

        showDeleteModel(item) {
            this.item = item;
            this.deleteModel = true;
        },

        deleteAlert() {
            if (this.buffer) return;

            this.buffer = true;

            let data = {
                image: this.item.image
            };

            request({
                method: 'DELETE',
                url: '/alert',
                data: data,
                headers:{
                    authorization: this.$store.state.jwt
                }
            })
            .then(res => {
                let result = res.data;

                switch(result.status) {
                    case 1:
                        this.toasts.push({
                            title: 'Success',
                            content: '刪除成功!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 0:
                        this.toasts.push({
                            title: 'Error',
                            content: '系統發生錯誤，請與管理者聯繫!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '資料格式錯誤，請與管理者聯繫!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: '警報不存在，請重新操作!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 121:
                        this.toasts.push({
                            title: 'Error',
                            content: 'JWT錯誤，請重新登入!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;
                };
            })
            .catch(err => {
                this.toasts.push({
                    title: 'Error',
                    content: '系統發生錯誤，請與管理者聯繫!'
                });

                this.deleteModel = false;
                this.buffer = false;
                this.checkJWT();
            });
        }
    },
}
</script>