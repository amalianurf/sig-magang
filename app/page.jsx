'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NavBar from '@component/components/navigations/NavBar'

const Map = dynamic(() => import('@component/components/map/Map'), { ssr: false })

function page() {
    const [navbarHeight, setNavbarHeight] = useState()
    const [geoJsonData, setGeoJsonData] = useState()
    const [sectors, setSectors] = useState()
    const [companies, setCompanies] = useState()
    const [opportunities, setOpportunities] = useState()
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

    return (
        <>
            <header>
                <NavBar setNavbarHeight={setNavbarHeight} />
            </header>
            <main style={{ paddingTop: navbarHeight }} className='w-full'>
                {loading.geojson && loading.sector && loading.company ? (
                    <div className='p-10'>Loading...</div>
                ) : (
                    <Map geoJsonData={geoJsonData} navbarHeight={navbarHeight} companies={companies} />
                )}
            </main>
        </>
    )
}

export default page