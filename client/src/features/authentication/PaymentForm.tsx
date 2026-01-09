import React from "react";
import { Auth_User_Signup_Response } from "../../interfaces/Auth_User";
import { PickPlanInfo } from "./SignupContainer";

export default function PaymentForm({
  signedUpUser,
  pickPlanInfo,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  pickPlanInfo: PickPlanInfo;
}) {
  return <div>PaymentForm</div>;
}
