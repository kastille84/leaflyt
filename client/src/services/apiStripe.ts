import { getBaseUrl } from "../utils/ServiceUtils";

export async function createCustomer({
  firstName,
  lastName,
  email,
  address,
}: {
  firstName: string;
  lastName: string;
  email: string;
  address: any;
}) {
  const response = await fetch(`${getBaseUrl()}/api/stripe/create-customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, address }),
  });
  const responseJson = await response.json();
  return responseJson.data;
}
