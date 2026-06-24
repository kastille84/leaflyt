import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";
import FlyerBlockInteractive from "../../ui/Flyer/FlyerBlockInteractive";
import FlyerBlockInteractiveList from "../../ui/Flyer/FlyerBlockInteractiveList";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetPlaceByPlaceId from "../../hooks/useGetPlaceByPlaceId";
import InfoAlert from "../../ui/InfoAlert";
import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";
import CategoryInput from "../../ui/Form/CategoryInput";
import SubcategoryInput from "../../ui/Form/SubcategoryInput";
import {
  getCategoriesForSelect,
  getSubcategoriesForSelect,
} from "../../utils/GeneralUtils";
import categoriesObj from "../../data/categories";
import Input from "../../ui/Input";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import LimitExceededWarning from "../../ui/LimitExceededWarning";
import UpgradeText from "../../ui/UpgradeText";
import {
  HiOutlineFunnel,
  HiOutlineInformationCircle,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import BoardWelcomeModal from "../../ui/Modals/BoardWelcomeModal";
import { isBoardOwner, makeTopFlyer } from "../../utils/FlyerUtils";
import { logQrScan } from "../../services/apiQrAnalytics";

const StyledBoardContainer = styled.div`
  position: relative;
  & .info-icon {
    position: absolute;
    top: 0;
    right: -1rem;
    font-size: 2.4rem;
    cursor: pointer;
    color: var(--color-brand-600);
  }
  & .category,
  & .subcategory {
    font-size: 1.4rem;
    padding: 0;
    margin-bottom: 0;
  }
  & .category select,
  & .subcategory select {
    padding: 0.4rem 1rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const StyledFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.6rem;

  @media (max-width: 59em) {
    /* flex-direction: column; */
    justify-content: center;
  }
`;
const StyledFilterOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  font-size: 1.4rem;

  & .filter-checkbox {
    visibility: hidden;
  }
  & label[for="filter"] {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-brand-700);
    cursor: pointer;
    font-size: 1.6rem;
  }
`;

const StyledFilterSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  @media (max-width: 59em) {
    flex-direction: column;
    align-items: normal;
  }
`;

const StyledSmall = styled.small`
  color: var(--color-orange-600);
  text-transform: uppercase;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-align: right;

  & span {
    font-weight: 600;
    text-decoration: underline;
  }
`;

const StyledViewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.6rem;

  & label[for="view"] {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-brand-700);
    cursor: pointer;
    font-size: 1.6rem;
  }
