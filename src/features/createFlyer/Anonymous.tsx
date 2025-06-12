import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useForm, SubmitHandler } from "react-hook-form";

import Heading from "../../ui/Heading";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

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

const StyledForm = styled.form`
  position: relative;
  & h4 {
    color: var(--color-brand-600);
  }
`;

const StyledFormContent = styled.div`
  margin-bottom: 4.8rem;
`;

const StyledFormControlRow = styled.div`
  display: flex;
  gap: 2.4rem;

  & label {
    font-weight: 600;
    color: var(--color-brand-600);
  }

  & .ql-toolbar,
  & .ql-container {
    border: 1px solid var(--color-brand-500);
  }
  & .ql-container {
    min-height: 150px;
    height: auto;
  }
  & .ql-editor {
    font-size: 1.6rem;
    color: var(--color-grey-600);
  }
`;

const StyledFormControl = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.4rem;
  flex: 1;

  & small {
    color: var(--color-orange-600);
    letter-spacing: 0.4px;
  }
  & .attestation {
    display: flex;
    align-items: center;
    gap: 2.4rem;
  }
  & input[type="checkbox"] {
    width: 1.8rem;
    height: 1.8rem;
    accent-color: var(--color-brand-500);
  }
`;

const StyledFormButtonContainer = styled.div`
  /* position: fixed;
  bottom: 2.4rem;
  right: 2.4rem; */
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledAddressResultContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-brand-100);
  box-shadow: var(--shadow-lg);
  border-radius: 0 0 4px 4px;
  overflow: hidden;
  list-style: none;
`;

const StyledAddressResult = styled.li`
  padding: 1.6rem;

  &:hover {
    background-color: var(--color-grey-100);
    cursor: pointer;
  }
`;

const key = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
export default function Anonymous() {
  const [content, setContent] = useState<string>("");
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  // google autocomplete
  // https://www.npmjs.com/package/react-google-autocomplete
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: key,
    debounce: 800,
  });

  const typeOfUserWatch = watch("typeOfUser");
  const typeOfUser = getValues("typeOfUser");
  console.log("placePredictions", placePredictions);
  console.log("isPlacePredictionsLoading", isPlacePredictionsLoading);
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
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <StyledFormContent>
            <StyledFormControlRow>
              {/* Title */}
              <StyledFormControl className="title">
                <label htmlFor="title">Title</label>
                <Input
                  type="text"
                  id="title"
                  {...register("title", { required: true })}
                />
              </StyledFormControl>
              {/* Category */}
              <StyledFormControl className="category">
                <label htmlFor="category">Category</label>
                <Select
                  options={[{ label: "hey", value: "hey" }]}
                  value=""
                  // onChange={() => {}}
                  {...register("category", { required: true })}
                />
              </StyledFormControl>
            </StyledFormControlRow>

            <StyledFormControlRow>
              {/* Description */}
              <StyledFormControl>
                <label htmlFor="description">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                />
              </StyledFormControl>
              {/* Image */}
              <StyledFormControl>
                <label htmlFor="image">Image</label>
                <Input type="file" id="image" />
              </StyledFormControl>
            </StyledFormControlRow>

            <StyledFormControlRow>
              <StyledFormControl className="typeOfUser">
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
              </StyledFormControl>
              <StyledFormControl></StyledFormControl>
            </StyledFormControlRow>

            {typeOfUserWatch === "anonymous" && (
              <StyledFormControlRow>
                <StyledFormControl className="attestation-container">
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
                </StyledFormControl>
              </StyledFormControlRow>
            )}
            {typeOfUserWatch === "individual" && (
              <>
                <StyledFormControlRow>
                  {/* Personal Info / firstName */}
                  <StyledFormControl>
                    <label htmlFor="first-name">First Name</label>
                    <Input
                      type="text"
                      id="first-name"
                      {...register("individual.name.firstName", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  {/* Personal Info / lastName */}
                  <StyledFormControl>
                    <label htmlFor="last-name">Last Name</label>
                    <Input
                      type="text"
                      id="last-name"
                      {...register("individual.name.lastName", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
                <StyledFormControlRow>
                  {/* Personal Info / email */}
                  <StyledFormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("individual.contact.email", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  {/* Personal Info / Phone */}
                  <StyledFormControl>
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("individual.contact.phone", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
                <StyledFormControlRow>
                  <StyledFormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("individual.contact.website", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  <StyledFormControl>{/* empty */}</StyledFormControl>
                </StyledFormControlRow>
              </>
            )}
            {typeOfUserWatch === "business" && (
              <>
                <StyledFormControlRow>
                  {/*Business / name */}
                  <StyledFormControl>
                    <label htmlFor="name">Business Name</label>
                    <Input
                      type="text"
                      id="name"
                      {...register("business.name", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  {/*Business / address */}
                  <StyledFormControl>
                    <label htmlFor="address">Address</label>
                    <Input
                      type="text"
                      id="address"
                      {...register("business.contact.address", {
                        required: true,
                        onChange: (evt) => {
                          setAddressSelected(false);
                          getPlacePredictions({ input: evt.target.value });
                        },
                      })}
                    />
                    {placePredictions.length > 0 &&
                      addressSelected === false && (
                        <StyledAddressResultContainer>
                          {placePredictions.map((placePrediction) => (
                            <StyledAddressResult
                              key={placePrediction.place_id}
                              onClick={() => {
                                setValue(
                                  "business.contact.address",
                                  placePrediction.description
                                );
                                setAddressSelected(true);
                              }}
                            >
                              {placePrediction.description}
                            </StyledAddressResult>
                          ))}
                        </StyledAddressResultContainer>
                      )}
                  </StyledFormControl>
                </StyledFormControlRow>
                <StyledFormControlRow>
                  {/*Business / email */}
                  <StyledFormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("business.contact.email", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  {/*Business / Phone */}
                  <StyledFormControl>
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("business.contact.phone", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
                <StyledFormControlRow>
                  <StyledFormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("business.contact.website", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
              </>
            )}
            {typeOfUserWatch === "organization" && (
              <>
                <StyledFormControlRow>
                  {/*Org / name */}
                  <StyledFormControl>
                    <label htmlFor="name">Organization Name</label>
                    <Input
                      type="text"
                      id="name"
                      {...register("organization.name", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  {/*Org / Phone */}
                  <StyledFormControl>
                    <label htmlFor="phone">Phone</label>
                    <Input
                      type="tel"
                      id="phone"
                      {...register("organization.contact.phone", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
                <StyledFormControlRow>
                  {/*Org / email */}
                  <StyledFormControl>
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      id="email"
                      {...register("organization.contact.email", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                  <StyledFormControl>
                    <label htmlFor="website">Website</label>
                    <Input
                      type="url"
                      id="website"
                      {...register("organization.contact.website", {
                        required: true,
                      })}
                    />
                  </StyledFormControl>
                </StyledFormControlRow>
              </>
            )}
          </StyledFormContent>
          <StyledFormButtonContainer>
            <Button type="submit">Create</Button>
            <Button type="button" variation="secondary">
              Cancel
            </Button>
          </StyledFormButtonContainer>
        </StyledForm>
      </StyledFormContainer>
    </StyledAnonymousContainer>
  );
}
