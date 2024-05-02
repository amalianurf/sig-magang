'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectorForm from '@component/components/form/SectorForm'
import Button from '@component/components/Button'
import UploadFileModal from '@component/components/modal/UploadFileModal'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import * as Excel from 'exceljs'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function page() {
    const [sectorName, setSectorName] = useState()
    const [excelData, setExcelData] = useState()
    const [isShow, setIsShow] = useState(false)
    const router = useRouter()

    const handleSectorChange = (e) => {
        setSectorName(e.target.value)
    }

    const convertWorksheetToJson = (worksheet) => {
        const jsonData = []

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return

            const rowData = {}
            row.eachCell((cell, colNumber) => {
                const columnName = worksheet.getRow(1).getCell(colNumber).value
                rowData[columnName] = cell.value
            })

            const isEmpty = Object.values(rowData).every(cell => cell === null || cell === undefined || cell === '')
            if (!isEmpty) {
                jsonData.push(rowData)
            }
        })
    
        return jsonData
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            const reader = new FileReader()

            reader.readAsArrayBuffer(file)

            reader.onload = async (event) => {
                try {
                    const data = event.target.result
                    const workbook = new Excel.Workbook()
                    await workbook.xlsx.load(data)

                    const worksheet = workbook.worksheets[0]
                    const jsonData = convertWorksheetToJson(worksheet)
    
                    setExcelData(jsonData)
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            toast.error('File tidak didukung')
        }
    }

    const handleUpload = (e) => {
        e.preventDefault()

        toast.loading('Mengirim data...')

        fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sectors`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            const sectorIds = data.map(sector => sector.id)
            const filteredData = excelData.filter(newSector => {
                return !sectorIds.includes(newSector.id)
            })
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filteredData)
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

        if (sectorName == '') {
            toast.error('Harap lengkapi semua data.')
        } else {
            fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector`, {
                method: 'POST',
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
                setSectorName('')
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
                    <h2>Tambah Data Sektor</h2>
                </div>
                <Button type={'button'} onClick={() => setIsShow(true)} name={'Upload File'} buttonStyle={'w-fit h-fit text-center font-medium text-white text-base bg-iris hover:bg-iris/[.3] rounded-lg px-4 py-2'} />
            </div>
            <SectorForm value={sectorName} buttonName={'Tambah'} handleChange={handleSectorChange} handleSubmit={handleSubmit} />
            <UploadFileModal isShow={isShow} setIsShow={setIsShow} handleFileChange={handleFileChange} handleUpload={handleUpload} />
        </section>
    )
}

export default page