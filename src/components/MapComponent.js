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

const MapComponent = ({ cities, route, clusters }) => {
    const mapRef = useRef();

    useEffect(() => {
        if (!clusters || clusters.length === 0) {
            console.warn('Кластеры отсутствуют.');
            return;
        }

        const features = [];
        const clusterColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533']; // Цвета для кластеров

        // Создание точек для кластеров
        clusters.forEach((cluster, clusterIndex) => {
            cluster.forEach((city) => {
                const pointFeature = new Feature({
                    geometry: new Point(fromLonLat([city.longitude, city.latitude])),
                });

                pointFeature.setStyle(
                    new Style({
                        image: new CircleStyle({
                            radius: 6,
                            fill: new Fill({
                                color: clusterColors[clusterIndex % clusterColors.length],
                            }),
                            stroke: new Stroke({ color: 'black', width: 1 }),
                        }),
                    })
                );

                features.push(pointFeature);
            });
        });

        // Создание линий маршрута
        if (route && route.length > 0) {
            route.forEach(([start, end]) => {
                const lineFeature = new Feature({
                    geometry: new LineString([
                        fromLonLat([start.longitude, start.latitude]),
                        fromLonLat([end.longitude, end.latitude]),
                    ]),
                });

                lineFeature.setStyle(
                    new Style({
                        stroke: new Stroke({
                            color: 'blue',
                            width: 2,
                        }),
                    })
                );

                features.push(lineFeature);
            });
        }

        // Инициализация карты
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features,
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat([cities[0].longitude, cities[0].latitude]),
                zoom: 4,
            }),
        });

        return () => map.setTarget(null);
    }, [cities, route, clusters]);

    return (
        <div>
            <h5>Схема маршрута:</h5>
            <p>
                {route.length > 0 ? (
                    <span>
            {route.map(([start], index) => (
                <span key={index}>
                {start.name}
                    {index < route.length - 1 && ' → '}
              </span>
            ))}
          </span>
                ) : (
                    <span>Маршрут отсутствует.</span>
                )}
            </p>
            <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
        </div>
    );
};

export default MapComponent;


