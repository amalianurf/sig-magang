import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Button from '../Button'

function OpportunityForm(props) {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDataCompanies = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/companies`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setCompanies(data)
                setLoading(false)
            }).catch((error) => {
                console.error('Error:', error)
                setLoading(false)
            })
        }

        fetchDataCompanies()
    }, [])

    const companyOptions = companies.map(data => ({
        name: 'company_id',
        value: data.id,
        label: data.brand_name
    }))

    const activityOptions = [
        { name: 'activity_type', value: 'WFO', label: 'WFO' },
        { name: 'activity_type', value: 'WFH', label: 'WFH' },
        { name: 'activity_type', value: 'Hybrid', label: 'Hybrid' },
    ]

    const selectStyle = {
        control: (styles, { isFocused }) => ({ ...styles, width: '100%', fontSize: '16px', padding: '8px 16px', border: isFocused ? '1px solid #5D5FEF99 !important' : '1px solid #7C7C7C !important', borderRadius: '8px', outline: 'none !important', boxShadow: isFocused ? 'inset 0 0 0 1px #5D5FEFB3' : 'none', '&.hover': { border: '1px solid #7C7C7C !important'} }),
        valueContainer: (styles) => ({ ...styles, padding: '0' }),
        placeholder: (styles) => ({ ...styles, margin: '0', color: '#9da4b0', fontSize: '16px' }),
        input: (styles) => ({ ...styles, margin: '0', padding: '0', fontSize: '16px' }),
        dropdownIndicator: (styles) => ({ ...styles, padding: '0 0 0 8px', color: '#7C7C7C' }),
        clearIndicator: (styles) => ({ ...styles, padding: '0 8px', color: '#7C7C7C99' })
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={props.handleSubmit} className='flex flex-col gap-5'>
                    <div className='w-full flex items-start gap-5'>
                        <div className='w-full flex flex-col gap-5'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='name' className='font-medium'>Nama Lowongan</label>
                                <input type='text' name='name' value={props.value.name} onChange={props.handleInputChange} placeholder='Nama Lowongan' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='company_id' className='font-medium'>Perusahaan</label>
                                <Select
                                    name='company_id'
                                    onChange={(selectedOption) => props.handleSelectChange(selectedOption, 'company')}
                                    value={props.selectedOption.company}
                                    placeholder={'Pilih Perusahaan'}
                                    options={companyOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={selectStyle}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='activity_type' className='font-medium'>Sistem Magang</label>
                                <Select
                                    name='activity_type'
                                    onChange={(selectedOption) => props.handleSelectChange(selectedOption, 'activity_type')}
                                    value={props.selectedOption.activity_type}
                                    placeholder={'Pilih Sistem Magang'}
                                    options={activityOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={selectStyle}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='duration' className='font-medium'>Durasi</label>
                                <div className='relative'>
                                    <input type='number' name='duration' value={props.value.duration} onChange={props.handleInputChange} placeholder='Durasi Magang' className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                                    <div className='absolute top-1/2 -translate-y-1/2 right-4 font-medium'>Bulan</div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='description' className='font-medium'>Deskripsi</label>
                                <textarea name='description' value={props.value.description} onChange={props.handleInputChange} placeholder='Deskripsi Lowongan' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' cols='30' rows='3' required></textarea>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-5'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='quota' className='font-medium'>Kuota Peserta</label>
                                <input type='number' name='quota' value={props.value.quota} onChange={props.handleInputChange} placeholder='Kuota Peserta' className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='start_period' className='font-medium'>Periode Mulai</label>
                                <input type='date' name='start_period' value={props.value.start_period} onChange={props.handleInputChange} className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='min_semester' className='font-medium'>Minimal Semester</label>
                                <input type='number' name='min_semester' value={props.value.min_semester} onChange={props.handleInputChange} placeholder='Minimal Semester' className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='salary' className='font-medium'>Bantuan Biaya Hidup</label>
                                <div className='relative'>
                                    <div className='absolute top-1/2 -translate-y-1/2 left-4 font-medium z-10'>Rp</div>
                                    <input type='number' name='salary' value={props.value.salary} onChange={props.handleInputChange} placeholder='Bantuan Biaya Hidup' className='relative w-full pl-11 pr-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button type={'submit'} name={props.buttonName} buttonStyle={'w-fit px-4 py-2.5 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                </form>
            )}
        </>
    )
}

export default OpportunityForm