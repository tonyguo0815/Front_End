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
          <CDropdownToggle v-else placement="bottom-end" class="py-0" :caret="false" @click="toggleLogin()">
            <CAvatar color="secondary" status="danger" size="lg">?</CAvatar>
          </CDropdownToggle>
          <CDropdownMenu class="pt-0">
            <CDropdownItem v-if="$store.state.userType"  @click="logout()">
              <CIcon icon="cil-lock-locked"/> Logout
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
      <CButton color="primary"    @click="login()">Login</CButton>
      <CButton color="secondary"  @click="() => { loginModel = false }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <CModal size="sm" alignment="center" :visible="logoutModel" @close="() => { logoutModel = false }">
    <CModalHeader>
      <CModalTitle>Logout</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="danger" :disabled="buffer">Logout</CButton>
      <CButton color="secondary" @click="() => { logoutModel = false }">
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
</template>
  
<script>
import request from '@/utils/request';
export default {
  name: 'AppHeader',
  data() {
    return {
      loginModel: false,
      logoutModel: false,
      account: '',
      password: '',

      buffer: false,

      toasts: []
    }
  },
  methods: {
    toggleLogin() {
      this.loginModel = true;
      this.account = '';
      this.password = '';
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

      request
      .post('/auth/login', data)
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
        };

        this.buffer = false;
      })
      .catch(err => {
        this.toasts.push({
          title: 'Error',
          content: '系統發生錯誤，請與管理者聯繫!'
        });
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
    }
  }
}
</script>
  