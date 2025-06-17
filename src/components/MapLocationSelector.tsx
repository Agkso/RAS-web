import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, MapMouseEvent, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';

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
  const [addressInput, setAddressInput] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');

  const geocodingLibrary = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    console.log('MapLocationSelector: useEffect - geocodingLibrary changed', geocodingLibrary);
    if (geocodingLibrary) {
      console.log('MapLocationSelector: Initializing Geocoder...');
      setGeocoder(new geocodingLibrary.Geocoder());
    }
  }, [geocodingLibrary]);

  // Função para geocoding reverso (coordenadas para endereço)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    console.log('MapLocationSelector: Reverse geocoding for:', lat, lng);
    if (!geocoder) {
      console.error('MapLocationSelector: Geocoder not initialized for reverse geocoding.');
      return;
    }
    try {
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setDisplayAddress(formattedAddress);
        onLocationSelect({ lat, lng, address: formattedAddress });
        console.log('MapLocationSelector: Reverse geocoding successful:', formattedAddress);
      } else {
        console.warn('MapLocationSelector: No results found for reverse geocoding.');
      }
    } catch (error) {
      console.error('MapLocationSelector: Erro no geocoding reverso:', error);
      setDisplayAddress('Endereço não encontrado');
    }
  }, [geocoder, onLocationSelect]);

  // Função para geocoding (endereço para coordenadas)
  const geocodeAddress = useCallback(async (addr: string) => {
    console.log('MapLocationSelector: Geocoding address:', addr);
    if (!geocoder) {
      console.error('MapLocationSelector: Geocoder not initialized for geocoding address.');
      return;
    }
    try {
      const response = await geocoder.geocode({ address: addr });
      
      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setSelectedLocation({ lat, lng });
        setDisplayAddress(response.results[0].formatted_address);
        onLocationSelect({ lat, lng, address: response.results[0].formatted_address });
        console.log('MapLocationSelector: Geocoding successful:', response.results[0].formatted_address);
      } else {
        console.warn('MapLocationSelector: No results found for geocoding address:', addr);
        setDisplayAddress('Endereço não encontrado');
      }
    } catch (error) {
      console.error('MapLocationSelector: Erro no geocoding:', error);
      setDisplayAddress('Endereço não encontrado');
    }
  }, [geocoder, onLocationSelect]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
  
    if (!latLng) return;
  
    const { lat, lng } = latLng;
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('MapLocationSelector: Address search submitted:', addressInput);
    if (addressInput.trim()) {
      geocodeAddress(addressInput);
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
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
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
        {displayAddress && <p><strong>Endereço:</strong> {displayAddress}</p>}
        <p className="mt-2 text-xs text-gray-500">
          Clique no mapa para selecionar uma localização ou use a busca por endereço acima.
        </p>
      </div>
    </div>
  );
};

export default MapLocationSelector;


