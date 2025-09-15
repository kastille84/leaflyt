import React, { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const MyRectangle = ({ bounds, options }: any) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const rectangle = new google.maps.Rectangle({
      bounds: bounds,
      map: map,
      strokeColor: "#B74539",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#226e33",
      fillOpacity: 0.35,
      ...options,
    });

    return () => {
      rectangle.setMap(null); // Clean up the rectangle when the component unmounts
    };
  }, [map, bounds, options]);

  return null; // This component doesn't render anything directly
};

export default MyRectangle;
