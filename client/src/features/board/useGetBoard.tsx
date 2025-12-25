import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../../services/apiBoards";

export default function useGetBoard(
  profileId: number,
  filterOptions?: { category?: string; subcategory?: string }
) {
  const { id } = useParams();

  let { isLoading: isLoadingBoard, data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id!, profileId),
    // enabled: !!id,
    gcTime: 0,
    staleTime: 0,
  });

  const originalFlyers = board?.data?.flyers;
  let filteredFlyers = [];

  // if (board && board.data && board.data.flyers && filterOptions?.category) {
  //   filteredFlyers = board.data.flyers.filter(
  //     (flyer) => flyer.category === filterOptions.category
  //   );
  // }

  // if (board && board.data && board.data.flyers && filterOptions?.subcategory) {
  //   board.data.flyers = board.data.flyers.filter(
  //     (flyer) => flyer.subcategory === filterOptions.subcategory
  //   );
  // }

  return { isLoadingBoard, board };
}
