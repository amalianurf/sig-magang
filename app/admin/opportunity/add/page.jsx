'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import OpportunityForm from '@component/components/form/OpportunityForm'
import Button from '@component/components/Button'
import UploadFileModal from '@component/components/modal/UploadFileModal'
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
    const [excelData, setExcelData] = useState()
    const [isShow, setIsShow] = useState(false)
    const router = useRouter()

    const handleInputChange = (e) => {
        setOpportunity({ ...opportunity, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (option, name) => {
        setSelectedOption({ ...selectedOption, [name]: option })
        if (option) {
            setOpportunity({ ...opportunity, [option.name]: option.value })
        }
    }

    const handleUpload = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            const opportunityIds = data.map(opportunity => opportunity.id)
            const filteredData = excelData.filter(newOpportunity => {
                return !opportunityIds.includes(newOpportunity.id)
            })
            const formatedData = filteredData.map((data) => ({
                ...data,
                activity_type: data.activity_type || null,
                duration: data.duration || null,
                quota: data.quota || null,
                min_semester: data.min_semester || null,
                salary: data.salary || null,
                company_id: data.company_id || null
            }))

            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunity`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formatedData)
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
                setIsShow(false)
            }).catch((error) => {
                toast.dismiss()
                toast.error(error.message)
                console.error('Error:', error.message)
            })
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error)
        })
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
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2 text-iris'>
                    <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                    <h2>Tambah Data Magang</h2>
                </div>
                <Button type={'button'} onClick={() => setIsShow(true)} name={'Upload File'} buttonStyle={'w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
            </div>
            <OpportunityForm value={opportunity} selectedOption={selectedOption} buttonName={'Tambah'} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
            <UploadFileModal isShow={isShow} setIsShow={setIsShow} setExcelData={setExcelData} handleUpload={handleUpload} />
        </section>
    )
}

export default page