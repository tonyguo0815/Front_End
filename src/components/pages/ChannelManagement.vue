<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Channel Management
                        <CButton @click="showCreateModel()">
                            <CIcon name="cil-plus" />
                            Create
                        </CButton>
                        <CButton @click="init()">
                            <CIcon name="cil-sync" />
                            Update
                        </CButton>
                    </h2>
                    <CTable align="middle" responsive v-if="data.length > 0">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Channel Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Description</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.channelName }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    {{ item.description }}
                                </CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page - 1) * size">
                                    <CButton @click="showSettingModel(item)">
                                        <CIcon name="cil-settings"/>
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

                <CModal alignment="center" size="lg" :visible="createModel" @close="() => { createModel = false }">
                    <CModalHeader>
                        <CModalTitle>Create Channel</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormLabel>ChannelName</CFormLabel>
                        <CFormInput id="ChannelName"      v-model="item.channelName"/>
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput id="Description"    v-model="item.description"/>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="info"     @click="createChannel()" :disabled="buffer"><CIcon name="cil-plus"/> Create</CButton>
                        <CButton color="secondary" @click="() => { createModel = false }">
                            <CIcon name="cil-X"/> Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal alignment="center" size="lg" :visible="settingsModel" @close="() => { settingsModel = false }">
                    <CModalHeader>
                        <CModalTitle>Setting Channel</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormLabel>ChannelName</CFormLabel>
                        <CFormInput id="ChannelName"      v-model="item.channelName"/>
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput id="Description"    v-model="item.description"/>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="info"     @click="updateChannel()" :disabled="buffer"><CIcon name="cil-settings"/> Update</CButton>
                        <CButton color="secondary" @click="() => { settingsModel = false }">
                            <CIcon name="cil-X"/> Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal size="sm" alignment="center" :visible="deleteModel" @close="() => { deleteModel = false }">
                    <CModalHeader>
                        <CModalTitle>Delete Channel</CModalTitle>
                    </CModalHeader>
                    <CModalFooter>
                        <CButton color="danger"     @click="deleteChannel()" :disabled="buffer"><CIcon name="cil-trash"/> Delete</CButton>
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
    name: 'ChannelManagement',
    data() {
        return {
            data: [],
            pages: 0,
            page: 1,
            size: 5,

            createModel:false,
            settingsModel: false,
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
                url: '/channel'
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

        showCreateModel() {
            this.item = {
                channelName: '',
                description: ''
            };
            this.createModel = true;
        },

        showSettingModel(item) {
            this.item = item;
            this.settingsModel = true;
        },

        showDeleteModel(item) {
            this.item = item;
            this.deleteModel = true;
        },

        createChannel() {
            if (this.buffer) return;

            this.buffer = true;

            if (this.item.channelName === '') {
                this.toasts.push({
                    title: 'Error',
                    content: '請輸入頻道名稱',
                });
                this.buffer = false;
                return;
            }

            const data = {
                channelName: this.item.channelName,
                description: this.item.description
            }

            request({
                method: 'POST',
                url: '/channel',
                data: data,
                headers:{
                    authorization: this.$store.state.jwt
                }
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        this.toasts.push({
                            title: 'Success',
                            content: '新增成功',
                        });
                        this.createModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 0 :
                        this.toasts.push({
                            title: 'Error',
                            content: '系統錯誤，請與管理者聯繫',
                        });
                        this.createModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '資料格式錯誤，請與管理者聯繫!'
                        });
                        this.createModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'ChannelName重複!'
                        });
                        this.item.channelName = '';
                        break;

                    case 121:
                        this.toasts.push({
                            title: 'Error',
                            content: 'JWT錯誤，請重新登入!'
                        });
                        this.createModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;
                };
            })
            .catch(err => {
                this.checkJWT();
            });
        },

        updateChannel() {
            if (this.buffer) return;

            this.buffer = true;

            if (this.item.channelName == '') {
                this.toasts.push({
                    title: 'Error',
                    content: '請輸入頻道名稱',
                });
                this.buffer = false;
                return;
            }

            const data = {
                id: this.item.id,
                channelName: this.item.channelName,
                description: this.item.description
            }

            request({
                method: 'PUT',
                url: '/channel',
                data: data,
                headers:{
                    authorization: this.$store.state.jwt
                }
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        this.toasts.push({
                            title: 'Success',
                            content: '更新成功',
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 0 :
                        this.toasts.push({
                            title: 'Error',
                            content: '系統錯誤，請與管理者聯繫',
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '資料格式錯誤，請與管理者聯繫!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'Channel不存在，請重新操作!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 103:
                        this.toasts.push({
                            title: 'Error',
                            content: 'ChannelName重複!'
                        });
                        break;
                };

                this.buffer = false;
            })
            .catch(err => {
                this.checkJWT();
            });
        },

        deleteChannel() {
            if (this.buffer) return;

            this.buffer = true;

            const data = {
                id: this.item.id
            }

            request({
                method: 'Delete',
                url: '/channel',
                data: data,
                headers:{
                    authorization: this.$store.state.jwt
                }
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        this.toasts.push({
                            title: 'Success',
                            content: '刪除成功',
                        });
                        break;

                    case 0 :
                        this.toasts.push({
                            title: 'Error',
                            content: '系統錯誤，請與管理者聯繫',
                        });
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '資料格式錯誤，請與管理者聯繫!'
                        });
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'Channel不存在，請重新操作!'
                        });
                        break;

                    case 103:
                        this.toasts.push({
                            title: 'Error',
                            content: 'Channel使用中，不允許刪除操作!'
                        });
                        break;
                };

                this.deleteModel = false;
                this.buffer = false;
                this.checkJWT();
            })
            .catch(err => {
                this.checkJWT();
            });
        },
    }
}
</script>