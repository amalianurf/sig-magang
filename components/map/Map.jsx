'use client'
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDOMServer from 'react-dom/server'
import Button from '@component/components/Button'
import CircleIcon from '@mui/icons-material/Circle'
import CloseIcon from '@mui/icons-material/Close'

function Map(props) {
    const [mapKey, setMapKey] = useState(0)
    const [isClient, setIsClient] = useState(false)
    const [mapView, setMapView] = useState({
        center: [-1.3631627162310562, 118.42289645522916],
        zoom: 5
    })

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1)
    }, [props.geoJsonData, mapView])

    useEffect(() => {
        setIsClient(typeof window !== 'undefined')
    }, [])

    useEffect(() => {
        props.setCompanyId(null)
        props.setCity(null)
        setMapView({
            center: [-1.3631627162310562, 118.42289645522916],
            zoom: 5
        })
    }, [props.isFiltered, props.isActiveData])

    // perhitungan simpangan baku
    const standardDeviation = () => {
        const data = props.geoJsonData.features
        let total = 0
        let totalSquaredDeviation = 0

        data.forEach((item) => {
            total += item.properties.opportunities
        })

        const mean = total / data.length

        data.forEach((item) => {
            const deviation = item.properties.opportunities - mean
            totalSquaredDeviation += deviation ** 2
        })

        const variance = totalSquaredDeviation / (data.length - 1)
        const standardDeviation = Math.sqrt(variance)

        return { standardDeviation, mean }
    }

    // perhitungan batas atas dan batas bawah
    const UpperLowerBounds = (sd) => {
        const upperBounds = sd.mean + (0.34 * sd.standardDeviation)
        const lowerBounds = sd.mean - (0.34 * sd.standardDeviation)

        return { upperBounds, lowerBounds }
    }

    // penentuan warna peta menggunakan batas atas dan batas bawah
    const getPolygonColor = (value) => {
        const { upperBounds, lowerBounds } = UpperLowerBounds(standardDeviation())

        return value > Math.floor(upperBounds)
            ? '#117E19'
            : value <= Math.floor(upperBounds) && value >= Math.floor(lowerBounds)
            ? '#FFFF00'
            : value < Math.floor(lowerBounds)
            ? '#FA0014'
            : '#7C7C7C'
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

    if (!isClient) {
        return null
    }

    const { MapContainer, TileLayer, GeoJSON, Marker, Popup } = require('react-leaflet')
    const MarkerClusterGroup = require('react-leaflet-cluster').default
    require('leaflet/dist/leaflet.css')
    require('leaflet-defaulticon-compatibility')
    require('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css')

    return (
        <>
            {props.sectors && (
                <div className='absolute right-0 flex items-center gap-3 px-7 py-5 rounded-bl-lg bg-white/[.6] z-[900]'>
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
                        styles={selectStyle}
                    />
                    <div className='flex items-center gap-1'>
                        <DatePicker
                            selected={props.dateRange.start}
                            onChange={(date) => props.setDateRange({...props.dateRange, start: date})}
                            selectsStart
                            startDate={props.dateRange.start}
                            endDate={props.dateRange.end}
                            maxDate={props.dateRange.end}
                            placeholderText='dd/mm/yyyy'
                            dateFormat={'dd/MM/yyyy'}
                            className='relative w-28 px-3 py-1.5 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]'
                            required
                        />
                        <div>to</div>
                        <DatePicker
                            selected={props.dateRange.end}
                            onChange={(date) => props.setDateRange({...props.dateRange, end: date})}
                            selectsEnd
                            startDate={props.dateRange.start}
                            endDate={props.dateRange.end}
                            minDate={props.dateRange.start}
                            placeholderText='dd/mm/yyyy'
                            dateFormat={'dd/MM/yyyy'}
                            className='relative w-28 px-3 py-1.5 border border-grey rounded-lg text-base outline-none focus:border-iris/[.7] focus:ring-1 ring-iris/[.6]'
                            required
                        />
                    </div>
                    <Button type={'button'} onClick={props.handleFilter} name={'Filter Data'} buttonStyle={'w-fit px-3 py-2 text-white font-bold bg-iris hover:bg-iris/[.3] rounded-lg'} />
                    <Button type={'button'} onClick={props.handleResetData} name={<CloseIcon />} buttonStyle={props.isFiltered ? 'w-fit p-2 text-iris font-bold bg-neutral hover:bg-neutral/[.3] rounded-full' : 'hidden'} />
                </div>
            )}
            <MapContainer key={mapKey} center={mapView.center} zoom={mapView.zoom} style={{ height: `calc(100vh - ${props.navbarHeight}px)`, width: '100%' }}>
                <TileLayer
                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {props.geoJsonData ? (
                    <GeoJSON
                        key={mapKey}
                        data={props.geoJsonData}
                        style={(feature) => ({
                            fillColor: getPolygonColor(feature.properties.opportunities),
                            color: '#5D5FEF',
                            weight: 2
                        })}
                        onEachFeature={(feature, layer) =>{
                            layer.bindPopup(ReactDOMServer.renderToString(
                                <div className='flex flex-col gap-1'>
                                    <div className='font-semibold'>{feature.properties.city}</div>
                                    <div>
                                        <div>Jumlah Perusahaan: {feature.properties.companies || 0}</div>
                                        <div>Jumlah Lowongan: {feature.properties.opportunities || 0}</div>
                                    </div>
                                </div>
                            ))
                            layer.on({
                                mouseover: (e) => { layer.openPopup(e.latlng) },
                                mouseout: (e) => { layer.closePopup() },
                                click: (e) => {
                                    props.setCity(feature.properties.id)
                                    props.setCompanyId(null)
                                    setMapView({
                                        center: [e.latlng.lat, e.latlng.lng - 0.25],
                                        zoom: 10
                                    })
                                }
                            })
                        }}
                    />
                ) : (
                    <div className='absolute w-full min-h-screen flex justify-center items-center text-xl bg-white/[.4] z-[1000] cursor-wait'>Loading...</div>
                )}
                {props.companies && (
                    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} >
                        {props.companies.map((company, index) => {
                            if (company.location) {
                                return (
                                    <Marker
                                        key={index}
                                        position={[company.location.coordinates[0], company.location.coordinates[1]]}
                                        title={company.brand_name}
                                        data={company.id}
                                        eventHandlers={{
                                            click: (e) => {
                                                props.setCompanyId(e.target.options.data)
                                                props.setCity(null)
                                                setMapView({
                                                    center: [e.latlng.lat, e.latlng.lng - 0.0011],
                                                    zoom: 20
                                                })
                                            }
                                        }}
                                    >
                                        <Popup>
                                            {company.brand_name}
                                        </Popup>
                                    </Marker>
                                )
                            }
                        })}
                    </MarkerClusterGroup>
                )}
            </MapContainer>
            { props.lastUpdate ? (
                <div className='absolute right-4 bottom-12 text-sm z-[1000]'>
                    Terakhir diperbarui : { props.lastUpdate }
                </div>
            ) : '' }
            <div className='absolute right-0 bottom-0 w-full px-6 py-2 flex justify-between items-center bg-white z-[1000]'>
                <div className='flex items-center gap-5'>
                    <Button type={'button'} onClick={props.handleShowAllData} name={'Semua Data'} buttonStyle={'text-iris hover:underline'} />
                    <Button type={'button'} onClick={props.activeDataFilter} name={'Data Aktif'} buttonStyle={'text-iris hover:underline'} />
                </div>
                {props.geoJsonData ? (props.geoJsonData.features ? (props.geoJsonData.features.length ? (
                    UpperLowerBounds(standardDeviation()).upperBounds && UpperLowerBounds(standardDeviation()).lowerBounds ? (
                        <div className='flex items-center gap-10'>
                            <div className='flex items-center gap-1'>
                                <CircleIcon fontSize='small' className='text-green' />
                                <div>Jumlah Lowongan &gt; {Math.floor(UpperLowerBounds(standardDeviation()).upperBounds)}</div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <CircleIcon fontSize='small' className='text-yellow' />
                                <div>{Math.floor(UpperLowerBounds(standardDeviation()).upperBounds)} &ge; Jumlah Lowongan &ge; {Math.floor(UpperLowerBounds(standardDeviation()).lowerBounds)}</div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <CircleIcon fontSize='small' className='text-red' />
                                <div>Lowongan &lt; {Math.floor(UpperLowerBounds(standardDeviation()).lowerBounds)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <CircleIcon fontSize='small' className='text-grey' />
                            <div>Jumlah Lowongan = {standardDeviation().mean}</div>
                        </div>
                    )
                ) : '') : '') : ''}
            </div>
        </>
    )
}

export default Map