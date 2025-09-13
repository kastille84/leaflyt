import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import Heading from "../../ui/Heading";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

import FormInfoAlert from "../../ui/Form/FormInfoAlert";
import Button from "../../ui/Button";
import FormControlRow from "../../ui/Form/FormControlRow";
import FormControl from "../../ui/Form/FormControl";
import Form from "../../ui/Form/Form";
import AddressInput from "../../ui/Form/AddressInput";
import TitleInput from "../../ui/Form/TitleInput";
import CategoryInput from "../../ui/Form/CategoryInput";
import FirstNameInput from "../../ui/Form/FirstNameInput";
import LastNameInput from "../../ui/Form/LastNameInput";
import EmailInput from "../../ui/Form/EmailInput";
import PhoneInput from "../../ui/Form/PhoneInput";
import WebsiteInput from "../../ui/Form/WebsiteInput";
import FullNameInput from "../../ui/Form/FullNameInput";
import TagsInput from "../../ui/Form/TagsInput";

import categoriesObj from "../../data/categories";
import {
  getCategoriesForSelect,
  getSubcategoriesForSelect,
} from "../../utils/GeneralUtils";
import SubcategoryInput from "../../ui/Form/SubcategoryInput";
import TypeOfUserInput from "../../ui/Form/TypeOfUserInput";
import ContentInput from "../../ui/Form/ContentInput";
import ImageInput from "../../ui/Form/ImageInput";
import ImagePreview from "../../ui/Form/ImagePreview";
import { useGlobalContext } from "../../context/GlobalContext";

import useCreateUnregisteredFlyer from "./useCreateUnregisteredFlyer";
import toast from "react-hot-toast";
import OverlaySpinner from "../../ui/OverlaySpinner";
import AttestationInput from "../../ui/Form/AttestationInput";
import { useParams } from "react-router-dom";

const StyledAnonymousContainer = styled.div``;

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

export default function Anonymous() {
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

  const queryClient = useQueryClient();
  const { id: boardId } = useParams();

  const { setIsOpenFlyerDrawer, setDrawerAction, setShowCloseSlideInModal } =
    useGlobalContext();
  const { createFlyer } = useCreateUnregisteredFlyer();
  const typeOfUserWatch = watch("typeOfUser");
  const typeOfUser = getValues("typeOfUser");
  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const fileUrlArrWatch = watch("fileUrlArr");

  console.log("getValues", getValues());
  console.log("errors", errors);

  useEffect(() => {
    if (typeOfUser) {
      unregister(
        ["anonymous", "individual", "business", "organization"].filter(
          (item) => item !== typeOfUser
        )
      );
      // remove attestation
      if (typeOfUser !== "anonymous") {
        unregister("attestation");
      }
    }
  }, [typeOfUser]);

  useEffect(() => {});

  const onSubmit = async (data: any) => {
    setSubmitError("");
    console.log("data", data);
    const prepData = {
      ...data,
    };
    setShowSpinner(true);
    createFlyer(prepData, {
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

  return (
    <StyledAnonymousContainer data-testid="anonymous-container">
      <FormInfoAlert
        text="Do more with your flyers by signing up or logging in."
        supportText="Register to get more features"
      />
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
                  level={0}
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
              <TypeOfUserInput
                title={"How do you want to post as?"}
                register={register}
                value={typeOfUserWatch}
                errors={errors}
                showUnregisteredMessaging
              />
              <FormControl>{/* empty */}</FormControl>
            </FormControlRow>

            {typeOfUserWatch === "anonymous" && (
              <FormControlRow>
                <AttestationInput register={register} />
              </FormControlRow>
            )}
            {typeOfUserWatch === "individual" && (
              <>
                <FormControlRow>
                  {/* Personal Info / firstName */}
                  <FirstNameInput
                    register={register}
                    registerName="individual.name.firstName"
                    errors={errors}
                  />
                  {/* Personal Info / lastName */}
                  <LastNameInput
                    register={register}
                    registerName="individual.name.lastName"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  <EmailInput
                    register={register}
                    registerName="individual.contact.email"
                    errors={errors}
                  />

                  {/* Personal Info / Phone */}
                  <PhoneInput
                    register={register}
                    registerName="individual.contact.phone"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  <WebsiteInput
                    register={register}
                    registerName="individual.contact.website"
                    errors={errors}
                  />
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
            {typeOfUserWatch === "business" && (
              <>
                <FormControlRow>
                  {/*Business / name */}
                  <FullNameInput
                    register={register}
                    registerName="business.name"
                    name="Business"
                    errors={errors}
                  />
                  {/*Business / address */}
                  <AddressInput
                    register={register}
                    setValue={setValue}
                    registerName="business.contact.address"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  <EmailInput
                    register={register}
                    registerName="business.contact.email"
                    errors={errors}
                  />
                  {/*Business / Phone */}
                  <PhoneInput
                    register={register}
                    registerName="business.contact.phone"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  <WebsiteInput
                    register={register}
                    registerName="business.contact.website"
                    errors={errors}
                  />
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
            {typeOfUserWatch === "organization" && (
              <>
                <FormControlRow>
                  {/*Org / name */}
                  <FullNameInput
                    register={register}
                    registerName="organization.name"
                    name="Organization"
                    errors={errors}
                  />
                  {/*Org / address */}
                  <AddressInput
                    register={register}
                    setValue={setValue}
                    registerName="organization.contact.address"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  {/*Org / email */}
                  <EmailInput
                    register={register}
                    registerName="organization.contact.email"
                    errors={errors}
                  />
                  <PhoneInput
                    register={register}
                    registerName="organization.contact.phone"
                    errors={errors}
                  />
                </FormControlRow>
                <FormControlRow>
                  <WebsiteInput
                    register={register}
                    registerName="organization.contact.website"
                    errors={errors}
                  />
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
          </StyledFormContent>
          <StyledFormButtonContainer data-testid="form-button-container">
            <Button type="submit">Create</Button>
            <Button type="button" variation="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </StyledFormButtonContainer>
        </Form>
      </StyledFormContainer>
      {showSpinner && <OverlaySpinner message="Creating Flyer" />}
    </StyledAnonymousContainer>
  );
}
