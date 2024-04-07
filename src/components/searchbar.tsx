import React, { useState, useEffect } from "react"; // Import React and useState
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

import FirestoreLink from "./firestorelink";
type Props = {
    iframeRef: React.MutableRefObject<HTMLIFrameElement>;
};

const SearchBar: React.FC<Props> = (props: Props) => {
    const [inputValue, setInputValue] = useState(""); // Initial state is an empty string
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // User is signed out, redirect to login page
                // although we actually want them to stay on the map page, 
                // this is just to make sure auth is working correctly.
                navigate('/login');
            } else {
                const auth = getAuth();
                const user = auth.currentUser;
                console.log("this is the current user: ", user)
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

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
        <div className="searchBar">
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
