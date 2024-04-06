import React, { useState } from 'react'; // Import React and useState
import Map from '../components/map'

const SearchBar: React.FC = () => {
    const [inputValue, setInputValue] = useState(''); // Initial state is an empty string
    const [locationInfo, setLocationInfo] = useState(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Updates state with current input value
    }

    const handleSearch = async () => {
        const baseURL = 'https://nominatim.openstreetmap.org/search';
        const params =  `?q=${encodeURIComponent(inputValue)}&format=json&limit=1`;
        try {
            const response = await fetch(`${baseURL}${params}`);
            const data = await response.json();
            if (data && data.length > 0) {
                setLocationInfo(data[0]);
                console.log(locationInfo)
            } else {
                setLocationInfo(null);
            }
        } catch (error) {
            console.error('Failed to fetch location:', error);
            setLocationInfo(null);
        }
    }

    return (
        <div className='searchBar'>
            <form className='form'>
                {/* Added onChange handler to input */}
                <input 
                    className = 'location'
                    type='text' 
                    required 
                    autoFocus 
                    placeholder='Location' 
                    value={inputValue}
                    onChange={handleInputChange} // Handle input changes
                />
            </form>
            {/* Removed onClick from button as it doesn't serve a purpose in the current context */}
            <button onClick = {handleSearch}>Find Map</button>
            
        <Map locationInfo = {locationInfo} />
        </div>
    );
}

export default SearchBar; // Don't forget to export your component
