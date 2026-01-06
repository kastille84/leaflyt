import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { SignupSubmitData } from "../../interfaces/Auth_User";
import { signupUser, sendWelcomeEmail } from "../../services/apiAuth";

export default function useSignup() {
  const { mutate: signup, error: signupError } = useMutation({
    mutationFn: (prepData: SignupSubmitData) => signupUser(prepData),
  });

  const { mutate: sendWelcomeEmailFn, error: sendWelcomeEmailFnError } =
    useMutation({
      mutationFn: ({
        email,
        typeOfUser,
        name,
        firstName,
        lastName,
      }: {
        email: string;
        typeOfUser: string;
        name: string;
        firstName: string;
        lastName: string;
      }) =>
        sendWelcomeEmail({
          email,
          typeOfUser,
          name,
          firstName,
          lastName,
        }),
    });

  return { signup, signupError, sendWelcomeEmailFn, sendWelcomeEmailFnError };
}
