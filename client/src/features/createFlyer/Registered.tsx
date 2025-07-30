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
  const { user } = useGlobalContext();
  const planLimits = useGetUserLimits();

  const categoryWatch = watch("category");
  const subcategoryWatch = watch("subcategory");
  const fileUrlArrWatch = watch("fileUrlArr");

  const onSubmit = async (data: any) => {
    console.log(data);
  };

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
          </StyledFormContent>
        </Form>
      </StyledFormContainer>
    </StyledRegisteredContainer>
  );
}
