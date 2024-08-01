'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import CompanyDetail from '@component/components/company/CompanyDetail'
import Button from '@component/components/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

const Map = dynamic(() => import('@component/components/map/LocationMap'), {
    ssr: false
})

function page() {
    const { id } = useParams('id')
    const [company, setCompany] = useState()
    const [opportunities, setOpportunities] = useState()
    const [companySector, setCompanySector] = useState()
    const [position, setPosition] = useState([])
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
                if (data.location) {
                    setPosition([
                        data.location.coordinates[0],
                        data.location.coordinates[1]
                    ])
                }
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${data.sector_id}`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then((data) => {
                    setCompanySector(data.name)
                    setLoading(prevLoading => ({ ...prevLoading, company: false }))
                })
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities/all?company=${id}`).then(async (response) => {
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
                setLoading(prevLoading => ({ ...prevLoading, opportunity: false }))
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchCompany()
        fetchOpportunities()
    }, [])

    const handleAccept = (id) => {
        toast.loading('Mengirim data...')
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then(async (data) => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`, {
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
            })

            const relatedOpportunities = opportunities.filter(item => item.company_id === id)

            await Promise.all(relatedOpportunities.map(async (opportunity) => {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${opportunity.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': Cookies.get('access-token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...opportunity, accepted: true })
                })
            }))

            router.push('/admin/company')
            toast.dismiss()
            toast.success('Data perusahaan dan lowongan magang telah diterima')
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error.message)
        })
    }

    return (
        !loading.company && !loading.opportunity && company ? (
            <>
                <Map position={position} company={company} />
                <section className='flex flex-col gap-10 p-10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2 text-iris'>
                            <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                            <h2>Detail Perusahaan</h2>
                        </div>
                        { !company.accepted ? (
                            <div className='flex items-center gap-3'>
                                <Button type={'button'} href={`/admin/company/edit/${id}`} onClick={() => { window.open(`${process.env.NEXT_PUBLIC_CLIENT}/admin/company/edit/${id}`, '_self') }} name={'Edit'} buttonStyle={'text-center font-bold text-base text-white bg-green hover:bg-green/[.3] rounded-lg px-5 py-1.5 w-full'} />
                                <Button type={'button'} onClick={() => handleAccept(id)} name={'Terima'} buttonStyle={'text-center font-bold text-base text-white bg-iris hover:bg-iris/[.3] rounded-lg px-3.5 py-1.5 w-full'} />
                            </div>
                        ) : ''}
                    </div>
                    <div className='w-1/2'>
                        <CompanyDetail company={company} opportunities={opportunities} sector={companySector} isAdmin={true} />
                    </div>
                </section>
            </>
        ) : (
            <div className='p-10'>Loading...</div>
        )
    )
}

export default page