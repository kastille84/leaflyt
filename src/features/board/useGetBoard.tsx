import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../../services/apiBoards";

export function useGetBoard() {
  const { id } = useParams();

  const { isLoading: isLoadingBoard, data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id!),
    enabled: !!id,
  });

  return { isLoadingBoard, board };
}
