<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Notify Management
                        <CButton @click="init()">
                            <CIcon name="cil-sync" />
                            Update
                        </CButton>
                    </h2>
                    <CTable align="middle" reponsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Target</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Type</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">ChannelName</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Subscriber</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.target}}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.type}}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.channelName}}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.name}}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
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

                <CModal size="sm" alignment="center" :visible="deleteModel" @close="() => { deleteModel = false }">
                    <CModalHeader>
                        <CModalTitle>Cancel Notify</CModalTitle>
                    </CModalHeader>
                    <CModalFooter>
                        <CButton color="danger"     @click="Cancel()" :disabled="buffer"><CIcon name="cil-trash"/> Cancel</CButton>
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
    name: 'NotifyManagement',
    data() {
        return {
            data: [],
            pages: 0,
            page: 1,
            size: 5,

            deleteModel: false,

            item: {},

            buffer: false,

            toasts: []
        }
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
                url: '/notify'
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        let data = [];
                        result.data.forEach((item, index) => {
                            item.index = index + 1;
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

                };
            })
            .catch(err => {
                console.log(err);
            });
        },

        showDeleteModel(item) {
            this.item = item;
            this.deleteModel = true;
        },

        Cancel() {
            if (this.buffer) return;

            this.buffer = true;

            const data = {
                token: this.item.token
            }

            request({
                method: 'DELETE',
                url: '/notify',
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
                            content: '取消成功!'
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
                            content: '訂閱Token不存在，請重新操作!'
                        });
                        this.deleteModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 110:
                        this.toasts.push({
                            title: 'Error',
                            content: '資料中存在違規的特殊符號!'
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
                this.checkJWT();
            });
        },
    }
}
</script>