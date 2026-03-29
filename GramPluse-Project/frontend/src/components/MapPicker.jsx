import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Search, Loader2 } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  minHeight: '100%'
};

function MapPicker({ location, setLocation }) {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      } else {
        alert("Location not found. Try a different search.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDfKCZ1s72Mz5flXTVi0aiRq6jb-x2zyI4">
      <div className="relative w-full h-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={location}
          onClick={handleClick}
          mapTypeId="hybrid"
        >
          <Marker position={location} />
        </GoogleMap>
        
        {/* Custom Search Box overlays the map */}
        <form 
          onSubmit={handleSearch}
          className="absolute top-3 left-1/2 -translate-x-1/2 w-3/4 max-w-sm flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ zIndex: 1000 }}
        >
          <input
            type="text"
            placeholder="Search for a location (Press Enter)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 outline-none font-medium text-sm text-gray-800"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-4 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center min-w-[3rem]"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </LoadScript>
  );
}

export default MapPicker;