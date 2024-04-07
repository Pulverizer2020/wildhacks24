import React, { useState } from "react"; // Import React and useState
import "../components/searchbar.css"

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
    <div className="flex flex-row justify-center items-center mb-5 h-24">

        <div className="flex flex-row items-center">
      <form className="form" onSubmit={handleSearch}>
        {/* Added onChange handler to input */}
        <input
          className="w-[50vw] h-12 mr-6 rounded-md focus:outline-none hover:scale-105 duration-300"
          type="text"
          required
          autoFocus
          placeholder=" Location"
          value={inputValue}
          onChange={handleInputChange} // Handle input changes
        />
      </form>
      {/* Removed onClick from button as it doesn't serve a purpose in the current context */}
      <button style={{borderColor: "rgb(83, 237, 229)", borderWidth: 3, backgroundColor: "#FFFFFF", color: "#000000"}} className="h-12 rounded-md p-2 focus:outline-none hover:scale-105 duration-150" type="submit" onClick={handleSearch}>
        Find Map!
      </button>
      </div>
    </div>
  );
};

export default SearchBar; // Don't forget to export your component
