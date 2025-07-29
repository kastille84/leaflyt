import { useMutation } from "@tanstack/react-query";
import { LoginSubmitData } from "../../interfaces/Auth_User";
import { loginUser } from "../../services/apiAuth";

export default function useLogin() {
  const { mutate: login, error: loginError } = useMutation({
    mutationFn: (prepData: LoginSubmitData) =>
      loginUser(prepData.email, prepData.password),
  });

  return { login, loginError };
}
