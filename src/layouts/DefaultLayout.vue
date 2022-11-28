<template>
    <div>
      <AppSidebar />
      <div class="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div class="body flex-grow-1 px-3">
          <CContainer lg>
            <router-view />
          </CContainer>
        </div>
      </div>
    </div>
</template>

<script>
import { CContainer } from '@coreui/vue'
import { useStore } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default {
    name: 'DefaultLayout',
    components: {
        CContainer,
        AppHeader,
        AppSidebar,
    },
    setup() {
        const store = useStore()
        return {
            store,
        }
    },
    methods: {
    },
}
</script>