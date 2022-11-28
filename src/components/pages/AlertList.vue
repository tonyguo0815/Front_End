<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Alert List
                        <CButton>
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
                            <CTableRow v-for="item in data" :key="item.index" @click="showModel(item)">
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
                                    <CButton>
                                        <CIcon name="cil-image" />
                                    </CButton>
                                    <CButton>
                                        <CIcon name="cil-trash" />
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
                        <div class="clearfix">
                            <CImage fluid rounded :src="imagePath" />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" @click="() => { imageModel = false }">
                            取消
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal size="sm" alignment="center" :visible="deleteModel" @close="() => { deleteModel = false }">
                    <CModalHeader>
                        <CModalTitle>Delete Alert</CModalTitle>
                    </CModalHeader>
                    <CModalFooter>
                        <CButton color="danger">Delete</CButton>
                        <CButton color="secondary" @click="() => { deleteModel = false }">
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CToaster placement="top-end">
                    <CToast v-for="toast in toasts" :key="toast.index" :delay="2000">
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
// import request from '@/utils/request';
export default {
    name: "AlertList",
    data() {
        return {
            data: [
                {
                    type: "有危險行為",
                    timestamp: "2022/10/13 15:15:15",
                    description: "",
                    index: 1
                }
            ],
            pages: 0,
            page: 1,
            size: 5,

            imageModel: false,
            deleteModel: false,

            imagePath: "",
            toasts: []
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // request({
            //     method: 'GET',
            //     url: '/alert'
            // })
            // .then((res) => {
            //     let result = res.data;
            //     switch (result.status) {
            //         case 1 :
            //             let accountList = [];
            //             result.data.forEach((item, index) => {
            //                 item.index = index + 1;
            //                 if (item.type === 1) item.type = '有危險行為';
            //                 if (item.type === 0) item.type = '無危險行為';
            //                 accountList.push(item);
            //             })
            //             this.data = accountList;
            //             if (this.data.length/this.size > 1) {
            //                 this.pages = Math.ceil(this.data.length/this.size);
            //             } else {
            //                 this.pages = 1;
            //             }
            //             break;
            //         case 0 :
            //             this.toasts.push({
            //                 title: '發生錯誤!',
            //                 content: '系統錯誤，請與管理者聯繫',
            //             });
            //             break;
            //     }
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
        },
        showImageModel(item) {
            this.imageModel = true;
        },
        showDeleteModel(item) {
            this.deleteModel = true;
        },
    },
    components: { CButton }
}
</script>