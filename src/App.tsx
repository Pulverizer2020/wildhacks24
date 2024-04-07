
import { useRef } from "react";

import SearchBar from "./components/searchbar";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  return (
    <>
      <SearchBar iframeRef={iframeRef} />
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "500px" }}
        src="map.html"
      />
    </>
  );
}

export default App;