`;

export default function Board() {
  const responsiveVal = useResponsiveWidth();
  const { id } = useParams();
  const QueryClient = useQueryClient();
  const planLimits = useGetUserLimits();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const filterOnWatch = watch("filter");
  const {
    selectedPlace,
    user,
    hasFlyerAtLocation,
    setHasFlyerAtLocation,
    anonUserPostings,
    setShowMerchantDisclaimerModal,
    setShowBoardWelcomeModal,
  } = useGlobalContext();
  const [shouldGetPlace, setShouldGetPlace] = useState(false);
  const [loggedEA, setLoggedEA] = useState(false);
  const [view, setView] = useState<"card" | "list">("card");
  // const [originalFlyers, setOriginalFlyers] = useState<any[]>([]);

  // const filterOptions = {
  //   category: categoryWatch,
  //   subcategory: subcategoryWatch,
  // };
  const { isLoadingBoard, board } = useGetBoard(user?.id!);

  let originalFlyers = board?.data?.flyers || [];
  originalFlyers = makeTopFlyer(originalFlyers, "leaflit");
  originalFlyers = makeTopFlyer(
    originalFlyers,
    "establishment",
    board?.data?.formattedAddress,
  );

  // filter flyers based on categoryWatch and subcategoryWatch
  let filteredFlyers = originalFlyers.filter((flyer) => {
    if (categoryWatch && flyer.category !== categoryWatch) return false;
    if (subcategoryWatch && flyer.subcategory !== subcategoryWatch)
      return false;
    return true;
  });

  function determineWhichFlyersToUse() {
    if (categoryWatch || subcategoryWatch) return filteredFlyers;
    return originalFlyers;
  }

  function handleMerchantInfoClick() {
    setShowMerchantDisclaimerModal(true);
  }
  useGetPlaceByPlaceId(id!, shouldGetPlace);

  useEffect(() => {
    if (!user) {
      setShowBoardWelcomeModal(true);
    } else {
      setShowBoardWelcomeModal(false);
      // setOriginalFlyers(board?.data?.flyers || []);
    }
  }, [user]);

  useEffect(() => {
    setShouldGetPlace(true);
    // log qr scan if ea param is present and we haven't already logged an ea scan for this session
    if (selectedPlace && !loggedEA) {
      const searchParams = new URLSearchParams(location.search);
      const establishmentAnalyticsParam = searchParams.get("ea");
      if (
        establishmentAnalyticsParam &&
        JSON.parse(establishmentAnalyticsParam)
      ) {
        // make note of scan date & location in db
        logQrScan(selectedPlace);
        setLoggedEA(true);
      }
    }
  }, [selectedPlace]);

  useEffect(() => {
    setValue("subcategory", "");
  }, [categoryWatch]);

  useEffect(() => {
    if (!filterOnWatch) {
      setValue("category", "");
      setValue("subcategory", "");
    }
  }, [filterOnWatch]);

  useEffect(() => {
    if (user || anonUserPostings.length > 0) {
      checkIfUserHasFlyerHere();
    }
  }, [user, selectedPlace, board, id, anonUserPostings]);

  async function checkIfUserHasFlyerHere() {
    const boardData = await QueryClient.getQueryData(["board", id]);

    if (
      (boardData as any)?.data?.hasFlyerHere ||
      anonUserPostings.includes(id!)
    ) {
      setHasFlyerAtLocation(true);
    } else {
      setHasFlyerAtLocation(false);
    }
  }

  if (isLoadingBoard) return <OverlaySpinner message="Loading Board" />;
  // if no flyers, then show "NoFlyers" component which has a button to create a new flyer
  // if (!isLoadingBoard && (board?.data?.flyers?.length === 0 || board?.error)) {
  //   return <NoFlyers />;
  // }

  // if flyers, then show a list of flyers
  return (
    <>
      <StyledBoardContainer data-testid="board-container">
        <HiOutlineInformationCircle
          className="info-icon"
          // size={25}
          onClick={handleMerchantInfoClick}
        />
        <div data-testid="board" style={{ width: "90%", margin: "auto" }}>
          {!planLimits?.onLocationPosting.isAllowed && (
            <>
              <LimitExceededWarning isClosable={true}>
                <p>
                  You've reached your limit for posting flyers on location.{" "}
                  <br />
                  Try posting flyers remotely.
                </p>
              </LimitExceededWarning>
              <UpgradeText
                text="Upgrade your plan to post more flyers on location."
                type="upgrade"
                btnText="Upgrade"
              />
            </>
          )}
          {hasFlyerAtLocation && !isBoardOwner(user, board!.data) && (
            <InfoAlert text="You already have a flyer posted here" />
          )}

          {!isLoadingBoard && (originalFlyers.length === 0 || board?.error) ? (
            <NoFlyers />
          ) : (
            <>
              <StyledForm>
                <StyledFilterContainer>
                  <StyledFilterOptionContainer>
                    <label htmlFor="filter">
                      <HiOutlineFunnel /> Filter
                    </label>
                    <Input
                      id="filter"
                      type="checkbox"
                      {...register("filter")}
                      placeholder="Filter:"
                      className="filter-checkbox"
                    />
                  </StyledFilterOptionContainer>
                  <StyledFilterSelectContainer>
                    {filterOnWatch && (
                      <CategoryInput
                        register={register}
                        options={getCategoriesForSelect(categoriesObj, "All")}
                        value={categoryWatch}
                        errors={errors}
                        showLabel={false}
                      />
                    )}

                    {filterOnWatch && categoryWatch && (
                      <SubcategoryInput
                        register={register}
                        options={getSubcategoriesForSelect(
                          categoriesObj,
                          categoryWatch,
                        )}
                        value={subcategoryWatch}
                        errors={errors}
                        showLabel={false}
                      />
                    )}
                  </StyledFilterSelectContainer>
                </StyledFilterContainer>
                <StyledViewContainer>
                  {view === "card" ? (
                    <label htmlFor="view" onClick={() => setView("list")}>
                      <HiOutlineListBullet />
                      View
                    </label>
                  ) : (
                    <label htmlFor="view" onClick={() => setView("card")}>
                      <HiOutlineSquares2X2 />
                      View
                    </label>
                  )}
                </StyledViewContainer>
              </StyledForm>
              {view === "card" && (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 940: 2, 1600: 3 }}
                  // gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
                >
                  <Masonry columnsCount={3} gutter="1.6rem">
                    {determineWhichFlyersToUse().length &&
                      determineWhichFlyersToUse().map((flyer) => (
                        <FlyerBlockInteractive key={flyer!.id} flyer={flyer} />
                      ))}

                    {determineWhichFlyersToUse().length === 0 && (
                      <StyledSmall as="h2">No flyers found</StyledSmall>
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
              {view === "list" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.6rem",
                  }}
                >
                  {determineWhichFlyersToUse().length &&
                    determineWhichFlyersToUse().map((flyer) => (
                      <FlyerBlockInteractiveList
                        key={flyer!.id}
                        flyer={flyer}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
        <BoardWelcomeModal />
      </StyledBoardContainer>
    </>
  );
}
