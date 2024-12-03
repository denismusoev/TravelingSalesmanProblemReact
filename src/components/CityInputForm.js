import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Dropdown } from 'react-bootstrap';

const defaultSet = [
    { name: 'Москва', latitude: 55.7558, longitude: 37.6173 },
    { name: 'Казань', latitude: 55.8304, longitude: 49.0661 },
    { name: 'Санкт-Петербург', latitude: 59.9343, longitude: 30.3351 },
    { name: 'Новосибирск', latitude: 55.0084, longitude: 82.9357 }
];

const CityInputForm = ({ onSubmit }) => {
    const [cities, setCities] = useState([]);
    const [cityName, setCityName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [clusters, setClusters] = useState(1);
    const [savedSets, setSavedSets] = useState([]);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('citySets')) || [];
        if (savedData.length === 0) {
            const initialSet = [{ name: 'Начальный набор', cities: defaultSet }];
            localStorage.setItem('citySets', JSON.stringify(initialSet));
            setSavedSets(initialSet);
            setCities(defaultSet);
        } else {
            setSavedSets(savedData);
            setCities(savedData[0].cities);
        }
    }, []);

    const addCity = () => {
        if (cityName && latitude && longitude) {
            setCities([...cities, { name: cityName, latitude: parseFloat(latitude), longitude: parseFloat(longitude) }]);
            setCityName('');
            setLatitude('');
            setLongitude('');
        }
    };

    const handleSubmit = () => {
        onSubmit(cities, clusters);
    };

    const saveCurrentSet = () => {
        const newSet = { name: `Набор ${savedSets.length + 1}`, cities };
        const updatedSets = [...savedSets, newSet];
        localStorage.setItem('citySets', JSON.stringify(updatedSets));
        setSavedSets(updatedSets);
    };

    const loadSet = (set) => {
        setCities(set.cities);
    };

    const clearCities = () => {
        setCities([]); // Очистка списка городов
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Добавить города и задать количество кластеров</h2>
            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Название города"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            placeholder="Широта"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            placeholder="Долгота"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={addCity}>Добавить город</Button>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Control
                            type="number"
                            min="1"
                            value={clusters}
                            onChange={(e) => setClusters(e.target.value)}
                            placeholder="Количество кластеров"
                        />
                    </Col>
                    <Col>
                        <Button variant="success" onClick={handleSubmit}>Построить маршрут</Button>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Button variant="warning" onClick={saveCurrentSet}>Сохранить набор</Button>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                Выбрать набор
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {savedSets.map((set, index) => (
                                    <Dropdown.Item key={index} onClick={() => loadSet(set)}>
                                        {set.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={clearCities}>Очистить список</Button>
                    </Col>
                </Row>
            </Form>

            {cities.length > 0 && (
                <Table striped bordered hover className="mt-4">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Город</th>
                        <th>Широта</th>
                        <th>Долгота</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cities.map((city, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{city.name}</td>
                            <td>{city.latitude}</td>
                            <td>{city.longitude}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default CityInputForm;
