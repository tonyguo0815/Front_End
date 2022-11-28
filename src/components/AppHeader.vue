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
          <CDropdownToggle placement="bottom-end" class="py-0" :caret="false" @click="toggleLogin()">
            <CAvatar color="secondary" status="danger" size="lg">?</CAvatar>
          </CDropdownToggle>
          <CDropdownMenu class="pt-0">
            <!-- <CDropdownItem>
              <CIcon icon="cil-lock-locked" /> Logout
            </CDropdownItem> -->
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
        <CFormInput id="Account" v-model="Account" />
      </CForm>
      <CForm>
        <CFormLabel>Password</CFormLabel>
        <CFormInput id="password" v-model="password" type="password" />
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary">Login</CButton>
      <CButton color="secondary" @click="() => { loginModel = false }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <CModal size="sm" alignment="center" :visible="logoutModel" @close="() => { logoutModel = false }">
    <CModalHeader>
      <CModalTitle>Logout</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="danger">Logout</CButton>
      <CButton color="secondary" @click="() => { logoutModel = false }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>
  
<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      loginModel: false,
      logoutModel: false,
      Account: '',
      password: ''
    }
  },
  methods: {
    toggleLogin() {
      this.loginModel = true;
      this.Account = '';
      this.password = '';
    }
  }
}
</script>
  