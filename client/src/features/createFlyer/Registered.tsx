import styled from "styled-components";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";

import Form from "../../ui/Form/Form";

import Heading from "../../ui/Heading";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormControlRow from "../../ui/Form/FormControlRow";
import TitleInput from "../../ui/Form/TitleInput";
import FormControl from "../../ui/Form/FormControl";
import CategoryInput from "../../ui/Form/CategoryInput";
import SubcategoryInput from "../../ui/Form/SubcategoryInput";
import categoriesObj from "../../data/categories";
import {
  getCategoriesForSelect,
  getSubcategoriesForSelect,
} from "../../utils/GeneralUtils";
import ContentInput from "../../ui/Form/ContentInput";
import ImageInput from "../../ui/Form/ImageInput";
import ImagePreview from "../../ui/Form/ImagePreview";
import TagsInput from "../../ui/Form/TagsInput";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import FullNameInput from "../../ui/Form/FullNameInput";

const StyledRegisteredContainer = styled.div``;
const StyledInfoAlertContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  background-color: var(--color-orange-200);
  padding: 1.6rem 2.4rem;

  & h4 {
    color: var(--color-orange-600);
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  & p {
    font-size: 1.4rem;
    letter-spacing: 0.4px;
  }
  & .learn-more {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  & .learn-more,
  & .learn-more svg {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-orange-600);
  }
`;

const StyledFormContainer = styled.div`
  padding: 1.6rem 2.4rem;
`;

const StyledFormContent = styled.div`
  /* margin-bottom: 4.8rem; */
`;

const StyledFormButtonContainer = styled.div`
  /* position: fixed; */
  /* bottom: 2.4rem; */
  /* right: 2.4rem; */
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export default function Registered() {
  const [showSpinner, setShowSpinner] = useState(false);
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });
  const {
    user,
    setShowCloseSlideInModal,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setFlyerDesignOptions,
  } = useGlobalContext();
  const planLimits = useGetUserLimits();

  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const fileUrlArrWatch = watch("fileUrlArr");
  const isTemplateWatch = watch("isTemplate");

  const onSubmit = async (data: any) => {
    console.log("registered data", data);
  };

  function handleCancel() {
    setShowCloseSlideInModal(true);
  }

  function handleOpenFlyerDesigner() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("flyerDesigner");
    setFlyerDesignOptions({
      getValues: getValues,
      setValue: setValue,
    });
  }

  return (
    <StyledRegisteredContainer>
      {planLimits.canUpgrade && (
        <StyledInfoAlertContainer>
          <Heading as={"h4"}>
            <span>
              <HiOutlineExclamationCircle />
            </span>
            <span>{planLimits.name} Plan</span>
          </Heading>
          <div>
            <p>Do more with your flyers by upgrading your plan.</p>
            <p>
              Why is it better to upgrade?{" "}
              <span className="learn-more">
                LEARN MORE
                <HiOutlineArrowRight />
              </span>
            </p>
          </div>
        </StyledInfoAlertContainer>
      )}
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormContent>
            {/* Title / Category */}
            <FormControlRow>
              <TitleInput register={register} errors={errors} />
              <FormControl>
                <CategoryInput
                  register={register}
                  options={getCategoriesForSelect(categoriesObj)}
                  value={categoryWatch}
                  errors={errors}
                />
                {categoryWatch && (
                  <SubcategoryInput
                    register={register}
                    options={getSubcategoriesForSelect(
                      categoriesObj,
                      categoryWatch
                    )}
                    value={subcategoryWatch}
                    errors={errors}
                  />
                )}
              </FormControl>
            </FormControlRow>
            {/* Description / Image*/}
            <FormControlRow>
              <ContentInput control={control} errors={errors} />
              {/* <FormControl>
                            <label htmlFor="image">Image</label>
                            <Input type="file" id="image" />
                          </FormControl> */}
              <FormControl>
                <ImageInput
                  register={register}
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                  level={user?.plan?.level || 0}
                />
                {fileUrlArrWatch && fileUrlArrWatch.length > 0 && (
                  <ImagePreview
                    fileUrlArr={fileUrlArrWatch}
                    setValue={setValue}
                  />
                )}
              </FormControl>
            </FormControlRow>
            <FormControlRow>
              <TagsInput
                control={control}
                errors={errors}
                getValues={getValues}
              />
            </FormControlRow>
            <FormControlRow>
              <FormControl>
                <Heading as="h4">Make This Flyer a Reusable Template</Heading>
                <p>
                  Creating flyers by scratch each time you post can be tedious.
                  Create a template to save you time and effort by reusing it
                  for future flyers.
                </p>
                <StyledCheckboxContainer>
                  <Input type="checkbox" {...register("isTemplate")} /> Check
                  this box to create a template
                </StyledCheckboxContainer>
                {isTemplateWatch && (
                  <FullNameInput
                    register={register}
                    registerName="templateName"
                    name="Template"
                    errors={errors}
                  />
                )}
              </FormControl>
              <FormControl>
                <Heading as="h4">Flyer Design</Heading>
                <p>Give your flyer a personal touch.</p>
                <p>
                  <Button size="small" onClick={handleOpenFlyerDesigner}>
                    Open the Flyer Designer
                  </Button>
                </p>
              </FormControl>
            </FormControlRow>

            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit">Create</Button>
              <Button
                type="button"
                variation="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </StyledFormButtonContainer>
          </StyledFormContent>
        </Form>
      </StyledFormContainer>
    </StyledRegisteredContainer>
  );
}
