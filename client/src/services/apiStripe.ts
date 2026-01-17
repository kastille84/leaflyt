import { getBaseUrl } from "../utils/ServiceUtils";

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
  const response = await fetch(`${getBaseUrl()}/api/stripe/create-customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, address, userId }),
  });
  const responseJson = await response.json();
  return responseJson.data;
}

export async function deleteCustomer({ customerId }: { customerId: string }) {
  const response = await fetch(`${getBaseUrl()}/api/stripe/delete-customer`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      customerId: customerId,
    },
  });
  const responseJson = await response.json();
  return responseJson.data;
}

export async function createCheckoutSession({
  plan,
  customerId,
}: {
  plan: string;
  customerId: string;
}) {
  const response = await fetch(
    `${getBaseUrl()}/api/stripe/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan, customerId }),
    }
  );
  const responseJson = await response.json();
  return responseJson; // {clientSecret: ...}
}
