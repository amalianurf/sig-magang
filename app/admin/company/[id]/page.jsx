'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import CompanyDetail from '@component/components/company/CompanyDetail'
import Button from '@component/components/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const { id } = useParams('id')
    const [company, setCompany] = useState()
    const [opportunities, setOpportunities] = useState()
    const [companySector, setCompanySector] = useState()
    const [loading, setLoading] = useState({
        company: true,
        opportunity: true
    })
    const router = useRouter()

    useEffect(() => {
        const fetchCompany = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then(async (data) => {
                setCompany(data)
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${data.sector_id}`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then((data) => {
                    setCompanySector(data.name)
                })
                setLoading({ ...loading, company: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities?company=${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                if (data) {
                    setOpportunities(data)
                }
                setLoading({ ...loading, opportunity: false })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchCompany()
        fetchOpportunities()
    }, [])

    return (
        <section className='flex flex-col gap-10 p-10'>
            <div className='flex items-center gap-2 text-iris'>
                <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                <h2>Detail Perusahaan</h2>
            </div>
            {loading.company && loading.opportunity ? (
                <div>Loading...</div>
            ) : (
                <CompanyDetail company={company} opportunities={opportunities} sector={companySector} isAdmin={true} />
            )}
        </section>
    )
}

export default page