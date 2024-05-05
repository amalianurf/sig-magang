import React from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

function Map(props) {
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
    )
}

export default Map