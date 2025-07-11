import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { SignupSubmitData } from "../../interfaces/Auth_User";
import { signupUser } from "../../services/apiAuth";

export default function useSignup() {
  const { mutate: signup, error: signupError } = useMutation({
    mutationFn: (prepData: SignupSubmitData) => signupUser(prepData),
  });

  return { signup, signupError };
}
