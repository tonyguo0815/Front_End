<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Channel Management</h2>
                    <CButton color="info">
                        <CIcon name="cil-plus"></CIcon>
                        新增
                    </CButton>
                    <CTable align="middle" responsive v-if="data.length > 0">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Client ID</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Client Secret</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Redirect Uri</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Description</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index" @click="showModel(item)">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.clientID }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.clientSecret }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.redirectUri }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.description }}
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

                <CModal alignment="center" size="lg" :visible="model" @close="() => { model = false }">
                    <CModalHeader>
                        <CModalTitle>Management</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CFormInput type="text" label="Client Secret" v-model="notifyClient.clientSecret" />
                            <CFormInput type="text" label="Redirect Uri" v-model="notifyClient.redirectUri" />
                            <CFormInput type="text" label="Description" v-model="notifyClient.description" />
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" :disabled="state">
                            <CIcon name="cil-save"></CIcon>
                            保存修改
                        </CButton>
                        <CButton color="danger" :disabled="state">
                            <CIcon name="cil-trash"></CIcon>
                            刪除
                        </CButton>
                        <CButton color="secondary" @click="() => { model = false }">
                            <CIcon name="cil-x"></CIcon>
                            關閉
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CToaster placement="top-end">
                    <CToast v-for="(toast, index) in toasts" :delay="2000">
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
    name: 'AlertList',
    data() {
        return {
            data: [
                {
                    clientID: 1,
                    clientSecret: 1,
                    redirectUri: 1,
                    description: 1,
                    index: 1
                },
                {
                    clientID: 2,
                    clientSecret: 2,
                    redirectUri: 2,
                    description: 2,
                    index: 2
                },
                {
                    clientID: 3,
                    clientSecret: 3,
                    redirectUri: 3,
                    description: 3,
                    index: 3
                },
                {
                    clientID: 4,
                    clientSecret: 4,
                    redirectUri: 4,
                    description: 4,
                    index: 4
                },
                {
                    clientID: 5,
                    clientSecret: 5,
                    redirectUri: 5,
                    description: 5,
                    index: 5
                },
                {
                    clientID: 6,
                    clientSecret: 6,
                    redirectUri: 6,
                    description: 6,
                    index: 6
                }
            ],

            pages: 0,
            page: 1,
            size: 5,
            model: false,

            notifyClient: {},

            toasts: []
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (this.data.length / this.size > 1) {
                this.pages = Math.ceil(this.data.length / this.size);
            } else {
                this.pages = 1;
            }
        },
        showModel(item) {
            this.model = true;

            this.notifyClient = {
                clientID: item.clientID,
                clientSecret: item.clientSecret,
                redirectUri: item.redirectUri,
                description: item.description
            };
        },
    }
}
</script>