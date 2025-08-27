import styled from "styled-components";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { useQueryClient } from "@tanstack/react-query";

import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";

import Form from "../../ui/Form/Form";

import Heading from "../../ui/Heading";
import { useEffect, useState } from "react";
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
import CtaInput from "../../ui/Form/CtaInput";
import LifespanInput from "../../ui/Form/LifespanInput";
import { LIFESPAN, REGISTERED_FLYER_DESIGN_DEFAULT } from "../../constants";
import CommentsInput from "../../ui/Form/CommentsInput";
import useCreateRegisteredFlyer from "./useCreateRegisteredFlyer";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import UpgradeText from "../../ui/UpgradeText";
import FlyerDesignerInput from "../../ui/Form/FlyerDesignerInput";
import FormInfoAlert from "../../ui/Form/FormInfoAlert";

const StyledRegisteredContainer = styled.div``;

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600);
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
  const [submitError, setSubmitError] = useState("");

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
    setIsOpenFlyerDrawer,
    setDrawerAction,
  } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const { createFlyer } = useCreateRegisteredFlyer();

  const queryClient = useQueryClient();
  const { id: boardId } = useParams();

  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const fileUrlArrWatch = watch("fileUrlArr");
  const templateWatch = watch("template");
  const lifespanWatch = watch("lifespan");

  console.log("errors", errors);
  console.log("getValules", getValues());

  const onSubmit = async (data: any) => {
    setSubmitError("");
    // add default flyer design if none is set
    if (!data.flyerDesign) {
      data.flyerDesign = REGISTERED_FLYER_DESIGN_DEFAULT;
    }
    // add the user to the flyer
    data.user = user?.id;

    console.log("registered data", data);
    setShowSpinner(true);
    createFlyer(data, {
      onSuccess: () => {
        setShowSpinner(false);
        toast.success("Flyer created!");
        setIsOpenFlyerDrawer(false);
        setDrawerAction(null);
        // queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        queryClient.refetchQueries({ queryKey: ["board", boardId] });
      },
      onError: (error: any) => {
        setShowSpinner(false);
        toast.error(error.message);
        setSubmitError(error.message);
        // set focus on error
        document.querySelector("#form-error")?.scrollIntoView();
      },
    });
  };

  function handleCancel() {
    setShowCloseSlideInModal(true);
  }

  useEffect(() => {
    if (!templateWatch) {
      unregister("templateName");
    }
  }, [templateWatch]);

  return (
    <StyledRegisteredContainer>
      {planLimits.canUpgrade && (
        <FormInfoAlert
          planName={planLimits.name}
          text="Do more with your flyers by upgrading your plan."
          supportText="Why is it better to upgrade?"
        />
      )}
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <StyledSubmitError as={"h4"} id="form-error">
              Error: {submitError}
            </StyledSubmitError>
          )}
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
              <CtaInput
                register={register}
                setValue={setValue}
                watch={watch}
                control={control}
                errors={errors}
              />
            </FormControlRow>
            <FormControlRow>
              <LifespanInput
                register={register}
                options={LIFESPAN[planLimits.level].options}
                value={lifespanWatch}
                errors={errors}
                canUpgrade={planLimits.canUpgrade}
              />
              <FlyerDesignerInput
                setValue={setValue}
                getValues={getValues}
                canUpgrade={!planLimits.paid}
              />
            </FormControlRow>
            <FormControlRow>
              <FormControl>
                <Heading as="h4">Create Reusable Template (encouraged)</Heading>
                <p>
                  Creating flyers from scratch each time you post can be
                  tedious. Create a template to save you time and effort by
                  reusing it for future flyers.
                </p>
                <StyledCheckboxContainer>
                  <Input type="checkbox" {...register("template")} /> Check this
                  box to create a template
                </StyledCheckboxContainer>
                {templateWatch && (
                  <>
                    <FullNameInput
                      register={register}
                      registerName="templateName"
                      name="Template"
                      errors={errors}
                    />
                    <CommentsInput register={register} />
                  </>
                )}
              </FormControl>
              <FormControl>{/* Empty */}</FormControl>
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
