'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState({
        company: null,
        activity_type: null,
    })

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
            toast.error('Harap lengkapi nama, deskripsi, dan periode mulai magang.')
        } else {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(opportunity)
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
                setOpportunity({
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
                setSelectedOption({
                    company: null,
                    activity_type: null,
                })
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
                <h2>Tambah Data Magang</h2>
            </div>
            <OpportunityForm value={opportunity} selectedOption={selectedOption} buttonName={'Tambah'} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
        </section>
    )
}

export default page