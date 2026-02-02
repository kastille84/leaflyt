import styled from "styled-components";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { DB_Saved_Flyer } from "../../interfaces/DB_Flyers";
import { useGlobalContext } from "../../context/GlobalContext";
import FlyerBlockStatic from "../../ui/Flyer/FlyerBlockStatic";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";

import { useEffect, useState } from "react";
import useRegisteredFlyer from "../createFlyer/useRegisteredFlyer";
import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";

import CategoryInput from "../../ui/Form/CategoryInput";
import SubcategoryInput from "../../ui/Form/SubcategoryInput";
import {
  getCategoriesForSelect,
  getSubcategoriesForSelect,
} from "../../utils/GeneralUtils";
import categoriesObj from "../../data/categories";
import Input from "../../ui/Input";
import OverlaySpinner from "../../ui/OverlaySpinner";

const StyledSavedFlyersListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
  padding-bottom: 2.4rem;

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

const StyledActionContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;

  & svg {
    color: var(--color-brand-700);
    font-size: 2rem;
    cursor: pointer;
  }
  & svg:hover {
    color: var(--color-blue-400);
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

const StyledSavedFlyersListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px dashed var(--color-brand-700);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
  background-color: var(--color-grey-50);

  /* @media (max-width: 59em) {
    align-self: center;
  } */
`;
export default function SavedFlyersList() {
  const [showSpinner, setShowSpinner] = useState(false);
  const { user, setUser } = useGlobalContext();
  const { removeSavedFlyerFn } = useRegisteredFlyer();
  const responsiveVal = useResponsiveWidth();

  const responsiveItemStyle = {
    alignItems: ["s_tablet", "m_tablet", "l_mobile", "s_mobile"].includes(
      responsiveVal,
    )
      ? "center"
      : "start",
  };

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const filterOnWatch = watch("filter");

  const originalFlyers = (user && user!["saved_flyers"]) || [];

  // filter flyers based on categoryWatch and subcategoryWatch
  let filteredFlyers = originalFlyers.filter((saved_flyer) => {
    if (categoryWatch && saved_flyer.flyer.category !== categoryWatch)
      return false;
    if (subcategoryWatch && saved_flyer.flyer.subcategory !== subcategoryWatch)
      return false;
    return true;
  });
  function determineWhichFlyersToUse() {
    if (categoryWatch || subcategoryWatch) return filteredFlyers;
    return originalFlyers;
  }

  useEffect(() => {
    setValue("subcategory", "");
  }, [categoryWatch]);

  useEffect(() => {
    if (!filterOnWatch) {
      setValue("category", "");
      setValue("subcategory", "");
    }
  }, [filterOnWatch]);
  async function removeSavedFlyer(id: number, toastMessage: string) {
    setShowSpinner(true);
    removeSavedFlyerFn(
      { flyerId: id, type: "id" },
      {
        onSuccess: ({ user }) => {
          // update the user
          setUser(user);
          setShowSpinner(false);
          toast.success(toastMessage);
        },
        onError: (error) => {
          toast.error(error.message);
          setShowSpinner(false);
        },
      },
    );
  }

  return (
    <StyledSavedFlyersListContainer>
      {originalFlyers.length === 0 && (
        <StyledSmall as="h2">No saved flyers</StyledSmall>
      )}
      {originalFlyers.length > 0 && (
        <div data-testid="saved-flyers" style={{ width: "100%" }}>
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
                {" "}
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
            <Masonry
              columnsCount={3}
              gutter="1.6rem"
              itemStyle={responsiveItemStyle}
            >
              {determineWhichFlyersToUse().length &&
                determineWhichFlyersToUse().map(
                  (savedFlyer: DB_Saved_Flyer) => (
                    <StyledSavedFlyersListItem key={savedFlyer.id}>
                      <StyledActionContainer>
                        <StyledSmall>
                          <span>Saved @ {savedFlyer.flyer.place!.name!}</span>
                        </StyledSmall>
                        <HiOutlineXMark
                          onClick={() =>
                            removeSavedFlyer(
                              savedFlyer.id,
                              "Flyer removed from saved flyers",
                            )
                          }
                        />
                      </StyledActionContainer>
                      <FlyerBlockStatic
                        key={savedFlyer.flyer.id}
                        flyer={savedFlyer.flyer}
                        redeemable={true}
                        handleRedeem={() =>
                          removeSavedFlyer(savedFlyer.id, "Flyer redeemed!")
                        }
                      />
                    </StyledSavedFlyersListItem>
                  ),
                )}
              {determineWhichFlyersToUse().length === 0 && (
                <StyledSmall as="h2">No flyers found</StyledSmall>
              )}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      )}
      {showSpinner && <OverlaySpinner message="Removing flyer..." />}
    </StyledSavedFlyersListContainer>
  );
}
