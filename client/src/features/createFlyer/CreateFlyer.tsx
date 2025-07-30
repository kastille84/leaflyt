import useGetUserLimits from "../../hooks/useGetUserLimits";
import Anonymous from "./Anonymous";
import Registered from "./Registered";

export default function CreateFlyer() {
  const planLimits = useGetUserLimits();

  if (!planLimits.registered) return <Anonymous />;
  // TODO : logic to determine which flyer form to show based on if it's anonymous, registered, or paid
  return <Registered />;
}
