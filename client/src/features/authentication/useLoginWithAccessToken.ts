import { useMutation } from "@tanstack/react-query";
import { LoginSubmitData } from "../../interfaces/Auth_User";
import { loginUserWithAccessToken } from "../../services/apiAuth";

export default function useLoginWithAccessToken() {
  const { mutate: autoLogin, error: loginError } = useMutation({
    mutationFn: (token: any) => loginUserWithAccessToken(),
  });

  return { autoLogin, loginError };
}
