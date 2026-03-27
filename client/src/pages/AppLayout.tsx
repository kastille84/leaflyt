import { useGlobalContext } from "../context/GlobalContext";
import LocationSelection from "../features/location/LocationSelection";
import { Outlet } from "react-router-dom";
import OverlaySpinner from "../ui/OverlaySpinner";
import Footer from "../ui/Footer";

export default function AppLayout() {
  const { coords, isGettingLocation } = useGlobalContext();
  return (
    <div>
      {/* This is where the Home OR Pricing component will appear */}
      <Outlet />
      {isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {coords && <LocationSelection coords={coords} />}
      <Footer />
    </div>
  );
}
