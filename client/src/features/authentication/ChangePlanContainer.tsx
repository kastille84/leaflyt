import styled from "styled-components";
import WhyRegister from "./WhyRegister";
import SignupForm from "./SignupForm";
import { useState } from "react";
import { Auth_User_Signup_Response } from "../../interfaces/Auth_User";
import PaymentFormContainer from "./PaymentFormContainer";
import PickPlanForm from "./PickPlanForm";
import { useGlobalContext } from "../../context/GlobalContext";
import WhyUpgrade from "./WhyUpgrade";

export type PickPlanInfo = {
  plan: string;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    country: string;
    line1: string;
    postal_code: string;
    state: string;
  };
  customerId?: string | null;
};
const StyledUpgradeContainer = styled.div`
  width: 90%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 35% 1fr;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 75em) {
    width: 90%;
    grid-template-columns: 1fr;
  }
`;

const testSignedUpUser = {
  id: "ba8eff6f-102b-4d24-afca-eabce2cff9c8",
  created_at: "2026-01-08T22:28:07.015615+00:00",
  user: "714bb470-2cd6-42d0-8597-360217718f4a",
  name: null,
  firstName: "Edwin",
  lastName: "Martinez",
  email: "sereneattraction86@gmail.com",
  phone: "8454013350",
  website: "http://www.dwm.com",
  typeOfUser: "individual",
  address: {
    name: "94 Rockwell Ave",
    geometry: {
      location: {
        lat: 41.8202319,
        lng: -72.7007884,
      },
    },
    place_id: "ChIJs7QfKi9V5okRAPILwKXyoc8",
    adr_address:
      '<span class="street-address">94 Rockwell Ave</span>, <span class="locality">Bloomfield</span>, <span class="region">CT</span> <span class="postal-code">06002-3216</span>, <span class="country-name">USA</span>',
    formatted_address: "94 Rockwell Ave, Bloomfield, CT 06002, USA",
    html_attributions: [],
  },
  avatar: null,
  plan: 1,
  termsAccepted: true,
};

export default function ChangePlanContainer({
  isUpgrade,
  isAnyPaidPlan,
}: {
  isAnyPaidPlan?: boolean;
  isUpgrade?: boolean;
}) {
  const { user } = useGlobalContext();
  const [signedUpUser, setSignedUpUser] =
    useState<Auth_User_Signup_Response | null>(user);
  const [pickPlanInfo, setPickPlanInfo] = useState<PickPlanInfo | null>(null);
  console.log("pickPlanInfo", pickPlanInfo);
  return (
    <StyledUpgradeContainer>
      <WhyUpgrade />

      {signedUpUser && !pickPlanInfo && (
        <PickPlanForm
          signedUpUser={signedUpUser}
          setPickPlanInfo={setPickPlanInfo}
          isUpgrade={isUpgrade}
          currentPlanId={signedUpUser.plan.id}
          isAnyPaidPlan={isAnyPaidPlan}
        />
      )}
      {signedUpUser && pickPlanInfo && (
        <PaymentFormContainer
          signedUpUser={signedUpUser}
          pickPlanInfo={pickPlanInfo}
        />
      )}
    </StyledUpgradeContainer>
  );
}
// ('<span class="street-address">754 Broadway</span>, <span class="locality">Albany</span>, <span class="region">NY</span> <span class="postal-code">12207-2331</span>, <span class="country-name">USA</span>');
