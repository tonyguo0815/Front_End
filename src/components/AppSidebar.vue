<template>
  <CSidebar position="fixed" :unfoldable="sidebarUnfoldable" :visible="sidebarVisible" @visible-change="
    (event) =>
      $store.commit({
        type: 'updateSidebarVisible',
        value: event,
      })
  ">
    <CSidebarBrand>
      <CIcon custom-class-name="sidebar-brand-full" :icon="logoNegative" :height="35" />
      <CIcon custom-class-name="sidebar-brand-narrow" :icon="sygnet" :height="35" />
    </CSidebarBrand>
    <AppSidebarNavByAdmin v-if="type === 'admin'" />
    <AppSidebarNavByUser  v-else-if="type === 'user'" />
    <AppSidebarNavByGuest v-else />
    <CSidebarToggler class="d-none d-lg-flex" @click="$store.commit('toggleUnfoldable')" />
  </CSidebar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNavByAdmin, AppSidebarNavByUser, AppSidebarNavByGuest } from '@/components/AppSidebarNav'
import { logoNegative } from '@/assets/brand/logo-negative'
import { sygnet } from '@/assets/brand/sygnet'
export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNavByAdmin,
    AppSidebarNavByUser,
    AppSidebarNavByGuest
  },
  setup() {
    const store = useStore()
    return {
      logoNegative,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
      type: computed(() => store.state.userType)
    }
  },
}
</script>