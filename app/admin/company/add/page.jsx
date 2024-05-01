'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CompanyForm from '@component/components/form/CompanyForm'
import Button from '@component/components/Button'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const [company, setCompany] = useState({
        brand_name: '',
        company_name: '',
        sector_id: '',
        logo: '',
        description: '',
        address: '',
        city: '',
        latitude: '',
        longitude: ''
    })
    const [selectedOption, setSelectedOption] = useState({
        sector: null,
        city: null,
    })
    const router = useRouter()

    const handleInputChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        setCompany({ ...company, logo: e.target.files[0] })
    }

    const handleSelectChange = (option, name) => {
        setSelectedOption({ ...selectedOption, [name]: option })
        if (option) {
            setCompany({ ...company, [option.name]: option.value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        if (company.brand_name == '' || company.city == '' || company.latitude == '' || company.longitude == '') {
            toast.error('Harap lengkapi nama brand, kabupaten/kota, latitude, dan longitude.')
        } else {
            const data = new FormData()
            data.append('image', company.logo)

            fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                method: 'POST',
                body: data
            }).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                const logoUrl = data.data.url
                fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company`, {
                    method: 'POST',
                    headers: {
                        'Authorization': Cookies.get('access-token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        brand_name: company.brand_name,
                        company_name: company.company_name,
                        sector_id: company.sector_id,
                        logo: logoUrl,
                        description: company.description,
                        address: company.address,
                        city: company.city,
                        location: {
                            type: 'Point',
                            coordinates: [
                                company.latitude,
                                company.longitude
                            ]
                        }
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
                    setCompany({
                        brand_name: '',
                        company_name: '',
                        sector_id: '',
                        logo: '',
                        description: '',
                        address: '',
                        city: '',
                        latitude: '',
                        longitude: ''
                    })
                    setSelectedOption({
                        sector: null,
                        city: null,
                    })
                }).catch((error) => {
                    toast.dismiss()
                    toast.error(error.message)
                    console.error('Error:', error.message)
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
                <h2>Tambah Data Perusahaan</h2>
            </div>
            <CompanyForm value={company} selectedOption={selectedOption} buttonName={'Tambah'} handleInputChange={handleInputChange} handleImageChange={handleImageChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
        </section>
    )
}

export default page