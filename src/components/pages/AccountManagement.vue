<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Account Management
                        <CButton @click="init()">
                            <CIcon name="cil-sync" />
                            Update
                        </CButton>
                    </h2>
                    <CTable align="middle" responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Account</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.name}}</CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.account}}</CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    <CButton @click="showSettingModel(item)">
                                        <CIcon name="cil-sync"/>
                                    </CButton>
                                    <CButton @click="showOptionsModel(item)">
                                        <CIcon name="cil-settings"/>
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

                <CModal alignment="center" :visible="settingsModel" @close="() => { settingsModel = false }">
                    <CModalHeader>
                        <CModalTitle>Reset Password</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormLabel>Account</CFormLabel>
                        <CFormInput id="tagetAccount" v-model="item.account" disabled/>
                        <CFormLabel>New Password</CFormLabel>
                        <CFormInput id="newPassword" v-model="newPassword" type="password" />
                        <CFormLabel>Check New Password</CFormLabel>
                        <CFormInput id="checkNewPassword" v-model="checkNewPassword" type="password" />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="info"       @click="resetPassword()" :disabled="buffer"><CIcon name="cil-sync"/> Reset</CButton>
                        <CButton color="secondary"  @click="() => { settingsModel = false }">
                            <CIcon name="cil-X"/> Close
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal alignment="center" :visible="optionsModel" @close="() => { optionsModel = false }">
                    <CModalHeader>
                        <CModalTitle>{{item.name}} : ??????</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormCheck v-for="channel in item.bind" :key="channel.value" v-model="channel.checked" :value="channel.value" :label="channel.label"/>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="info"       @click="updateBind()" :disabled="buffer"><CIcon name="cil-settings"/> Update</CButton>
                        <CButton color="secondary"  @click="() => { optionsModel = false }">
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
    name: 'AccountManagement',
    data() {
        return {
            data: [],
            pages: 0,
            page: 1,
            size: 5,

            settingsModel: false,
            optionsModel: false,

            item: {},

            channelList:[],

            newPassword: '',
            checkNewPassword: '',

            imagePath: "",

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
                    content: '???????????????????????????????????????!'
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
                        content: '???????????????????????????????????????!'
                    });
                    this.$router.push("/dashboard");
                }
            })
            .catch(err => {
                console.log(err);
            });
        },

        async init() {
            this.pages  = 0;
            this.page   = 1;
            this.size   = 5;

            await this.getChannelList();

            request({
                method: 'GET',
                url: '/account/'
            })
            .then(res => {
                let result = res.data;

                switch (result.status) {
                    case 1 :
                        let data = [];

                        if (result.data.length >= 25) {
                            this.size = 15;
                        } else {
                            this.size = 5;
                        }

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
                            content: '????????????????????????????????????',
                        });
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'token????????????????????????',
                        })
                        break;

                };
            })
            .catch(err => {
                console.log(err);
            });
        },

        getChannelList() {
            new Promise((resolve, reject) => {
                this.channelList = [];

                request({
                    method: 'GET',
                    url: '/channel'
                })
                .then(res => {
                    let result = res.data;

                    switch (result.status) {
                        case 1 :
                            result.data.forEach((item, index) => {
                                this.channelList.push({
                                    label: item.channelName,
                                    value: item.id
                                });
                            })
                            resolve();
                            break;

                        case 0 :
                            this.toasts.push({
                                title: 'Error',
                                content: '????????????????????????????????????',
                            });
                            reject();
                            break;
                    };
                })
                .catch(err => {
                    console.log(err);
                    reject();
                });
            })
        },

        showSettingModel(item) {
            this.item = item;
            this.settingsModel = true;
        },

        showOptionsModel(item) {
            this.item = item;
            this.item.bind = this.item.bind.split(';');
            
            let data = [];
            
            this.channelList.forEach((item, index) => {
                data.push({
                    label: item.label,
                    value: item.value,
                    checked: false
                });
            });

            this.item.bind.forEach((item, index) => {
                data.forEach((item2, index2) => {
                    if (item == item2.value) {
                        item2.checked = true;
                    }
                });
            });

            this.item.bind = data;

            this.optionsModel = true;
        },

        resetPassword() {
            if (this.buffer) return;

            this.buffer = true;

            const regex = new RegExp("^((?=.{8,12}$)(?=.*[a-z])(?=.*[A-Z]))");

            if (this.item.account === '' || this.newPassword === '' || this.checkNewPassword === '') {
                this.toasts.push({
                title: 'Error',
                content: '???????????????????????????!'
                });
                this.buffer = false;
                return;
            };

            if (this.newPassword !== this.checkNewPassword) {
                this.toasts.push({
                title: 'Error',
                content: '?????????????????????????????????!'
                });
                this.buffer = false;
                return;
            };

            if (!regex.test(this.newPassword)) {
                this.toasts.push({
                title: 'Error',
                content: '??????????????????????????????????????????!'
                });
                this.buffer = false;
                return;
            };


            const data = {
                account: this.item.account,
                password: this.newPassword
            };

            request({
                method: 'PUT',
                url: '/line_service',
                data: data
            })
            .then(res => {
                let result = res.data;

                switch(result.status) {
                    case 1:
                        this.toasts.push({
                            title: 'Success',
                            content: '??????????????????!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 0:
                        this.toasts.push({
                            title: 'Error',
                            content: '??????????????????????????????????????????!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '??????????????????????????????????????????!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: '?????????????????????????????????!'
                        });
                        this.settingsModel = false;
                        this.checkJWT();
                        break;

                    case 103:
                        this.toasts.push({
                            title: 'Error',
                            content: '??????????????????????????????????????????!'
                        });
                        this.newPassword = '';
                        this.checkNewPassword = '';
                        break;

                    case 110:
                        this.toasts.push({
                            title: 'Error',
                            content: '????????????????????????????????????!'
                        });
                        this.newPassword = '';
                        this.checkNewPassword = '';
                        break;

                };

                this.buffer = false;
            })
            .catch(err => {
                this.toasts.push({
                title: 'Error',
                content: '??????????????????????????????????????????!'
                });

                this.resetPasswordModel = false;
                this.buffer = false;
                this.checkJWT();
            });

        },

        updateBind() {
            if (this.buffer) return;

            this.buffer = true;

            let bind = [];

            this.item.bind.forEach((item, index) => {
                if (item.checked) {
                    bind.push(item.value);
                }
            });

            if (bind.length === 0) {
                this.toasts.push({
                    title: 'Error',
                    content: '?????????????????????!'
                });
                this.buffer = false;
                return;
            };

            bind = bind.join(';');

            const data = {
                token: this.item.token,
                bind: bind,
            };

            request({
                method: 'PUT',
                url: '/account/bind',
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
                            content: '????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 0:
                        this.toasts.push({
                            title: 'Error',
                            content: '??????????????????????????????????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 101:
                        this.toasts.push({
                            title: 'Error',
                            content: '??????????????????????????????????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 102:
                        this.toasts.push({
                            title: 'Error',
                            content: 'Token???????????????????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 110:
                        this.toasts.push({
                            title: 'Error',
                            content: '????????????????????????????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;

                    case 121:
                        this.toasts.push({
                            title: 'Error',
                            content: 'JWT????????????????????????!'
                        });
                        this.optionsModel = false;
                        this.buffer = false;
                        this.checkJWT();
                        break;
                };
            })
            .catch(err => {
                this.toasts.push({
                    title: 'Error',
                    content: '??????????????????????????????????????????!'
                });

                this.optionsModel = false;
                this.buffer = false;
                this.checkJWT();
            });

            
        },
    }
}
</script>
