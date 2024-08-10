'use client'
import React, { useEffect, useState } from 'react'

function LocationMap(props) {
    const [isClient, setIsClient] = useState(false)

    const defaultPosition = [51.505, -0.09]
    const mapPosition = props.position.length === 2 ? props.position : defaultPosition

    useEffect(() => {
        setIsClient(typeof window !== 'undefined')
    }, [])

    if (!isClient) {
        return null
    }

    const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet')
    require('leaflet/dist/leaflet.css')
    require('leaflet-defaulticon-compatibility')
    require('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css')

    return (
        <MapContainer center={mapPosition} zoom={15} style={{ height: '250px', width: '30%', position: 'absolute', top: '200px', right: '40px' }}>
            <TileLayer
                attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { props.position.length === 2 && (
                <Marker position={mapPosition}>
                    <Popup>
                        {props.company.brand_name}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    )
}

export default LocationMap