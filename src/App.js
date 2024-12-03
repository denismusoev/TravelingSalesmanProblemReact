import React, { useState } from 'react';
import CityInputForm from './components/CityInputForm';
import MapComponent from './components/MapComponent';
import { calculateRoute } from './api';
import { Container } from 'react-bootstrap';

function App() {
  const [cities, setCities] = useState([]);
  const [route, setRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  const handleRouteCalculation = async (inputCities, clusters) => {
    setCities(inputCities);

    const result = await calculateRoute(inputCities, clusters);
    if (result) {
      setRoute(result.optimizedRoute.map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]));
      console.log(result.optimizedRoute.map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]));
      setTotalDistance(result.totalDistance);
    } else {
      console.error('Не удалось рассчитать маршрут.');
    }
  };

  return (
      <Container>
        <CityInputForm onSubmit={handleRouteCalculation} />
        {cities.length > 0 && <h4 className="text-center mt-4">Общая длина маршрута: {totalDistance.toFixed(2)} км</h4>}
        {cities.length > 0 && <MapComponent cities={cities} route={route} />}
      </Container>
  );
}

export default App;
