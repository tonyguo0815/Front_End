<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Account Management</h2>
                    <CTable align="middle" reponsive>
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
                                    <CButton color="info">
                                        <CIcon name="cil-settings"></CIcon>
                                        ResetPassword
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    <CPagination align="end" aria-label="Page navigation example">
                        <CPaginationItem v-for="item in (data.length/size)" :key="item.index"
                            :active="page===item ? true : false" @click="page=item">{{item}}</CPaginationItem>
                    </CPagination>
                </CCardBody>
            </CCard>
        </CRow>
    </CContainer>
</template>

<script>
export default {
    name: 'AccountManagement',
    data() {
        return {
            data: [
                {
                    name: 'try1',
                    account: 'try1',
                    index: 1
                },
                {
                    name: 'try2',
                    account: 'try1',
                    index: 2
                },
                {
                    name: 'try3',
                    account: 'try1',
                    index: 3
                },
                {
                    name: 'try4',
                    account: 'try1',
                    index: 4
                },
                {
                    name: 'try5',
                    account: 'try1',
                    index: 5
                },
                {
                    name: 'try6',
                    account: 'try1',
                    index: 6
                },
                {
                    name: 'try7',
                    account: 'try1',
                    index: 7
                },
                {
                    name: 'try8',
                    account: 'try1',
                    index: 8
                },
                {
                    name: 'try9',
                    account: 'try1',
                    index: 9
                },
                {
                    name: 'try10',
                    account: 'try1',
                    index: 10
                },
            ],

            page: 1,
            size: 5
        }
    },
    methods: {
    }
}
</script>
