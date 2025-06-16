import React, { useState, useCallback } from 'react';
import { APIProvider, Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';

interface MapLocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  apiKey: string;
}

const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  onLocationSelect,
  initialLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo como padrão
  apiKey
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');

  // Função para geocoding reverso (coordenadas para endereço)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
        onLocationSelect({ lat, lng, address: formattedAddress });
      }
    } catch (error) {
      console.error('Erro no geocoding reverso:', error);
    }
  }, [onLocationSelect]);

  // Função para geocoding (endereço para coordenadas)
  const geocodeAddress = useCallback(async (address: string) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address });
      
      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setSelectedLocation({ lat, lng });
        onLocationSelect({ lat, lng, address: response.results[0].formatted_address });
      }
    } catch (error) {
      console.error('Erro no geocoding:', error);
    }
  }, [onLocationSelect]);

  const handleMapClick = (event: { detail: { latLng: google.maps.LatLngLiteral | null } }) => {
    const latLng = event.detail.latLng;
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      setSelectedLocation({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };
  
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
          Pesquisar Endereço
        </label>
        <form onSubmit={handleAddressSubmit} className="flex space-x-2">
          <input
            id="address-search"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Digite o endereço..."
            className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="h-96 w-full border border-gray-300 rounded-lg overflow-hidden">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={initialLocation}
            center={selectedLocation}
            defaultZoom={15}
            onClick={handleMapClick}
            mapId="location-selector-map"
          >
            <Marker position={selectedLocation} />
          </Map>
        </APIProvider>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Coordenadas:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
        {address && <p><strong>Endereço:</strong> {address}</p>}
        <p className="mt-2 text-xs text-gray-500">
          Clique no mapa para selecionar uma localização ou use a busca por endereço acima.
        </p>
      </div>
    </div>
  );
};

export default MapLocationSelector;

