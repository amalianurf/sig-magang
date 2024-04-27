'use client'
import React, { useState, useEffect } from 'react'
import { Pagination, createTheme, ThemeProvider } from '@mui/material'
import Button from '@component/components/Button'
import OpportunityCard from '@component/components/opportunity/OpportunityCard'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

function page() {
    const [opportunities, setOpportunities] = useState([])
    const [filteredOpportunities, setFilteredOpportunities] = useState([])
    const [search, setSearch] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const opportunitiesPerPage = 30

    useEffect(() => {
        const fetchDataOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then(async (companies) => {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then((data) => {
                    let joinedData = []
    
                    data.forEach((opportunity) => {
                        const company = companies.find((company) => {
                            return company.id == opportunity.company_id
                        })
    
                        if (company) {
                            joinedData.push({
                                id: opportunity.id,
                                name: opportunity.name,
                                brand_name: company.brand_name,
                                logo: company.logo,
                                city: company.city,
                                start_period: opportunity.start_period,
                                updatedAt: opportunity.updatedAt
                            })
                        }
                    })

                    joinedData.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                    setOpportunities(joinedData)
                    setFilteredOpportunities(joinedData)
                    setLoading(false)
                }).catch((error) => {
                    console.error('Error:', error)
                    setLoading(false)
                })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchDataOpportunities()
    },[])

    const indexOfLastOpportunity = currentPage * opportunitiesPerPage
    const indexOfFirstOpportunity = indexOfLastOpportunity - opportunitiesPerPage
    const currentOpportunities = filteredOpportunities.slice(indexOfFirstOpportunity, indexOfLastOpportunity)

    const paginationTheme = createTheme({
        palette: {
            iris: {
                main: '#5D5FEF',
                contrastText: '#FFFFFF'
            },
        },
    })

    const handleSearchChange = (e) => {
        const keyword = e.target.value
        setSearch(keyword)

        const filteredData = opportunities.filter((opportunity) => {
            return opportunity.name.toLowerCase().includes(keyword.toLowerCase())
        })

        setFilteredOpportunities(filteredData)
    }

    const handleCloseSearch = () => {
        setSearch('')
        setFilteredOpportunities(opportunities)
    }

    return (
        <section className='flex flex-col gap-10 p-10'>
            <div className='flex items-center justify-between'>
                <h2 className='text-iris'>Data Magang</h2>
                <div className='w-[312px] relative'>
                    <SearchIcon className='w-5 absolute left-3 top-1/2 -translate-y-1/2 text-grey' fontSize='small' />
                    <input type='text' name='search' value={search} onChange={handleSearchChange} placeholder='Search' className='w-full px-9 pt-1.5 pb-[7px] border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                    <Button type={'button'} onClick={handleCloseSearch} name={<CloseIcon className='absolute w-fit h-[85%] aspect-square p-1.5 right-3 top-1/2 -translate-y-1/2 text-grey hover:bg-neutral rounded-full' fontSize='small' />} buttonStyle={!search && 'hidden'} />
                </div>
            </div>
            <div className='w-full flex flex-col gap-6'>
                { loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
                        {currentOpportunities.map((opportunity, index) => {
                            return (
                                <OpportunityCard key={index} href={`/opportunity/${opportunity.id}`} image={opportunity.logo} name={opportunity.name} brand_name={opportunity.brand_name} city={opportunity.city} start_period={opportunity.start_period} />
                            )
                        })}
                    </div>
                )}
                <ThemeProvider theme={paginationTheme}>
                    <Pagination
                        color='iris'
                        count={Math.ceil(opportunities.length/opportunitiesPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        className='w-full flex justify-end'
                    />
                </ThemeProvider>
            </div>
        </section>
    )
}

export default page