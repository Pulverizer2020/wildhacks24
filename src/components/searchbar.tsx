import React, { useState } from "react"; // Import React and useState

import FirestoreLink from "./firestorelink";
type Props = {
    iframeRef: React.MutableRefObject<HTMLIFrameElement>;
};

const SearchBar: React.FC<Props> = (props: Props) => {
    const [inputValue, setInputValue] = useState(""); // Initial state is an empty string

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Updates state with current input value
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const baseURL = "https://nominatim.openstreetmap.org/search";
        const params = `?q=${encodeURIComponent(inputValue)}&format=json&limit=1`;
        try {
            const response = await fetch(`${baseURL}${params}`);
            const data = await response.json();
            if (data && data.length > 0) {
                // only update on successful query
                props.iframeRef.current.contentWindow?.postMessage({
                    call: "mapLocation",
                    value: [data[0].lat, data[0].lon],
                });
            }
        } catch (error) {
            console.error("Failed to fetch location:", error);
        }
    };

    return (
        <div className="searchBar pt-20">
            <form className="form" onSubmit={handleSearch}>
                {/* Added onChange handler to input */}
                <input
                    className="location"
                    type="text"
                    required
                    autoFocus
                    placeholder="Location"
                    value={inputValue}
                    onChange={handleInputChange} // Handle input changes
                />
            </form>
            {/* Removed onClick from button as it doesn't serve a purpose in the current context */}
            <button type="submit" onClick={handleSearch}>
                Find Map
            </button>
            <FirestoreLink />
        </div>
    );
};

export default SearchBar; // Don't forget to export your component
