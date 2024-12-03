import React, { useState } from 'react';
import CityInputForm from './components/CityInputForm';
import MapComponent from './components/MapComponent';
import { calculateRoute } from './api';
import { Container } from 'react-bootstrap';

function App() {
  const [cities, setCities] = useState([]);
  const [route, setRoute] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  const handleRouteCalculation = async (inputCities, clustersCount) => {
    setCities(inputCities);

    const result = await calculateRoute(inputCities, clustersCount);
    if (result) {
      const processedRoute = result.optimizedRoute.flatMap((cluster, clusterIndex) =>
          cluster.map((city) => ({
            ...city,
            clusterIndex,
          }))
      );

      const visualRoute = processedRoute.map((_, i, arr) => [
        arr[i],
        arr[(i + 1) % arr.length], // Замыкаем маршрут
      ]);

      setRoute(visualRoute); // Устанавливаем маршрут для визуализации
      setClusters(result.optimizedRoute); // Сохраняем кластеры
      setTotalDistance(result.totalDistance); // Устанавливаем общее расстояние
    } else {
      console.error('Не удалось рассчитать маршрут.');
    }
  };

  return (
      <Container>
        <CityInputForm onSubmit={handleRouteCalculation} />
        {cities.length > 0 && (
            <h4 className="text-center mt-4">Общая длина маршрута: {totalDistance.toFixed(2)} км</h4>
        )}
        {clusters.length > 0 && (
            <div className="mt-4">
              <h5>Кластеры:</h5>
              {clusters.map((cluster, index) => (
                  <div key={index}>
                    <strong>Кластер {index + 1}:</strong>{' '}
                    {cluster.map((city) => city.name).join(', ')}
                  </div>
              ))}
            </div>
        )}
        {cities.length > 0 && <MapComponent cities={cities} route={route} clusters={clusters} />}
      </Container>
  );
}

export default App;
