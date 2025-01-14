'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CompanyForm from '@component/components/form/CompanyForm'
import Button from '@component/components/Button'
import UploadFileModal from '@component/components/modal/UploadFileModal'
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
        geo_id: '',
        latitude: '',
        longitude: ''
    })
    const [selectedOption, setSelectedOption] = useState({
        sector: null,
        city: null,
    })
    const [excelData, setExcelData] = useState()
    const [isShow, setIsShow] = useState(false)
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

    const uploadData = async (data, chunkSize) => {
        let response

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chunk)
            })
    
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }
        }

        return response.json()
    }

    const handleUpload = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            const companyIds = data.map(company => company.id)
            const filteredData = excelData.filter(newCompany => {
                return !companyIds.includes(newCompany.id)
            })
            
            if (filteredData.length > 0) {
                const formatedData = filteredData.map((data) => ({
                    ...data,
                    company_name: data.company_name || null,
                    description: data.description || null,
                    logo: data.logo || 'https://i.ibb.co.com/NN3GdCG/placeholder.png',
                    address: data.address || null,
                    geo_id: data.geo_id || null,
                    sector_id: data.sector_id || null,
                    location: data.lat && data.lon ? {
                        type: 'Point',
                        coordinates: [
                            data.lat,
                            data.lon
                        ]
                    } : null,
                    accepted: true
                }))

                uploadData(formatedData, 100).then((data) => {
                    toast.dismiss()
                    toast.success(data.message)
                    router.push('/admin/company')
                }).catch((error) => {
                    toast.dismiss()
                    toast.error(error.message)
                    console.error('Error:', error)
                })
            } else {
                toast.dismiss()
                toast.error('Data dengan ID tersebut sudah ada')
            }
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error)
        })
    }

    const addCompany = (image) => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company`, {
            method: 'POST',
            headers: {
                'Authorization': Cookies.get('access-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                brand_name: company.brand_name,
                company_name: company.company_name || null,
                sector_id: company.sector_id || null,
                logo: image,
                description: company.description || null,
                address: company.address || null,
                geo_id: company.geo_id || null,
                location: company.latitude && company.longitude ? {
                    type: 'Point',
                    coordinates: [
                        company.latitude,
                        company.longitude
                    ]
                } : null,
                accepted: true
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
            router.push('/admin/company')
        }).catch((error) => {
            toast.dismiss()
            toast.error(error.message)
            console.error('Error:', error.message)
        })
    }

    const convertUrl = (url) => {
        const parts = url.split('/')
        parts[2] = 'i.ibb.co.com'
        return parts.join('/')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        if (company.brand_name == '') {
            toast.dismiss()
            toast.error('Harap lengkapi nama brand.')
        } else {
            if (company.logo) {
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
                    const logoUrl = convertUrl(data.data.url)
                    addCompany(logoUrl)
                }).catch((error) => {
                    toast.dismiss()
                    toast.error(error.message)
                    console.error('Error:', error.message)
                })
            } else {
                const logoUrl = 'https://i.ibb.co.com/NN3GdCG/placeholder.png'
                addCompany(logoUrl)
            }
        }
    }

    return (
        <section className='flex flex-col gap-6 p-10'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2 text-iris'>
                    <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                    <h2>Tambah Data Perusahaan</h2>
                </div>
                <Button type={'button'} onClick={() => setIsShow(true)} name={'Upload File'} buttonStyle={'w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
            </div>
            <CompanyForm value={company} selectedOption={selectedOption} buttonName={'Tambah'} handleInputChange={handleInputChange} handleImageChange={handleImageChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
            <UploadFileModal isShow={isShow} setIsShow={setIsShow} setExcelData={setExcelData} handleUpload={handleUpload} template={'/[Template]-Data-Perusahaan.xlsx'} />
        </section>
    )
}

export default page