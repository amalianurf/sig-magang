'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NavBar from '@component/components/navigations/NavBar'

const Map = dynamic(() => import('@component/components/map/Map'), { ssr: false })

function page() {
    const [navbarHeight, setNavbarHeight] = useState()
    const [geoJsonData, setGeoJsonData] = useState()
    const [filteredGeoJsonData, setFilteredGeoJsonData] = useState()
    const [sectors, setSectors] = useState()
    const [companies, setCompanies] = useState()
    const [filteredCompanies, setFilteredCompanies] = useState()
    const [selectedSector, setSelectedSector] = useState()
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    })
    const [loading, setLoading] = useState({
        geojson: true,
        sector: true,
        company: true
    })

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
                setLoading({ ...loading, geojson: false })
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
                setLoading({ ...loading, company: false })
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
                setLoading({ ...loading, sector: false })
            })
        }

        fetchDataGeoms()
        fetchDataCompanies()
        fetchDataSectors()
    }, [])

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (option) => {
        setSelectedSector(option)

        if (option) {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities?sector=${option.value}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                if (data) {
                    const groupedOpportunityByCity = data.reduce((accumulator, item) => {
                        if (!accumulator[item.Company.city]) {
                            accumulator[item.Company.city] = []
                        }
        
                        accumulator[item.Company.city].push(item)
        
                        return accumulator
                    }, {})
        
                    const uniqueCompanyIds = [...new Set(data.map(item => item.company_id))]
        
                    const uniqueCompanies = uniqueCompanyIds.map(id => {
                        const company = data.find(item => item.company_id === id)
        
                        return {
                            id: id,
                            city: company.Company.city,
                            location: company.Company.location
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
        
                    const newGeoJsonFeatures = geoJsonData.features.map(feature => {
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

                    if (newGeoJsonFeatures.length > 0) {
                        setFilteredGeoJsonData({
                            type: 'FeatureCollection',
                            features: newGeoJsonFeatures
                        })
                    } else {
                        setFilteredGeoJsonData(null)
                    }
                }
            }).catch((error) => {
                console.error('Error:', error)
            })
        } else {
            setFilteredCompanies(companies)
            setFilteredGeoJsonData(geoJsonData)
        }
    }

    return (
        <>
            <header>
                <NavBar setNavbarHeight={setNavbarHeight} />
            </header>
            <main style={{ paddingTop: navbarHeight }} className='w-full'>
                <Map
                    navbarHeight={navbarHeight}
                    loading={loading}
                    geoJsonData={filteredGeoJsonData}
                    companies={filteredCompanies}
                    sectors={sectors}
                    dateRange={dateRange}
                    selectedSector={selectedSector}
                    handleDateChange={handleDateChange}
                    handleSelectChange={handleSelectChange}
                />
            </main>
        </>
    )
}

export default page