import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";
import FlyerBlockInteractive from "../../ui/Flyer/FlyerBlockInteractive";
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
import { HiOutlineInformationCircle } from "react-icons/hi2";

const StyledBoardContainer = styled.div`
  position: relative;
  & .info-icon {
    position: absolute;
    top: 0;
    right: 1rem;
    font-size: 1.8rem;
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
  gap: 0.8rem;

  @media (max-width: 59em) {
    justify-content: center;
  }
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
  } = useGlobalContext();
  const [shouldGetPlace, setShouldGetPlace] = useState(false);

  // const filterOptions = {
  //   category: categoryWatch,
  //   subcategory: subcategoryWatch,
  // };
  console.log(filterOnWatch);
  const { isLoadingBoard, board } = useGetBoard(user?.id!);

  const originalFlyers = board?.data?.flyers || [];
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
    setShouldGetPlace(true);
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
          size={25}
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
          {hasFlyerAtLocation && (
            <InfoAlert text="You already have a flyer posted here" />
          )}

          {!isLoadingBoard && (originalFlyers.length === 0 || board?.error) ? (
            <NoFlyers />
          ) : (
            <>
              <StyledForm>
                <StyledFilterContainer>
                  <StyledFilterOptionContainer>
                    <label htmlFor="filter">Filter: </label>
                    <Input
                      id="filter"
                      type="checkbox"
                      {...register("filter")}
                      placeholder="Filter:"
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
              </StyledForm>
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
            </>
          )}
        </div>
      </StyledBoardContainer>
    </>
  );
}
