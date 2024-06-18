'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import OpportunityForm from '@component/components/form/OpportunityForm'
import Button from '@component/components/Button'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const [opportunity, setOpportunity] = useState({
        name: '',
        activity_type: '',
        duration: '',
        description: '',
        quota: '',
        start_period: '',
        min_semester: '',
        salary: '',
        company_id: ''
    })
    const [selectedOption, setSelectedOption] = useState({
        company: null,
        activity_type: null,
    })
    const [loading, setLoading] = useState()
    const { id } = useParams('id')
    const router = useRouter()

    useEffect(() => {
        const fetchDataOpportunity = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then( async(opportunity) => {
                const period = new Date(opportunity.start_period)
                setOpportunity({
                    name: opportunity.name,
                    activity_type: opportunity.activity_type || '',
                    duration: opportunity.duration || '',
                    description: opportunity.description,
                    quota: opportunity.quota || '',
                    start_period: period.toISOString().split('T')[0],
                    min_semester: opportunity.min_semester || '',
                    salary: opportunity.salary || '',
                    company_id: opportunity.company_id || ''
                })

                if (opportunity.company_id) {
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${opportunity.company_id}`).then(async (response) => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.message)
                            })
                        }
                        return response.json()
                    }).then((company) => {
                        setSelectedOption({
                            company: {
                                name: 'company_id',
                                value: company.id,
                                label: company.brand_name
                            },
                            activity_type: opportunity.activity_type ? {
                                name: 'activity_type',
                                value: opportunity.activity_type,
                                label: opportunity.activity_type
                            } : null
                        })
                    }).catch((error) => {
                        console.error('Error:', error)
                        setLoading(false)
                    })
                }
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
                setLoading(false)
            })
        }

        fetchDataOpportunity()
    }, [])

    const handleInputChange = (e) => {
        setOpportunity({ ...opportunity, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (option, name) => {
        setSelectedOption({ ...selectedOption, [name]: option })
        if (option) {
            setOpportunity({ ...opportunity, [option.name]: option.value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        if (opportunity.name == '' || opportunity.description == '' || opportunity.start_period == '') {
            toast.dismiss()
            toast.error('Harap lengkapi nama, deskripsi, dan periode mulai magang.')
        } else {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...opportunity,
                    activity_type: opportunity.activity_type || null,
                    duration: opportunity.duration || null,
                    quota: opportunity.quota || null,
                    min_semester: opportunity.min_semester || null,
                    salary: opportunity.salary || null,
                    company_id: opportunity.company_id || null
                })
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
                router.push('/admin/opportunity')
            }).catch((error) => {
                toast.dismiss()
                toast.error(error.message)
                console.error('Error:', error.message)
            })
        }
    }

    return (
        <section className='flex flex-col gap-6 p-10'>
            <div className='flex items-center gap-2 text-iris'>
                <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                <h2>Edit Data Magang</h2>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <OpportunityForm value={opportunity} selectedOption={selectedOption} buttonName={'Ubah Data'} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
            )}
        </section>
    )
}

export default page