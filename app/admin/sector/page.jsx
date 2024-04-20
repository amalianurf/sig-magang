'use client'
import React, { useState, useEffect } from 'react'
import Button from '@component/components/Button'
import { DataGrid, useGridApiContext, useGridSelector, gridPageSelector, gridPageCountSelector, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Pagination, PaginationItem, createTheme, ThemeProvider } from '@mui/material'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

function page() {
    const [sector, setSector] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterModel, setFilterModel] = useState({
        items: [],
        quickFilterExcludeHiddenColumns: false,
    })

    useEffect(() => {
        const fetchDataSector = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sectors`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setSector(data)
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
                setLoading(false)
            })
        }

        fetchDataSector()
    }, [sector])

    const handleDelete = (id) => {
        toast.loading('Menghapus data...')
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${id}`, {
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
            toast.dismiss()
            toast.success(data.message)
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error)
        })
    }

    const addRowNumbers = (data) => {
        return data.map((row, index) => {
            return { ...row, no: index + 1 }
        })
    }

    const rows = addRowNumbers(sector)

    const columns = [
        { field: 'no', headerName: 'No.', width: 70 },
        { field: 'name', headerName: 'Sektor', flex: 1 },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex justify-center items-center gap-2 w-full h-full'>
                    <Button type={'button'} href={`/admin/sector/edit/${params.id}`} name={'Edit'} buttonStyle={'text-center font-medium text-sm text-white bg-green hover:bg-green/[.3] rounded-md px-2 py-1 w-full'} />
                    <Button type={'button'} onClick={() => handleDelete(params.id)} name={'Hapus'} buttonStyle={'text-center font-medium text-sm text-white bg-red hover:bg-red/[.3] rounded-md px-2 py-1 w-full'} />
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

    return (
        <section className='p-10'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className='relative'>
                        <Button type={'button'} href={'/admin/sector/add'} name={'Tambah Data'} buttonStyle={'absolute right-0 top-0 z-10 w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
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
                                filterModel={filterModel}
                                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                                initialState={{pagination: {paginationModel: {pageSize: 100}}}}
                                classes={{
                                    columnHeader: 'bg-neutral-dark !font-semibold',
                                    row: 'odd:bg-white even:bg-neutral',
                                }}
                                sx={{
                                    border: 0,
                                    borderRadius: 2,
                                    '& .MuiDataGrid-main': { borderRadius: 2, boxShadow: '0 2px 8px #0000001F', marginTop: '12px' },
                                    '& .MuiDataGrid-footerContainer': { border: 0, marginTop: '12px' },
                                    '& .MuiDataGrid-cell': { border: 0 },
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
                </>
            )}
        </section>
    )
}

export default page