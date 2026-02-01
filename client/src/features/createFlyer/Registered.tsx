import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";

import Form from "../../ui/Form/Form";

import Heading from "../../ui/Heading";
import { useEffect, useState } from "react";
import { useForm, UseFormProps } from "react-hook-form";
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
import TagsInput from "../../ui/Form/TagsInput";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import FullNameInput from "../../ui/Form/FullNameInput";
import CtaInput from "../../ui/Form/CtaInput";
import LifespanInput from "../../ui/Form/LifespanInput";
import { LIFESPAN, REGISTERED_FLYER_DESIGN_DEFAULT } from "../../constants";
import CommentsInput from "../../ui/Form/CommentsInput";
import useRegisteredFlyer from "./useRegisteredFlyer";
import toast from "react-hot-toast";
import FlyerDesignerInput from "../../ui/Form/FlyerDesignerInput";
import FormInfoAlert from "../../ui/Form/FormInfoAlert";
import { DB_Flyers_Response, DB_Template } from "../../interfaces/DB_Flyers";
import AssetsPreviewList from "../assets/AssetSelection/AssetsPreview/AssetsPreviewList";

const StyledRegisteredContainer = styled.div``;

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
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

export default function Registered({
  flyerToEdit,
  templateToEdit,
  type = "create",
}: {
  flyerToEdit?: DB_Flyers_Response | null;
  templateToEdit?: DB_Template | null;
  type?: "create" | "edit" | "createTemplate" | "editTemplate";
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formOptions: UseFormProps = {
    mode: "onBlur",
  };

  if (flyerToEdit) {
    formOptions.defaultValues = flyerToEdit;
  }

  if (templateToEdit) {
    formOptions.defaultValues = templateToEdit;
  }

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm(formOptions);
  const {
    user,
    setUser,
    setShowCloseSlideInModal,
    setIsOpenFlyerDrawer,
    setDrawerAction,
    setSelectedFlyer,
    selectedPlace,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setCurrentFormOptions,
  } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const { createFlyer, editFlyer, editTemplate, createTemplateFn } =
    useRegisteredFlyer();

  const queryClient = useQueryClient();

  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const fileUrlArrWatch = watch("fileUrlArr");
  const templateWatch = watch("template");
  const lifespanWatch = watch("lifespan");

  console.log("errors", errors);
  console.log("getValues", getValues());

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

    if (flyerToEdit) {
      // action - Edit Existing Flyer
      editFlyer(
        { prepData: data, initialAssets: flyerToEdit.fileUrlArr },
        {
          onSuccess: ({ user }: any) => {
            setShowSpinner(false);
            toast.success("Flyer updated!");
            setIsOpenFlyerDrawer(false);
            setDrawerAction(null);
            setSelectedFlyer(null);
            queryClient.invalidateQueries({
              queryKey: ["board", selectedPlace?.id],
              refetchType: "all",
            });
            // update the user
            setUser(user);
          },
          onError: (error: any) => {
            setShowSpinner(false);
            toast.error(error.message);
            setSubmitError(error.message);
            // set focus on error
            document.querySelector("#form-error")?.scrollIntoView();
          },
        },
      );
    } else if (templateToEdit && type === "editTemplate") {
      // remove the template property
      delete data.template;
      // action - Edit Existing Template
      editTemplate(
        { prepData: data, initialAssets: templateToEdit.fileUrlArr },
        {
          onSuccess: ({ user }: any) => {
            setShowSpinner(false);
            toast.success("Template updated!");
            setIsOpenFlyerDrawer(false);
            setDrawerAction(null);
            setSelectedFlyer(null);
            // update the user
            setUser(user);
          },
          onError: (error: any) => {
            setShowSpinner(false);
            toast.error(error.message);
            setSubmitError(error.message);
            // set focus on error
            document.querySelector("#form-error")?.scrollIntoView();
          },
        },
      );
    } else if (type === "createTemplate") {
      // action - Create New Template
      createTemplateFn(data, {
        onSuccess: ({ user }: any) => {
          setShowSpinner(false);
          toast.success("Template created!");
          setIsOpenFlyerDrawer(false);
          setDrawerAction(null);
          setSelectedFlyer(null);
          // update the user
          setUser(user);
        },
        onError: (error: any) => {
          setShowSpinner(false);
          toast.error(error.message);
          setSubmitError(error.message);
          // set focus on error
          document.querySelector("#form-error")?.scrollIntoView();
        },
      });
    } else {
      // action - Create New Flyer
      createFlyer(data, {
        onSuccess: ({ user }: any) => {
          setShowSpinner(false);
          toast.success("Flyer created!");
          setIsOpenFlyerDrawer(false);
          setDrawerAction(null);
          queryClient.invalidateQueries({
            queryKey: ["board", selectedPlace?.id],
          });
          // update the user
          setUser(user);
          // queryClient.refetchQueries({
          //   queryKey: ["board", selectedPlace?.id],
          // });
        },
        onError: (error: any) => {
          setShowSpinner(false);
          toast.error(error.message);
          setSubmitError(error.message);
          // set focus on error
          document.querySelector("#form-error")?.scrollIntoView();
        },
      });
    }

    // navigate(".", { replace: true });
  };

  function handleCancel() {
    setShowCloseSlideInModal(true);
  }

  function handleChooseAsset() {
    setBottomSlideInType("chooseAssets");
    setIsOpenBottomSlideIn(true);
  }

  useEffect(() => {
    // give globalContext access to the form options
    setCurrentFormOptions({
      getValues: getValues,
      setValue: setValue,
    });
  }, []);

  useEffect(() => {
    if (!templateWatch) {
      unregister("templateName");
    }
  }, [templateWatch]);

  return (
    <StyledRegisteredContainer data-testid="registered-container">
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
                      categoryWatch,
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
                {/* <ImageInput
                  register={register}
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                  level={user?.plan?.level || 0}
                />
                 */}
                {/* {fileUrlArrWatch && fileUrlArrWatch.length > 0 && (
                  <ImagePreview
                    fileUrlArr={fileUrlArrWatch}
                    setValue={setValue}
                    isTimed={!flyerToEdit && !templateToEdit}
                    isTemplate={!!templateToEdit}
                  />
                )} */}
                <StyledLabel htmlFor="image">Choose assets</StyledLabel>
                <Button
                  type="button"
                  onClick={handleChooseAsset}
                  data-testid="choose-asset-button"
                >
                  Open Assets Uploader
                </Button>
                {fileUrlArrWatch && fileUrlArrWatch.length > 0 && (
                  <AssetsPreviewList fileUrlArr={fileUrlArrWatch} />
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
                // setValue={setValue}
                // getValues={getValues}
                canUpgrade={!planLimits.paid}
              />
            </FormControlRow>
            {planLimits.templates.isAllowed && !flyerToEdit && (
              <FormControlRow>
                <FormControl testId="template-container">
                  <StyledLabel>
                    Create Reusable Template (Encouraged)
                  </StyledLabel>
                  <p>
                    Creating flyers from scratch each time you post can be
                    tedious. Create a template to save you time and effort by
                    reusing it for future flyers.
                  </p>
                  <StyledCheckboxContainer>
                    <Input
                      type="checkbox"
                      {...register("template")}
                      checked={templateWatch}
                      disabled={!!type.match(/template/i)}
                    />{" "}
                    Check this box to create a template
                  </StyledCheckboxContainer>
                  {/* {(templateWatch || !!type.match(/template/i)) && (
                    <>
                      <FullNameInput
                        register={register}
                        registerName="templateName"
                        name="Template"
                        errors={errors}
                        textLimit={30}
                      />
                      <CommentsInput register={register} />
                    </>
                  )} */}
                </FormControl>
                <FormControl>{/* Empty */}</FormControl>
              </FormControlRow>
            )}

            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit">
                {flyerToEdit || templateToEdit ? "Update" : "Create"}
              </Button>
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
