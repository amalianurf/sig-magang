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
    const [sectorIds, setSectorIds] = useState([])
    const [companyIds, setCompanyIds] = useState([])
    const [companies, setCompanies] = useState([])
    const [opportunities, setOpportunities] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState({
        showModal: false,
        id: ''
    })
    const [filterModel, setFilterModel] = useState({
        items: [],
        quickFilterExcludeHiddenColumns: false,
    })

    useEffect(() => {
        const fetchDataSectors = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sectors`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setSectorIds(data.map(item => item.id))
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchDataOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities/all`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then(async (data) => {
                setOpportunities(data)

                await fetchCompanies()
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchDataSectors()
        fetchDataOpportunities()
    }, [])

    const fetchCompanies = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies/all`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            setCompanies(data)
            setCompanyIds(data.map(item => item.id))
        })
    }

    const handleDelete = (id) => {
        toast.loading('Menghapus data...')
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`, {
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
            const newData = opportunities.filter(opportunity => opportunity.id !== id)
            setOpportunities(newData)
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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const formatRowData = (data) => {
        return data.map((row, index) => {
            return { ...row, no: index + 1, duration: row.duration ? `${row.duration.toString()} bulan` : null, start_period: formatDate(row.start_period) }
        })
    }

    const rows = formatRowData(opportunities)

    const columns = [
        { field: 'no', headerName: 'No.', width: 70 },
        { field: 'name', headerName: 'Nama', flex: 1 },
        { field: 'activity_type', headerName: 'Sistem', flex: 1 },
        { field: 'duration', headerName: 'Durasi', flex: 1 },
        { field: 'start_period', headerName: 'Periode Mulai', flex: 1 },
        { field: 'quota', headerName: 'Kuota', flex: 1 },
        { field: 'min_semester', headerName: 'Min Semester', flex: 1 },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => {
                const company = companies.find(item => item.id === params.row.company_id)

                if (company) {
                    return (
                        <div className='flex justify-center items-center gap-2 w-full h-full'>
                            <Button type={'button'} href={`/admin/opportunity/edit/${params.id}`} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/admin/opportunity/edit/${params.id}`, '_self') }} name={'Edit'} buttonStyle={'text-center font-medium text-sm text-white bg-green hover:bg-green/[.3] rounded-md px-2 py-1 w-full'} />
                            { params.row.accepted ? (
                                <Button type={'button'} onClick={() => setConfirmDelete({ showModal: true, id: params.id })} name={'Hapus'} buttonStyle={'text-center font-medium text-sm text-white bg-red hover:bg-red/[.3] rounded-md px-2 py-1 w-full'} />
                            ) : (
                                <Button type={'button'} onClick={ company.accepted ? () => handleAccept(params.id) : null } name={'Terima'} buttonStyle={`text-center font-medium text-sm text-white ${ company.accepted ? 'bg-iris hover:bg-iris/[.3]' : 'bg-grey cursor-default' } rounded-md px-2 py-1 w-full`} />
                            )}
                        </div>
                    )
                }
            }
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
            window.open(`${process.env.NEXT_PUBLIC_CLIENT}/admin/opportunity/${params.id}`, '_self')
        }
    }

    const handleAccept = (id) => {
        toast.loading('Menerima data...')
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    accepted: true
                })
            }).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setOpportunities(prevOpportunities =>
                    prevOpportunities.map(opportunity =>
                        opportunity.id === id ? { ...opportunity, accepted: true } : opportunity
                    )
                )
                toast.dismiss()
                toast.success('Data lowongan telah diterima')
            })
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error.message)
        })
    }

    const addSycnCompanies = async (data, chunkSize) => {
        let response

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chunk)
            })
    
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }
        }

        return response.json()
    }

    const addSycnOpportunities = async (data, chunkSize) => {
        let response

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chunk)
            })
    
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }
        }

        return response.json()
    }

    const syncData = async () => {
        toast.loading('Sinkronisasi data...')
        await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities/active`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then(async (data) => {
            const opportunityIds = opportunities.map(item => item.id)
            const newOpportunities = data.filter(item => !opportunityIds.includes(item.id))
            const newOpportunityIds = newOpportunities.map(item => item.id)
            const newCompanyIds = [...new Set(data.map(item => item.company_id))].filter(id => !companyIds.includes(id))

            if (newCompanyIds.length > 0) {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ids: newCompanyIds})
                }).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then(async (companies) => {
                    const sectors = companies.map(item => ({
                        id: item.sector_id,
                        name: item.sector_name
                    }))
                    const newSectors = [...new Set(sectors.map(item => JSON.stringify(item)))].map(item => JSON.parse(item)).filter(item => !sectorIds.includes(item.id))

                    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector`, {
                        method: 'POST',
                        headers: {
                            'Authorization': Cookies.get('access-token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newSectors)
                    }).then(async (response) => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.message)
                            })
                        }
                    })

                    await addSycnCompanies(companies, 80)
                })
            }

            if (newOpportunityIds.length > 0) {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ids: newOpportunityIds })
                }).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then(async (details) => {
                    const mergedData = newOpportunities.map(opportunity => {
                        const detail = details.find(item => item.id === opportunity.id)
                        if (detail) {
                            return { ...opportunity, ...detail }
                        }
                        return opportunity
                    })

                    await addSycnOpportunities(mergedData, 60)
                    await fetchCompanies()
                    setOpportunities([...mergedData, ...opportunities])
                })
            }

            toast.dismiss()
            toast.success('Sinkronisasi data selesai')
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Sinkronisasi data gagal')
        })
    }

    return (
        <section className='p-10'>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className='relative'>
                        <div className='absolute right-0 top-0 z-10 flex items-center gap-2'>
                            <Button type={'button'} onClick={syncData} name={'Sinkronisasi'} buttonStyle={'w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
                            <Button type={'button'} href={'/admin/opportunity/add'} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/admin/opportunity/add`, '_self') }} name={'Tambah Data'} buttonStyle={'w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
                        </div>
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