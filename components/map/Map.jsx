import React from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

function Map(props) {
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
        const upperBounds = sd.mean + (0.5 * sd.standardDeviation)
        const lowerBounds = sd.mean - (0.5 * sd.standardDeviation)

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

    return (
        <MapContainer center={[-1.3631627162310562, 118.42289645522916]} zoom={5} style={{ height: `calc(100vh - ${props.navbarHeight}px)`, width: '100%' }}>
            <TileLayer
                attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {props.geoJsonData && (
                <GeoJSON
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
    )
}

export default Map