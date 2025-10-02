import { useQuery } from "@tanstack/react-query";
import { useGlobalContext } from "../context/GlobalContext";
import { getUserProfile } from "../services/apiUser";
import { useEffect } from "react";

export default function useGetUserProfileById(enabled: boolean) {
  const { user, setUser } = useGlobalContext();

  const { isLoading: isLoadingUserProfile, data: userProfile } = useQuery({
    queryKey: ["getUserProfileById", user?.id],
    queryFn: () => getUserProfile(user?.id!),
    enabled: enabled,
  });

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile]);

  return { isLoadingUserProfile, userProfile };
}
