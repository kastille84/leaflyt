import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../../services/apiBoards";

export default function useGetBoard(profileId: number) {
  const { id } = useParams();

  const { isLoading: isLoadingBoard, data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id!, profileId),
    // enabled: !!id,
    gcTime: 0,
    staleTime: 0,
  });

  return { isLoadingBoard, board };
}
