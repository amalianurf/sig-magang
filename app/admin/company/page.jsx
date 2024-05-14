'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@component/components/Button'
import ConfirmDeleteModal from '@component/components/modal/ConfirmDeleteModal'
import { DataGrid, useGridApiContext, useGridSelector, gridPageSelector, gridPageCountSelector, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Pagination, PaginationItem, createTheme, ThemeProvider } from '@mui/material'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

function page() {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState({
        showModal: false,
        id: ''
    })
    const [filterModel, setFilterModel] = useState({
        items: [],
        quickFilterExcludeHiddenColumns: false,
    })
    const router = useRouter()

    useEffect(() => {
        const fetchDataCompanies = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setCompanies(data)
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchDataCompanies()
    }, [])

    const handleDelete = (id) => {
        toast.loading('Menghapus data...')
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': Cookies.get('access-token'),
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            const newData = companies.filter(company => company.id !== id)
            setCompanies(newData)
            toast.dismiss()
            toast.success(data.message)
            setConfirmDelete({
                showModal: false,
                id: ''
            })
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error)
        })
    }

    const formatRowData = (data) => {
        return data.map((row, index) => {
            return { ...row, no: index + 1, latitude: row.location ? row.location.coordinates[0] : null, longitude: row.location ? row.location.coordinates[1] : null }
        })
    }

    const rows = formatRowData(companies)

    const columns = [
        { field: 'no', headerName: 'No.', width: 70 },
        { field: 'brand_name', headerName: 'Nama Brand', flex: 1 },
        { field: 'company_name', headerName: 'Nama Perusahaan', flex: 1 },
        { field: 'address', headerName: 'Alamat', flex: 1 },
        { field: 'city', headerName: 'Kabupaten/Kota', flex: 1 },
        { field: 'latitude', headerName: 'Latitude', flex: 1 },
        { field: 'longitude', headerName: 'Longitude', flex: 1 },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex justify-center items-center gap-2 w-full h-full'>
                    <Button type={'button'} href={`/admin/company/edit/${params.id}`} name={'Edit'} buttonStyle={'text-center font-medium text-sm text-white bg-green hover:bg-green/[.3] rounded-md px-2 py-1 w-full'} />
                    <Button type={'button'} onClick={() => setConfirmDelete({ showModal: true, id: params.id })} name={'Hapus'} buttonStyle={'text-center font-medium text-sm text-white bg-red hover:bg-red/[.3] rounded-md px-2 py-1 w-full'} />
                </div>
            )
        }
    ]

    const paginationTheme = createTheme({
        palette: {
            iris: {
                main: '#5D5FEF',
                contrastText: '#FFFFFF'
            },
        },
    })

    const customPagination = () => {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector)
        const pageCount = useGridSelector(apiRef, gridPageCountSelector)

        return (
            <Pagination
                color='iris'
                count={pageCount}
                page={page + 1}
                renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        )
    }

    const handleCellClick = (params) => {
        if (params.field !== 'actions') {
            router.push(`company/${params.id}`)
        }
    }

    return (
        <section className='p-10'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className='relative'>
                        <Button type={'button'} href={'/admin/company/add'} name={'Tambah Data'} buttonStyle={'absolute right-0 top-0 z-10 w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
                        <ThemeProvider theme={paginationTheme}>
                            <DataGrid
                                autoHeight
                                pagination
                                rows={rows}
                                columns={columns}
                                slots={{
                                    toolbar: GridToolbarQuickFilter,
                                    pagination: customPagination
                                }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true
                                    }
                                }}
                                rowSelection={false}
                                filterModel={filterModel}
                                onCellClick={handleCellClick}
                                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                                initialState={{pagination: {paginationModel: {pageSize: 25}}}}
                                classes={{
                                    columnHeader: 'bg-neutral-dark !font-semibold',
                                    row: 'odd:bg-white even:bg-neutral',
                                }}
                                sx={{
                                    border: 0,
                                    borderRadius: 2,
                                    '& .MuiDataGrid-main': { borderRadius: 2, boxShadow: '0 2px 8px #0000001F', marginTop: '12px' },
                                    '& .MuiDataGrid-footerContainer': { border: 0, marginTop: '12px' },
                                    '& .MuiDataGrid-cell': { border: 0, cursor: 'pointer' },
                                    '& .MuiDataGrid-cell:focus': { outline: '0 !important' },
                                    '& .MuiDataGrid-cell:focus-within': { outline: '0 !important' },
                                    '& .MuiDataGrid-topContainer::after': { height: 0 },
                                    '& .MuiFormControl-root': { border: 1, borderRadius: 2, borderColor: '#7C7C7C', width: '312px', padding: '2px 10px' },
                                    '& .MuiFormControl-root:focus-within': { boxShadow: 'inset 0 0 0 1px #5D5FEF', borderColor: '#5D5FEF' },
                                    '& .MuiSvgIcon-root': { color: '#7C7C7C' },
                                    '& .MuiInputBase-root::before': { borderBottom: '0 !important' },
                                    '& .MuiInputBase-root::after': { borderBottom: 0 }
                                }}
                            />
                        </ThemeProvider>
                    </div>
                    {confirmDelete.showModal && (
                        <ConfirmDeleteModal handleDelete={handleDelete} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} />
                    )}
                </>
            )}
        </section>
    )
}

export default page