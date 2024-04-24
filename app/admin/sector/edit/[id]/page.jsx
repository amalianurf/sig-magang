'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SectorForm from '@component/components/form/SectorForm'
import Button from '@component/components/Button'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const [sectorName, setSectorName] = useState()
    const [loading, setLoading] = useState()
    const { id } = useParams('id')
    const router = useRouter()

    useEffect(() => {
        const fetchDataSector = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setSectorName(data.name)
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
                setLoading(false)
            })
        }

        fetchDataSector()
    }, [])

    const handleSectorChange = (e) => {
        setSectorName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        toast.loading('Mengubah data...')

        if (sectorName == '') {
            toast.error('Harap lengkapi semua data.')
        } else {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: sectorName })
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
    }

    return (
        <section className='flex flex-col gap-6 p-10'>
            <div className='flex items-center gap-2 text-iris'>
                <Button type={'button'} onClick={() => router.back()} name={<ArrowBackIcon fontSize='large' />} buttonStyle={'flex items-center p-1.5 rounded-full hover:bg-grey-light/[.3]'} />
                <h2>Edit Data Sektor</h2>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <SectorForm value={sectorName} buttonName={'Ubah Data'} handleChange={handleSectorChange} handleSubmit={handleSubmit} />
            )}
        </section>
    )
}

export default page