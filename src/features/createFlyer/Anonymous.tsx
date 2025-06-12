import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";

import { useForm, SubmitHandler } from "react-hook-form";

import Heading from "../../ui/Heading";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import FormControlRow from "../../ui/Form/FormControlRow";
import FormControl from "../../ui/Form/FormControl";
import Form from "../../ui/Form/Form";
import AddressInput from "../../ui/Form/AddressInput";
import TitleInput from "../../ui/Form/TitleInput";
import CategoryInput from "../../ui/Form/CategoryInput";
import FirstNameInput from "../../ui/Form/FirstNameInput";

const StyledAnonymousContainer = styled.div``;
const StyledInfoAlertContainer = styled.div`
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

export default function Anonymous() {
  const [content, setContent] = useState<string>("");

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const typeOfUserWatch = watch("typeOfUser");
  const typeOfUser = getValues("typeOfUser");

  console.log("getValues", getValues());

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

  const onSubmit = (data: any) => console.log(data);

  return (
    <StyledAnonymousContainer>
      <StyledInfoAlertContainer>
        <Heading as={"h4"}>
          <span>
            <HiOutlineExclamationCircle />
          </span>
          <span>You are posting as an Unregistered User</span>
        </Heading>
        <p>Do more with your flyers by signing-in or registering</p>
        <p>
          Why is it better to be a registered user?{" "}
          <span className="learn-more">
            LEARN MORE
            <HiOutlineArrowRight />
          </span>
        </p>
      </StyledInfoAlertContainer>
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormContent>
            {/* Title / Category */}
            <FormControlRow>
              <TitleInput register={register} />
              <CategoryInput
                register={register}
                options={[{ label: "hey", value: "hey" }]}
              />
            </FormControlRow>
            {/* Description / Image*/}
            <FormControlRow>
              <FormControl>
                <label htmlFor="description">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                />
              </FormControl>
              <FormControl>
                <label htmlFor="image">Image</label>
                <Input type="file" id="image" />
              </FormControl>
            </FormControlRow>

            <FormControlRow>
              <FormControl className="typeOfUser">
                <label htmlFor="typeOfUser">How do you want to post as?</label>
                <small>
                  Unregistered users must provide info below everytime they
                  post. <br /> Registered users do not need to provide this
                  information.
                </small>

                <Select
                  options={[
                    { label: "Choose one", value: "" },
                    { label: "Anonymous", value: "anonymous" },
                    { label: "Individual", value: "individual" },
                    { label: "Business", value: "business" },
                    { label: "Organization", value: "organization" },
                  ]}
                  value={typeOfUser}
                  // onChange={() => {}}
                  {...register("typeOfUser", { required: true })}
                />
              </FormControl>
              <FormControl>{/* empty */}</FormControl>
            </FormControlRow>

            {typeOfUserWatch === "anonymous" && (
              <FormControlRow>
                <FormControl className="attestation-container">
                  <div className="attestation">
                    <Input
                      type="checkbox"
                      id="attestation"
                      checked
                      {...register("attestation", { required: true })}
                    />
                    <p>
                      Anonymous posting has a higher chance of getting flagged
                      due to their uncontrolled nature.
                      <br />
                      Leaflyt relies on the community to help flag inappropiate
                      content.
                      <br />
                      You agree to "Post Responsibly".
                    </p>
                  </div>
                </FormControl>
              </FormControlRow>
            )}
            {typeOfUserWatch === "individual" && (
              <>
                <FormControlRow>
                  {/* Personal Info / firstName */}
                  <FirstNameInput
                    register={register}
                    registerName="individual.name.firstName"
                  />
                  {/* Personal Info / lastName */}
                  <FormControl>
                    <label htmlFor="last-name">Last Name</label>
                    <Input
                      type="text"
                      id="last-name"
                      {...register("individual.name.lastName", {
                        required: true,
                      })}
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  {/* Personal Info / email */}
                  <FormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("individual.contact.email", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  {/* Personal Info / Phone */}
                  <FormControl>
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("individual.contact.phone", {
                        required: true,
                      })}
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  <FormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("individual.contact.website", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
            {typeOfUserWatch === "business" && (
              <>
                <FormControlRow>
                  {/*Business / name */}
                  <FormControl>
                    <label htmlFor="name">Business Name</label>
                    <Input
                      type="text"
                      id="name"
                      {...register("business.name", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    {/*Business / address */}
                    <AddressInput
                      register={register}
                      setValue={setValue}
                      registerName="business.contact.address"
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  {/*Business / email */}
                  <FormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("business.contact.email", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  {/*Business / Phone */}
                  <FormControl>
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("business.contact.phone", {
                        required: true,
                      })}
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  <FormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("business.contact.website", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
            {typeOfUserWatch === "organization" && (
              <>
                <FormControlRow>
                  {/*Org / name */}
                  <FormControl>
                    <label htmlFor="name">Organization Name</label>
                    <Input
                      type="text"
                      id="name"
                      {...register("organization.name", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    {/*Org / address */}
                    <AddressInput
                      register={register}
                      setValue={setValue}
                      registerName="organization.contact.address"
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  {/*Org / email */}
                  <FormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("organization.contact.email", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    {/*Org / Phone */}
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("organization.contact.phone", {
                        required: true,
                      })}
                    />
                  </FormControl>
                </FormControlRow>
                <FormControlRow>
                  <FormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("organization.contact.website", {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl>{/* empty */}</FormControl>
                </FormControlRow>
              </>
            )}
          </StyledFormContent>
          <StyledFormButtonContainer>
            <Button type="submit">Create</Button>
            <Button type="button" variation="secondary">
              Cancel
            </Button>
          </StyledFormButtonContainer>
        </Form>
      </StyledFormContainer>
    </StyledAnonymousContainer>
  );
}
