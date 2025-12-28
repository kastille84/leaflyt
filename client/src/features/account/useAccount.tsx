import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../services/apiUser";

export default function useAccount() {
  const { mutate: updateProfile, error: updateProfileError } = useMutation({
    mutationFn: ({
      profile,
      typeOfUser,
      userId,
    }: {
      profile: any;
      typeOfUser: "individual" | "business" | "organization" | string;
      userId: string;
    }) => updateUserProfile({ profile, typeOfUser, userId }),
  });

  return { updateProfile, updateProfileError };
}
