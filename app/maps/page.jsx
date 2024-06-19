'use client'
import React, { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
import CompanyInfoPanel from '@component/components/panel/CompanyInfoPanel'
import toast from 'react-hot-toast'
import OpportunityListPanel from '@component/components/panel/OpportunityListPanel'
import { HeaderContext } from './layout'

const Map = dynamic(() => import('@component/components/map/Map'), {
    ssr: false,
    loading: () => { return <div className='p-10'>Sebentar lagi...</div> }
})

function page() {
    const [geoJsonData, setGeoJsonData] = useState()
    const [filteredGeoJsonData, setFilteredGeoJsonData] = useState()
    const [opportunityIds, setOpportunityIds] = useState()
    const [filteredOpportunityIds, setFilteredOpportunityIds] = useState()
    const [city, setCity] = useState()
    const [companyId, setCompanyId] = useState()
    const [companies, setCompanies] = useState()
    const [filteredCompanies, setFilteredCompanies] = useState()
    const [sectors, setSectors] = useState()
    const [selectedSector, setSelectedSector] = useState()
    const [isFiltered, setIsFiltered] = useState(false)
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    })
    const [loading, setLoading] = useState({
        geojson: true,
        sector: true,
        company: true,
        opportunity: true
    })
    const { navbarHeight } = useContext(HeaderContext)

    useEffect(() => {
        const fetchDataGeoms = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/geoms`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setGeoJsonData(data)
                setFilteredGeoJsonData(data)
                setLoading({ ...loading, geojson: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchDataOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                const ids = data.map(item => item.id)
                setOpportunityIds(ids)
                setFilteredOpportunityIds(ids)
                setLoading({ ...loading, opportunity: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

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
                setFilteredCompanies(data)
                setLoading({ ...loading, company: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchDataSectors = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sectors`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setSectors(data)
                setLoading({ ...loading, sector: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchDataGeoms()
        fetchDataOpportunities()
        fetchDataCompanies()
        fetchDataSectors()
    }, [])

    const updateGeoJsonData = (opportunities) => {
        const groupedOpportunityByCity = opportunities.reduce((accumulator, item) => {
            if (!accumulator[item.Company.city]) {
                accumulator[item.Company.city] = []
            }

            accumulator[item.Company.city].push(item)

            return accumulator
        }, {})

        const uniqueCompanyIds = [...new Set(opportunities.map(item => item.Company.id))]

        const uniqueCompanies = uniqueCompanyIds.map(id => {
            const company = companies.find(item => item.id === id)

            if (company) {
                return {
                    id: id,
                    city: company.city,
                    location: company.location
                }
            }
        })

        setFilteredCompanies(uniqueCompanies)

        const groupedCompanyByCity = uniqueCompanies.reduce((accumulator, item) => {
            if (!accumulator[item.city]) {
                accumulator[item.city] = []
            }

            accumulator[item.city].push(item)

            return accumulator
        }, {})

        const newGeoJsonFeatures = geoJsonData && geoJsonData.features.map(feature => {
            const city = feature.properties.city

            if (groupedOpportunityByCity[city] && groupedOpportunityByCity[city].length > 0) {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        companies: groupedCompanyByCity[city].length,
                        opportunities: groupedOpportunityByCity[city].length
                    }
                }
            } else {
                return null
            }
        }).filter(feature => feature !== null)

        setFilteredGeoJsonData({
            type: 'FeatureCollection',
            features: newGeoJsonFeatures
        })

        setIsFiltered(true)
    }

    const handleSelectChange = (option) => {
        setSelectedSector(option)
    }

    const handleFilter = async () => {
        if (geoJsonData) {
            if ((dateRange.start && dateRange.end) || selectedSector) {
                fetch(selectedSector ? `${process.env.NEXT_PUBLIC_SERVER}/api/opportunities?sector=${selectedSector.value}` : `${process.env.NEXT_PUBLIC_SERVER}/api/opportunities`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then(async (data) => {
                    if (data) {
                        if (dateRange.start && dateRange.end) {
                            const filteredOpportunities = data.filter(function(opportunity) {
                                const startPeriod = new Date(opportunity.start_period)
                                const endDate = new Date(dateRange.end.getTime() + 24 * 60 * 60 * 1000)
    
                                return startPeriod >= dateRange.start && startPeriod <= endDate
                            })
                
                            let joinedData = []
                
                            filteredOpportunities.forEach((opportunity) => {
                                const company = companies.find((company) => {
                                    return company.id == opportunity.company_id
                                })
                
                                if (company) {
                                    joinedData.push({
                                        id: opportunity.id,
                                        start_period: opportunity.start_period,
                                        Company: {
                                            id: company.id,
                                            city: company.city
                                        }
                                    })
                                }
                            })
    
                            const opportunitiesIds = joinedData.map(item => item.id)
                            setFilteredOpportunityIds(opportunitiesIds)
                            updateGeoJsonData(joinedData)
                        } else {
                            const opportunitiesIds = data.map(item => item.id)
                            setFilteredOpportunityIds(opportunitiesIds)
                            updateGeoJsonData(data)
                        }
                    }
                }).catch((error) => {
                    console.error('Error:', error)
                })
            } else {
                toast.error('Harap lengkapi rentang tanggal atau pilih sektor')
            }
        } else {
            toast.error('Harap tunggu hingga label warna daerah muncul')
        }
    }

    const handleResetData = () => {
        setFilteredCompanies(companies)
        setFilteredGeoJsonData(geoJsonData)
        setSelectedSector(null)
        setDateRange({
            start: '',
            end: ''
        })
        setIsFiltered(false)
    }

    return (
        <>
            {loading.company && loading.geojson && loading.sector && loading.opportunity ? (
                <div className='p-10'>Loading...</div>
            ) : (
                <Map
                    navbarHeight={navbarHeight}
                    geoJsonData={filteredGeoJsonData}
                    companies={filteredCompanies}
                    sectors={sectors}
                    dateRange={dateRange}
                    selectedSector={selectedSector}
                    isFiltered={isFiltered}
                    setCity={setCity}
                    setCompanyId={setCompanyId}
                    setDateRange={setDateRange}
                    handleSelectChange={handleSelectChange}
                    handleFilter={handleFilter}
                    handleResetData={handleResetData}
                />
            )}
            <section style={{ paddingTop: navbarHeight }} className={`absolute bg-white top-0 left-0 min-h-full max-h-screen w-[582px] z-[999] overflow-scroll ${companyId || city ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-in-out`}>
                {companyId && (
                    <CompanyInfoPanel
                        companies={companies}
                        companyId={companyId}
                        setCompanyId={setCompanyId}
                        opportunityIds={opportunityIds}
                        filteredOpportunityIds={filteredOpportunityIds}
                        setFilteredOpportunityIds={setFilteredOpportunityIds}
                    />
                )}
                {city && (
                    <OpportunityListPanel
                        city={city}
                        setCity={setCity}
                        opportunityIds={opportunityIds}
                        filteredOpportunityIds={filteredOpportunityIds}
                        setFilteredOpportunityIds={setFilteredOpportunityIds}
                    />
                )}
            </section>
        </>
    )
}

export default page