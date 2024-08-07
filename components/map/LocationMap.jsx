import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

function LocationMap(props) {
    const defaultPosition = [51.505, -0.09]
    const mapPosition = props.position.length === 2 ? props.position : defaultPosition

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