import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Button from '../Button'

function CompanyForm(props) {
    const [sectors, setSectors] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState({
        sector: true,
        city: true
    })

    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    }

    const separateGunung = (str) => {
        const regex = /(GUNUNG)([A-Z]+)/g
        const result = str.replace(regex, '$1 $2')

        return result
    }

    useEffect(() => {
        const fetchDataSectors = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sectors`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setSectors(data)
                setLoading({ ...loading, sector: false })
            }).catch((error) => {
                console.error('Error:', error)
                setLoading({ ...loading, sector: false })
            })
        }

        const fetchDataCity = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/cities`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setCities(data)
                setLoading({ ...loading, city: false })
            }).catch((error) => {
                console.error('Error:', error)
                setLoading({ ...loading, city: false })
            })
        }

        fetchDataSectors()
        fetchDataCity()
    }, [])

    const sectorOptions = sectors.map(data => ({
        name: 'sector_id',
        value: data.id,
        label: data.name
    }))

    const cityOptions = Object.values(cities).map(data => {
        if (data.includes('GUNUNG') && !data.includes('PEGUNUNGAN')) {
            data = separateGunung(data)
        }

        return ({
            name: 'city',
            value: toTitleCase(data).replace('Kab. ', '').replace('Kab ', '').replace('Adm. ', ''),
            label: toTitleCase(data).replace('Kab. ', '').replace('Kab ', '').replace('Adm. ', ''),
        })
    })

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
            {loading.sector && loading.city ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={props.handleSubmit} className='flex flex-col gap-5'>
                    <div className='w-full flex items-start gap-5'>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='brand_name' className='font-medium'>Nama Brand</label>
                                <input type='text' name='brand_name' value={props.value.brand_name} onChange={props.handleInputChange} placeholder='Nama Brand' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='company_name' className='font-medium'>Nama Perusahaan</label>
                                <input type='text' name='company_name' value={props.value.company_name} onChange={props.handleInputChange} placeholder='Nama Perusahaan' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='sector_id' className='font-medium'>Sektor</label>
                                <Select
                                    name='sector_id'
                                    onChange={(selectedOption) => props.handleSelectChange(selectedOption, 'sector')}
                                    value={props.selectedOption.sector}
                                    placeholder={'Pilih Sektor'}
                                    options={sectorOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={selectStyle}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='logo' className='font-medium'>Logo</label>
                                <input type='file' name='logo' onChange={props.handleImageChange} accept='image/*' className='w-full px-3 py-2.5 border border-grey rounded-lg text-base text-grey outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6] file:text-black file:border-none file:px-4 file:py-2 file:mr-3 file:bg-grey-light file:font-medium file:rounded-lg' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='description' className='font-medium'>Deskripsi</label>
                                <textarea name='description' value={props.value.description} onChange={props.handleInputChange} placeholder='Deskripsi Perusahaan' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' cols='30' rows='3'></textarea>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='address' className='font-medium'>Alamat</label>
                                <textarea name='address' value={props.value.address} onChange={props.handleInputChange} placeholder='Alamat Perusahaan' className='w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' cols='30' rows='3'></textarea>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='city' className='font-medium'>Kabupaten/Kota</label>
                                <Select
                                    name='city'
                                    onChange={(selectedOption) => props.handleSelectChange(selectedOption, 'city')}
                                    value={props.selectedOption.city}
                                    placeholder={'Pilih Kabupaten/Kota'}
                                    options={cityOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={selectStyle}
                                    required={true}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='latitude' className='font-medium'>Latitude</label>
                                <input type='number' name='latitude' value={props.value.latitude} onChange={props.handleInputChange} placeholder='Nilai Latitude' className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='longitude' className='font-medium'>Longitude</label>
                                <input type='number' name='longitude' value={props.value.longitude} onChange={props.handleInputChange} placeholder='Nilai Longitude' className='relative w-full px-4 py-2 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' />
                            </div>
                        </div>
                    </div>
                    <Button type={'submit'} name={props.buttonName} buttonStyle={'w-fit px-4 py-2.5 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                </form>
            )}
        </>
    )
}

export default CompanyForm