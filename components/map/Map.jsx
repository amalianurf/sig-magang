import React from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function Map(props) {
    const geoJSONPointToLatLng = (point) => {
        return L.latLng(point.coordinates[1], point.coordinates[0])
    }

    return (
        <MapContainer center={[-1.3631627162310562, 118.42289645522916]} zoom={5} style={{ height: `calc(100vh - ${props.navbarHeight}px)`, width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {props.geoJsonData && (
                <GeoJSON
                    data={props.geoJsonData.features}
                    style={{ fillColor: '#0000ff99', color: '#ffffff', weight: 1 }}
                />
            )}
            {props.companies && props.companies.map((company, index) => {
                return (
                    <Marker key={index} position={geoJSONPointToLatLng(company.location)}>
                        <Popup>{company.brand_name}</Popup>
                    </Marker>
                )
            })}

        </MapContainer>
    )
}

export default Map