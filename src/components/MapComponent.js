import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LineString, Point } from 'ol/geom';
import { Feature } from 'ol';
import { Stroke, Style, Fill, Circle as CircleStyle } from 'ol/style';

const MapComponent = ({ cities, route }) => {
    const mapRef = useRef();

    useEffect(() => {
        if (!route || route.length === 0 || !route[0] || !route[0][0] || !route[route.length - 1][1]) {
            console.warn('Маршрут пуст или данные отсутствуют.');
            return;
        }

        const startFeature = new Feature({
            geometry: new Point(fromLonLat([route[0][0].longitude, route[0][0].latitude])),
        });

        const endFeature = new Feature({
            geometry: new Point(fromLonLat([route[route.length - 1][1].longitude, route[route.length - 1][1].latitude])),
        });

        startFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: 'green' }),
                    stroke: new Stroke({ color: 'black', width: 2 }),
                }),
            })
        );

        endFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: 'red' }),
                    stroke: new Stroke({ color: 'black', width: 2 }),
                }),
            })
        );

        const routeCoords = route.flatMap(segment => [
            fromLonLat([segment[0].longitude, segment[0].latitude]),
            fromLonLat([segment[1].longitude, segment[1].latitude]),
        ]);

        const routeFeature = new Feature({
            geometry: new LineString(routeCoords),
        });

        routeFeature.setStyle(
            new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            })
        );

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: [routeFeature, startFeature, endFeature],
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat([cities[0].longitude, cities[0].latitude]),
                zoom: 4,
            }),
        });

        return () => map.setTarget(null);
    }, [cities, route]);

    return (
        <div>
            <h5>Схема маршрута:</h5>
            <p>
                {route.length > 0 ? (
                    <>
                        {route.map((segment, index) => (
                            <span key={index}>
                            {segment[0].name}
                                {index < route.length - 1 && ' → '}
                        </span>
                        ))}
                    </>
                ) : (
                    <span>Маршрут отсутствует.</span>
                )}
            </p>
            <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
        </div>
    );


};

export default MapComponent;
