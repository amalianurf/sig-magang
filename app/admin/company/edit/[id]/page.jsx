'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    const [currLogo, setCurrLogo] = useState()
    const [loading, setLoading] = useState()
    const { id } = useParams('id')
    const router = useRouter()

    useEffect(() => {
        const fetchDataCompany = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then( async(company) => {
                setCurrLogo(company.logo)
                setCompany({
                    brand_name: company.brand_name,
                    company_name: company.company_name || '',
                    sector_id: company.sector_id || '',
                    logo: '',
                    description: company.description || '',
                    address: company.address || '',
                    city: company.city || '',
                    latitude: (company.location && company.location.coordinates[0]) || '',
                    longitude: (company.location && company.location.coordinates[1]) || ''
                })

                if (company.sector_id) {
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${company.sector_id}`).then(async (response) => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.message)
                            })
                        }
                        return response.json()
                    }).then((sector) => {
                        setSelectedOption({
                            sector: {
                                name: 'sector_id',
                                value: sector.id,
                                label: sector.name
                            },
                            city: {
                                name: 'city',
                                value: company.city,
                                label: company.city
                            }
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

        fetchDataCompany()
    }, [])

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

    const editCompany = (data) => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/company/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': Cookies.get('access-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
            toast.error('Harap lengkapi nama brand, kabupaten/kota, latitude, dan longitude.')
        } else {
            if (company.logo != '') {
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
                    const dataCompany = {
                        brand_name: company.brand_name,
                        company_name: company.company_name || null,
                        sector_id: company.sector_id || null,
                        logo: logoUrl,
                        description: company.description || null,
                        address: company.address || null,
                        city: company.city || null,
                        location: company.latitude && company.longitude ? {
                            type: 'Point',
                            coordinates: [
                                company.latitude,
                                company.longitude
                            ]
                        } : null
                    }
                    editCompany(dataCompany)
                }).catch((error) => {
                    toast.dismiss()
                    toast.error(error.message)
                    console.error('Error:', error.message)
                })
            } else {
                const dataCompany = {
                    brand_name: company.brand_name,
                    company_name: company.company_name || null,
                    sector_id: company.sector_id || null,
                    logo: currLogo,
                    description: company.description || null,
                    address: company.address || null,
                    city: company.city || null,
                    location: company.latitude && company.longitude ? {
                        type: 'Point',
                        coordinates: [
                            company.latitude,
                            company.longitude
                        ]
                    } : null
                }
                editCompany(dataCompany)
            }
        }
    }

    return (
        <section className='flex flex-col gap-6 p-10'>
            <div className='flex items-center gap-2 text-iris'>
                <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                <h2>Edit Data Perusahaan</h2>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <CompanyForm value={company} selectedOption={selectedOption} buttonName={'Ubah Data'} handleInputChange={handleInputChange} handleImageChange={handleImageChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} />
            )}
        </section>
    )
}

export default page