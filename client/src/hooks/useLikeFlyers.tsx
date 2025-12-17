import { useGlobalContext } from "../context/GlobalContext";

export function useLikeFlyers(flyerId: string) {
  const { likedContextSessionFlyers, setLikedContextSessionFlyers } =
    useGlobalContext();

  const setLikedFlyer = (action: "add" | "remove") => {
    // get latest session
    const currentLikedSessionFlyers = sessionStorage.getItem("likedFlyers")
      ? (JSON.parse(sessionStorage.getItem("likedFlyers")!) as string[])
      : [];
    if (action === "add") {
      sessionStorage.setItem(
        "likedFlyers",
        JSON.stringify([...currentLikedSessionFlyers, flyerId])
      );
      setLikedContextSessionFlyers([...currentLikedSessionFlyers, flyerId]);
    } else if (action === "remove") {
      sessionStorage.setItem(
        "likedFlyers",
        JSON.stringify(
          currentLikedSessionFlyers.filter((id: string) => id !== flyerId)
        )
      );
      setLikedContextSessionFlyers(
        currentLikedSessionFlyers.filter((id: string) => id !== flyerId)
      );
    }
  };

  return { setLikedFlyer };
}
