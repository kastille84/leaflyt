import { useMutation } from "@tanstack/react-query";
import { LoginSubmitData } from "../../interfaces/Auth_User";
import {
  loginUser,
  forgotPassword,
  updatePassword,
} from "../../services/apiAuth";

export default function useLogin() {
  const { mutate: login, error: loginError } = useMutation({
    mutationFn: (prepData: LoginSubmitData) =>
      loginUser(prepData.email, prepData.password),
  });

  const { mutate: forgotPasswordFn, error: forgotPasswordFnError } =
    useMutation({
      mutationFn: (email: string) => forgotPassword(email),
    });

  const { mutate: updatePasswordFn, error: updatePasswordFnError } =
    useMutation({
      mutationFn: (prepData: any) => updatePassword(prepData),
    });

  return {
    login,
    loginError,
    forgotPasswordFn,
    forgotPasswordFnError,
    updatePasswordFn,
    updatePasswordFnError,
  };
}
