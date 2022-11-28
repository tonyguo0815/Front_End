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
          <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
            <CAvatar color="secondary" status="danger" size="lg">?</CAvatar>
          </CDropdownToggle>
          <!-- <CDropdownMenu class="pt-0">
            <CDropdownItem>
              <CIcon icon="cil-lock-locked" /> Logout
            </CDropdownItem>
          </CDropdownMenu> -->
        </CDropdown>
      </CHeaderNav>
    </CContainer>
  </CHeader>
</template>
  
<script>
import { logo } from '@/assets/brand/logo';
import avatar from '@/assets/images/avatars/user.jpg';
export default {
  name: 'AppHeader',
  setup() {
    return {
      logo,
      avatar
    }
  },
}
</script>
  