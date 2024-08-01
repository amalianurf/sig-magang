'use client'
import React, { useState, useEffect } from 'react'
import { BarChart, PieChart, pieArcLabelClasses } from '@mui/x-charts'
import TotalCard from '@component/components/dashboard/TotalCard'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import toast from 'react-hot-toast'

function page() {
    const [opportunities, setOpportunities] = useState([])
    const [activeOpportunities, setActiveOpportunities] = useState([])
    const [companies, setCompanies] = useState([])
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState({
        opportunity: true,
        company: true,
        sector: true
    })

    useEffect(() => {
        toast.dismiss()
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

                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities/active`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then((activeData) => {
                    const activeOpportunityIds = activeData.map(item => item.id)
                    const filteredOpportunities = data.filter(item => activeOpportunityIds.includes(item.id))

                    setActiveOpportunities(filteredOpportunities.length)
                    setLoading({ ...loading, opportunity: false })
                }).catch((error) => {
                    console.error('Error:', error)
                })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchDataCompanies = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies/all`).then(async (response) => {
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

        fetchDataOpportunities()
        fetchDataCompanies()
        fetchDataSectors()
    }, [])

    const groupOpportunitiesByMonth = (opportunities) => {
        opportunities.sort((a, b) => new Date(a.start_period) - new Date(b.start_period))

        let groupedOpportunities = {}

        opportunities.forEach((opportunity) => {
            const start_period = new Date(opportunity.start_period)

            const month = start_period.toLocaleString('default', { month: 'short' })
            const year = start_period.getFullYear()

            const monthYear = `${month} ${year}`

            if (!groupedOpportunities[monthYear]) {
                groupedOpportunities[monthYear] = []
            }

            groupedOpportunities[monthYear].push(opportunity)
        })

        return groupedOpportunities
    }

    const opportunitiesByMonth = groupOpportunitiesByMonth(opportunities)
    const barXAxisData = Object.keys(opportunitiesByMonth)
    const barSeriesData = barXAxisData.map((month) => opportunitiesByMonth[month].length)

    return (
        <section className='flex flex-col gap-10 p-10'>
            {loading.opportunity && loading.company && loading.sector ? (
                <div>Loading...</div>
            ) : (
                <>
                    <section className='w-full h-fit grid grid-cols-3 gap-5'>
                        <TotalCard icon={<WorkOutlineOutlinedIcon fontSize='large' />} total={opportunities.length} name={'Jumlah Lowongan Magang'} />
                        <TotalCard icon={<CorporateFareOutlinedIcon fontSize='large' />} total={companies.length} name={'Jumlah Perusahaan'} />
                        <TotalCard icon={<PieChartOutlineOutlinedIcon fontSize='large' />} total={sectors.length} name={'Jumlah Sektor Perusahaan'} />
                    </section>
                    <section className='w-full flex flex-wrap items-start gap-6'>
                        <section className='w-fit flex flex-col gap-5'>
                            <h4>Lowongan Magang per Periode Mulai</h4>
                            <div className='border border-grey rounded-lg'>
                                <BarChart
                                    xAxis={[
                                        {
                                            data: barXAxisData,
                                            scaleType: 'band'
                                        }
                                    ]}
                                    series={[
                                        {
                                            data: barSeriesData,
                                            color: '#5D5FEF'
                                        }
                                    ]}
                                    width={550}
                                    height={300}
                                />
                            </div>
                        </section>
                        <section className='w-fit flex flex-col gap-5'>
                            <h4>Lowongan Magang Aktif & Tidak Aktif</h4>
                            <div className='w-fit p-4 border border-grey rounded-lg'>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => String(item.value),
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { value: opportunities.length - activeOpportunities, label: 'Telah dimulai', color: '#FA0014' },
                                                { value: activeOpportunities, label: 'Belum dimulai', color: '#117E19' }
                                            ]
                                        }
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'semibold'
                                        }
                                    }}
                                    width={400}
                                    height={200}
                                />
                            </div>
                        </section>
                    </section>
                </>
            )}
        </section>
    )
}

export default page