import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { SignupSubmitData } from "../../interfaces/Auth_User";
import {
  signupUser,
  sendWelcomeEmail,
  deleteUser,
  sendDeletedUserEmail,
} from "../../services/apiAuth";

import { updateUserProfilePlan } from "../../services/apiUser";

export default function useSignup() {
  const { mutate: signup, error: signupError } = useMutation({
    mutationFn: (prepData: SignupSubmitData) => signupUser(prepData),
  });

  const { mutateAsync: deleteUserAsyncFn, error: deleteUserAsyncFnError } =
    useMutation({
      mutationFn: () => deleteUser(),
    });

  const {
    mutateAsync: updateUserProfilePlanAsyncFn,
    error: updateUserProfilePlanAsyncFnError,
  } = useMutation({
    mutationFn: ({ userId, plan }: { userId: string; plan: number }) =>
      updateUserProfilePlan(userId, plan),
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

  const {
    mutateAsync: sendDeletedUserEmailAsyncFn,
    error: sendDeletedUserEmailAsyncFnError,
  } = useMutation({
    mutationFn: ({
      email,
      name,
      firstName,
      lastName,
    }: {
      email: string;
      name: string;
      firstName: string;
      lastName: string;
    }) =>
      sendDeletedUserEmail({
        email,
        name,
        firstName,
        lastName,
      }),
  });

  return {
    signup,
    signupError,
    sendWelcomeEmailFn,
    sendWelcomeEmailFnError,
    deleteUserAsyncFn,
    deleteUserAsyncFnError,
    updateUserProfilePlanAsyncFn,
    updateUserProfilePlanAsyncFnError,
    sendDeletedUserEmailAsyncFn,
    sendDeletedUserEmailAsyncFnError,
  };
}
