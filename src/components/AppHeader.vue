<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none">
      </CHeaderBrand>
      <CHeaderNav>
        <CDropdown variant="nav-item">
          <CDropdownToggle v-if="$store.state.userType" placement="bottom-end" class="py-0" :caret="false">
            <CAvatar color="info" status="success" size="lg"><CIcon icon="cil-user" /></CAvatar>
          </CDropdownToggle>
          <CDropdownToggle v-else placement="bottom-end" class="py-0" :caret="false" @click="showLogin()">
            <CAvatar color="secondary" status="danger" size="lg">?</CAvatar>
          </CDropdownToggle>
          <CDropdownMenu class="pt-0">
            <CDropdownItem v-if="$store.state.userType"  @click="showResetPassword()">
              <CIcon icon="cil-settings"/> ResetPassword
            </CDropdownItem>
            <CDropdownItem v-if="$store.state.userType"  @click="logout()">
              <CIcon icon="cil-account-logout"/> Logout
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
    </CContainer>
  </CHeader>

  <CModal alignment="center" :visible="loginModel" @close="() => { loginModel = false }">
    <CModalHeader>
      <CModalTitle>Login</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CFormLabel>Account</CFormLabel>
        <CFormInput id="Account" v-model="account" />
      </CForm>
      <CForm>
        <CFormLabel>Password</CFormLabel>
        <CFormInput id="password" v-model="password" type="password" />
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="info"    @click="login()"  :disabled="buffer"><CIcon name="cil-check-alt"/> Login</CButton>
      <CButton color="secondary"  @click="() => { loginModel = false }">
        <CIcon name="cil-X"/> Close
      </CButton>
    </CModalFooter>
  </CModal>

  <CModal alignment="center" :visible="resetPasswordModel" @close="() => { resetPasswordModel = false }">
    <CModalHeader>
      <CModalTitle>Reset Password</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <CFormLabel>Account</CFormLabel>
        <CFormInput id="tagetAccount" v-model="account" disabled/>
        <CFormLabel>New Password</CFormLabel>
        <CFormInput id="newPassword" v-model="newPassword" type="password" />
        <CFormLabel>Check New Password</CFormLabel>
        <CFormInput id="checkNewPassword" v-model="checkNewPassword" type="password" />
    </CModalBody>
    <CModalFooter>
      <CButton color="info"    @click="resetPassword()"  :disabled="buffer"><CIcon name="cil-sync"/> Reset</CButton>
      <CButton color="secondary"  @click="() => { resetPasswordModel = false }">
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
</template>
  
<script>
import request from '@/utils/request';
export default {
  name: 'AppHeader',
  data() {
    return {
      loginModel: false,
      resetPasswordModel:false,

      account: '',
      password: '',

      newPassword:'',
      checkNewPassword:'',

      buffer: false,

      toasts: []
    }
  },
  methods: {
    showLogin() {
      this.loginModel = true;
      this.account = '';
      this.password = '';
    },

    showResetPassword() {
      this.resetPasswordModel = true;

      if (this.$store.state.userAccount) this.account = this.$store.state.userAccount;

      this.newPassword = '';
      this.checkNewPassword = '';
    },

    login() {
      if (this.buffer) return;

      this.buffer = true;

      if (this.account === '' || this.password === '') {
        this.toasts.push({
          title: 'Error',
          content: '請確實填入帳號密碼!'
        });
        this.buffer = false;
        return;
      };

      const data = {
        account: this.account,
        password: this.password
      };

      request({
          method: 'POST',
          url: '/auth/login',
          data: data
      })
      .then(res => {
        let result = res.data;
        
        switch(result.status) {
          case 1:
            this.$store.commit({ type: 'updateUserAccount', value: result.data.account});
            this.$store.commit({ type: 'updateUserType',    value: result.data.type});
            this.$store.commit({ type: 'updateUserToken',   value: result.data.token});
            this.$store.commit({ type: 'updateJwt',         value: result.data.jwt});

            this.toasts.push({
              title: 'Success',
              content: '登入成功!'
            });
            this.loginModel = false;
            break;

          case 0:
            this.toasts.push({
              title: 'Error',
              content: '系統發生錯誤，請與管理者聯繫!'
            });
            this.loginModel = false;
            break;

          case 101:
            this.toasts.push({
              title: 'Error',
              content: '資料格式錯誤，請與管理者聯繫!'
            });
            this.loginModel = false;
            break;

          case 102:
            this.toasts.push({
              title: 'Error',
              content: '帳號不存在，請確認後再登入!'
            });
            break;

          case 103:
            this.toasts.push({
              title: 'Error',
              content: '密碼錯誤，請確認後再登入!'
            });
            break;

          case 104:
            this.toasts.push({
              title: 'Error',
              content: '多次嘗試登入失敗，暫時不允許嘗試登入!'
            });
            break;

          case 105:
            this.toasts.push({
              title: 'Error',
              content: '多次嘗試登入失敗，暫時不允許嘗試登入!'
            });
            break;

          case 106:
            this.toasts.push({
              title: 'Error',
              content: '您的密碼已過期，請重新設定密碼!'
            });
            this.loginModel = false;

            this.showResetPassword();
            break;
        };

        this.buffer = false;
      })
      .catch(err => {
        this.toasts.push({
          title: 'Error',
          content: '系統發生錯誤，請與管理者聯繫!'
        });

        this.loginModel = false;
        this.buffer = false;
      });
    },

    logout() {
      this.$store.commit({ type: 'updateUserAccount', value: ''});
      this.$store.commit({ type: 'updateUserType',    value: ''});
      this.$store.commit({ type: 'updateUserToken',   value: ''});
      this.$store.commit({ type: 'updateJwt',         value: ''});

      this.toasts.push({
        title: 'Success',
        content: '登出成功!'
      });
    },

    resetPassword() {
      if (this.buffer) return;

      this.buffer = true;

      const regex = new RegExp("^((?=.{8,12}$)(?=.*[a-z])(?=.*[A-Z]))");

      if (this.account === '' || this.newPassword === '' || this.checkNewPassword === '') {
        this.toasts.push({
          title: 'Error',
          content: '請確實填入帳號密碼!'
        });
        this.buffer = false;
        return;
      };

      if (this.newPassword !== this.checkNewPassword) {
        this.toasts.push({
          title: 'Error',
          content: '新密碼與確認密碼不相符!'
        });
        this.buffer = false;
        return;
      };

      if (!regex.test(this.newPassword)) {
        this.toasts.push({
          title: 'Error',
          content: '密碼格式錯誤，請確認後再設定!'
        });
        this.buffer = false;
        return;
      };


      const data = {
        account: this.account,
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
              content: '更新密碼成功，請重新登入!'
            });
            this.resetPasswordModel = false;

            this.logout();
            break;

          case 0:
            this.toasts.push({
              title: 'Error',
              content: '系統發生錯誤，請與管理者聯繫!'
            });
            this.resetPasswordModel = false;
            break;

          case 101:
            this.toasts.push({
              title: 'Error',
              content: '資料格式錯誤，請與管理者聯繫!'
            });
            this.resetPasswordModel = false;
            break;

          case 102:
            this.toasts.push({
              title: 'Error',
              content: '帳號不存在，請重新操作!'
            });
            this.resetPasswordModel = false;
            break;

          case 103:
            this.toasts.push({
              title: 'Error',
              content: '請勿使用最近三次使用過的密碼!'
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
          content: '系統發生錯誤，請與管理者聯繫!'
        });

        this.resetPasswordModel = false;
        this.buffer = false;
      });

    },
  }
}
</script>
  