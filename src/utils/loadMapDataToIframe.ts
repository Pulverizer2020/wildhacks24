const loadMapDataToIframe = async (
  mapData: object,
  iframeRef: React.MutableRefObject<HTMLIFrameElement>
) => {
  // send this data to the map
  iframeRef.current.contentWindow?.postMessage({
    call: "loadMapState",
    value: mapData,
  });
};

export default loadMapDataToIframe;
