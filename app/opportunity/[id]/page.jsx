'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import Button from '@component/components/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const [opportunity, setOpportunity] = useState()
    const [company, setCompany] = useState()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { id } = useParams('id')

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then(async (data) => {
                setOpportunity(data)

                await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${data.company_id}`).then(async (response) => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message)
                        })
                    }
                    return response.json()
                }).then((data) => {
                    setCompany(data)
                }).catch((error) => {
                    console.error('Error:', error)
                })

                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
                setLoading(false)
            })
        }

        fetchData()
    }, [])

    const formatDate = (date) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ]

        const newDate = new Date(date)
        const day = newDate.getDate()
        const month = months[newDate.getMonth()]
        const year = newDate.getFullYear()

        return `${day} ${month} ${year}`
    }

    const formatToIDR = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    }

    return (
        <section className='flex flex-col gap-10 p-10'>
            <div className='flex items-center gap-2 text-iris'>
                <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                <h2>Detail Magang</h2>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='flex flex-col gap-10 px-10'>
                    <div className='w-full flex justify-between items-center'>
                        <div className='w-full flex items-center gap-4'>
                            <Image src={company.logo} width={90} height={90} alt='logo' className='w-fit aspect-square rounded-lg' priority />
                            <div className='w-full flex flex-col gap-2'>
                                <div className='text-2xl text-black font-semibold'>{opportunity.name}</div>
                                <div className='text-grey'>
                                    <div>{company.brand_name}</div>
                                    <div>{company.address ? company.address : '-'}</div>
                                </div>
                            </div>
                        </div>
                        <Button type={'button'} href={`https://kampusmerdeka.kemdikbud.go.id/program/magang-mandiri/browse/${opportunity.company_id}/${id}`} name={'Buka di Web Kampus Merdeka'} buttonStyle={'w-fit text-center font-medium text-white bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h4>Deskripsi</h4>
                        <div className='flex items-start justify-between gap-14'>
                            {opportunity.description.includes('</') ? (
                                <div className='text-justify'>{opportunity.description}</div>
                            ) : (
                                <div className='text-justify'>
                                    <p>{opportunity.description}</p>
                                </div>
                            )}
                            <div className='min-w-[340px] px-6 py-5 flex flex-col gap-4 border border-grey rounded-lg'>
                                <div className='text-xl font-bold'>Informasi Penting</div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-grey'>Periode Magang</div>
                                        <div className='font-medium'>{opportunity.start_period ? formatDate(opportunity.start_period) : '-'}</div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-grey'>Durasi</div>
                                        <div className='font-medium'>{opportunity.duration ? `${opportunity.duration} Bulan` : '-'}</div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-grey'>Sistem Magang</div>
                                        <div className='font-medium'>{opportunity.activity_type ? opportunity.activity_type : '-'}</div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-grey'>Bantuan Biaya Hidup</div>
                                        <div className='font-medium'>{opportunity.salary ? formatToIDR(opportunity.salary) : '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default page