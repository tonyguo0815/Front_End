<template>
    <CContainer>
        <CRow>
            <CCard>
                <CCardBody>
                    <h2>Notify Management</h2>
                    <CTable align="middle" reponsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" class="w-25">Target</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25">Type</CTableHeaderCell>
                                <CTableHeaderCell scope="col" class="w-25"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in data" :key="item.index">
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.target}}</CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    {{item.type}}</CTableDataCell>
                                <CTableDataCell v-if="item.index <= page * size && item.index > (page-1) * size">
                                    <CButton color="danger">
                                        <CIcon name="cil-trash"></CIcon>
                                        取消訂閱
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
    name: 'NotifyManagement',
    data() {
        return {
            data: [
                {
                    target: 'try1',
                    type: 'try1',
                    index: 1
                },
                {
                    target: 'try2',
                    type: 'try1',
                    index: 2
                },
                {
                    target: 'try3',
                    type: 'try1',
                    index: 3
                },
                {
                    target: 'try4',
                    type: 'try1',
                    index: 4
                },
                {
                    target: 'try5',
                    type: 'try1',
                    index: 5
                },
                {
                    target: 'try6',
                    type: 'try1',
                    index: 6
                },
                {
                    target: 'try7',
                    type: 'try1',
                    index: 7
                },
                {
                    target: 'try8',
                    type: 'try1',
                    index: 8
                },
                {
                    target: 'try9',
                    type: 'try1',
                    index: 9
                },
                {
                    target: 'try10',
                    type: 'try1',
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