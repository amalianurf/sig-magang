import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import Select from 'react-select'
import Button from '@component/components/Button'
import CircleIcon from '@mui/icons-material/Circle'

function Map(props) {
    const [mapKey, setMapKey] = useState(0)

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1)
    }, [props.geoJsonData])

    // perhitungan simpangan baku
    const standardDeviation = () => {
        const data = props.geoJsonData.features
        let total = 0
        let totalSquaredDifference = 0

        data.forEach((item) => {
            total += item.properties.opportunities
        })

        const mean = total / data.length

        data.forEach((item) => {
            const difference = item.properties.opportunities - mean
            totalSquaredDifference += difference ** 2
        })

        const variance = totalSquaredDifference / data.length
        const standardDeviation = Math.sqrt(variance)

        return { standardDeviation, mean }
    }

    // perhitungan batas atas dan batas bawah
    const UpperLowerBounds = (sd) => {
        const upperBounds = sd.mean + (0.3 * sd.standardDeviation)
        const lowerBounds = sd.mean - (0.3 * sd.standardDeviation)

        return { upperBounds, lowerBounds }
    }

    // penentuan warna peta menggunakan batas atas dan batas bawah
    const getPolygonColor = (value) => {
        const { upperBounds, lowerBounds } = UpperLowerBounds(standardDeviation())

        return value > upperBounds
            ? 'green'
            : value <= upperBounds && value > lowerBounds
            ? 'yellow'
            : value <= lowerBounds
            ? 'red'
            : 'grey'
    }

    const selectStyle = {
        control: (styles, { isFocused }) => ({ ...styles, width: 'fit-content', fontSize: '16px', padding: '6px 12px', border: isFocused ? '1px solid #5D5FEF99 !important' : '1px solid #7C7C7C !important', borderRadius: '8px', outline: 'none !important', boxShadow: isFocused ? 'inset 0 0 0 1px #5D5FEFB3' : 'none', '&.hover': { border: '1px solid #7C7C7C !important'} }),
        valueContainer: (styles) => ({ ...styles, padding: '0' }),
        placeholder: (styles) => ({ ...styles, margin: '0', color: '#9da4b0', fontSize: '16px' }),
        input: (styles) => ({ ...styles, margin: '0', padding: '0', fontSize: '16px' }),
        dropdownIndicator: (styles) => ({ ...styles, padding: '0 0 0 4px', color: '#7C7C7C' }),
        clearIndicator: (styles) => ({ ...styles, padding: '0 0 0 4px', color: '#7C7C7C99' }),
        indicatorSeparator: (styles) => ({ ...styles, display: 'none' })
    }

    return (
        <>
            {props.sectors && (
                <div style={{ top: `${props.navbarHeight}px` }} className='fixed right-0 flex items-center gap-3 px-7 py-5 rounded-bl-lg bg-white/[.6] z-[1000]'>
                    <Select
                        name='sector_id'
                        onChange={(selectedOption) => props.handleSelectChange(selectedOption)}
                        value={props.selectedSector}
                        placeholder={'Pilih Sektor'}
                        options={props.sectors.map(data => ({
                            name: 'sector_id',
                            value: data.id,
                            label: data.name
                        }))}
                        isSearchable={true}
                        isClearable={true}
                        styles={selectStyle}
                    />
                    <form onSubmit={'/'} className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                            <input type='date' name='start_date' value={props.dateRange.start} onChange={props.handleDateChange} className='relative w-fit px-3 py-1.5 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                            <div>to</div>
                            <input type='date' name='end_date' value={props.dateRange.end} onChange={props.handleDateChange} className='relative w-fit px-3 py-1.5 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]' required />
                        </div>
                        <Button type={'submit'} name={'Filter Data'} buttonStyle={'w-fit px-3 py-2 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                    </form>
                </div>
            )}
            <MapContainer center={[-1.3631627162310562, 118.42289645522916]} zoom={5} style={{ height: `calc(100vh - ${props.navbarHeight}px)`, width: '100%' }}>
                <TileLayer
                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {props.geoJsonData && (
                    <GeoJSON
                        key={mapKey}
                        data={props.geoJsonData}
                        style={(feature) => ({
                            fillColor: getPolygonColor(feature.properties.opportunities),
                            color: '#ffffff',
                            weight: 1
                        })}
                    />
                )}
                {props.companies && (
                    <MarkerClusterGroup chunkedLoading >
                        {props.companies.map((company, index) => (
                            <Marker key={index} position={[company.location.coordinates[0], company.location.coordinates[1]]} title={company.brand_name}>
                                <Popup>
                                    {company.brand_name}
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                )}
            </MapContainer>
            {props.geoJsonData && (
                <div className='fixed right-0 bottom-0 w-full px-6 py-2 flex justify-end items-center gap-10 bg-white z-[1000]'>
                    <div className='flex items-center gap-1'>
                        <CircleIcon fontSize='small' className='text-green' />
                        <div>Lowongan &gt; {UpperLowerBounds(standardDeviation()).upperBounds.toFixed(2)}</div>
                    </div>
                    <div className='flex items-center gap-1'>
                        <CircleIcon fontSize='small' className='text-yellow' />
                        <div>{UpperLowerBounds(standardDeviation()).upperBounds.toFixed(2)} &gt;= Lowongan &gt;= {UpperLowerBounds(standardDeviation()).lowerBounds.toFixed(2)}</div>
                    </div>
                    <div className='flex items-center gap-1'>
                        <CircleIcon fontSize='small' className='text-red' />
                        <div>Lowongan &lt; {UpperLowerBounds(standardDeviation()).lowerBounds.toFixed(2)}</div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Map