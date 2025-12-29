import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import API from '../services/api';

function TravelComp() {
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [places, setPlaces] = useState([]);
  const [selectedType, setSelectedType] = useState('hotel');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchPlaces = async () => {
      try {
      const res = await API.get('/places', { params: { type: selectedType, lat: location.lat, lng: location.lng } });

        const placesWithType = res.data.map((p) => ({ ...p, type: selectedType }));
        setPlaces(placesWithType);
        setSelectedPlace(null);
      } catch (error) {
        console.error('Failed to fetch places:', error);
        setPlaces([]);
      }
    };

    const fetchWeather = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/weather', {
  params: { lat: location.lat, lng: location.lng },
});
        setWeather(res.data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather(null);
      }
    };

    fetchPlaces();
    fetchWeather();
  }, [location, selectedType]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        places={places}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onSelectPlace={setSelectedPlace}
        weather={weather}
        selectedPlace={selectedPlace}
        currentLocation={location}
        onLocationChange={setLocation}
        style={{ flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <MapView places={places} selectedPlace={selectedPlace} center={location} />
      </div>
    </div>
  );
}

export default TravelComp;
