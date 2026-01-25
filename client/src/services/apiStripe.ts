import { getBaseUrl } from "../utils/ServiceUtils";
import { selectEverythingFromProfile } from "./apiUser";
import { supabase } from "./supabase";

export async function createCustomer({
  firstName,
  lastName,
  email,
  address,
  userId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  address: any;
  userId: string;
}) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/stripe/create-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, address, userId }),
    });
    const responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteCustomer({ customerId }: { customerId: string }) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/stripe/delete-customer`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        customerid: customerId,
      },
    });
    const responseJson = await response.json();
    return responseJson.data;
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateSubscription({
  subscriptionId,
  plan,
  userId,
}: {
  subscriptionId: string;
  plan: string;
  userId: string;
}) {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/stripe/update-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId,
          newPlan: plan, // as "2"
        }),
      },
    );
    const responseJson = await response.json();
    // update the user's plan in supabase
    const { data: updatedUser, error } = await supabase
      .from("profiles")
      .update({ plan: plan })
      .eq("id", userId)
      .select(selectEverythingFromProfile)
      .single();
    return {
      user: updatedUser,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createCheckoutSession({
  plan,
  customerId,
  updatePaymentInfo,
}: {
  plan: string;
  customerId: string;
  updatePaymentInfo?: boolean;
}) {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, customerId, updatePaymentInfo }),
      },
    );
    const responseJson = await response.json();
    return responseJson; // {clientSecret: ...}
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}

export const updateUserPlan = async (userId: string, plan: string) => {
  try {
    const { data: userData, error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", userId)
      .select(selectEverythingFromProfile)
      .single();
    if (error) {
      throw error;
    }
    return {
      user: userData,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};
