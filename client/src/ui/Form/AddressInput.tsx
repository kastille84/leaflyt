import { useState } from "react";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

import Input from "../Input";
import styled from "styled-components";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import { accessNestedProperty } from "../../utils/GeneralUtils";

const key = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

const StyledInputContainer = styled.div`
  position: relative;
  & input {
    width: 100%;
  }
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
export default function AddressInput({
  register,
  setValue,
  registerName,
  errors,
  locationAdvisory = false,
  shouldSaveAddressObj = false,
  disabled = false,
  cantUpdate = false,
  fieldName = "Address",
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  registerName: string;
  // error: { [key: string]: { message: string; type: string } };
  errors: FieldErrors<FieldValues>;
  locationAdvisory?: boolean;
  shouldSaveAddressObj?: boolean;
  disabled?: boolean;
  cantUpdate?: boolean;
  fieldName?: string;
}) {
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  if (shouldSaveAddressObj) {
    register("addressObjToSave", {
      required: true,
    });
  }
  // google autocomplete
  // https://www.npmjs.com/package/react-google-autocomplete
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    // isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: key,
    debounce: 800,
  });

  function getErrorValue(errors: FieldErrors<FieldValues>) {
    return accessNestedProperty(errors, registerName);
  }

  const errorObj = getErrorValue(errors);
  return (
    <FormControl testId="address-container">
      <StyledLabel htmlFor="address" className={`${errorObj && "error"}`}>
        {fieldName}
      </StyledLabel>
      <StyledInputContainer>
        <Input
          type="text"
          id="address"
          {...register(registerName, {
            required: {
              value: true,
              message: "Address is required",
            },
            onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
              setAddressSelected(false);
              getPlacePredictions({ input: evt.target.value });
            },
          })}
          hasError={Boolean(errorObj)}
          disabled={disabled}
        />
        {placePredictions.length > 0 && addressSelected === false && (
          <StyledAddressResultContainer data-testid="address-results">
            {placePredictions.map((placePrediction, idx) => (
              <StyledAddressResult
                data-testid={`address-result-${idx}`}
                key={placePrediction.place_id}
                onClick={() => {
                  if (shouldSaveAddressObj) {
                    placesService?.getDetails(
                      {
                        placeId: placePrediction.place_id,
                        fields: [
                          //https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
                          "name",
                          "adr_address",
                          "formatted_address",
                          "geometry.location",
                          "place_id",
                        ],
                      },
                      (placeDetails) => {
                        setValue(registerName, placeDetails?.formatted_address);
                        // also save full addr obj, needed for geo coords of new user
                        if (shouldSaveAddressObj)
                          setValue("addressObjToSave", placeDetails);
                      }
                    );
                  } else {
                    setValue(registerName, placePrediction.description);
                  }
                  setAddressSelected(true);
                }}
              >
                {placePrediction.description}
              </StyledAddressResult>
            ))}
          </StyledAddressResultContainer>
        )}
      </StyledInputContainer>
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
      {locationAdvisory && (
        <small>
          The address will be used as the center point to determine your
          community and the boards in your area
        </small>
      )}
      {cantUpdate && (
        <small>
          Address can't be updated because you are a member of a community.
          Please email our support team if you need to update your address. -
          <i>leaflitflyers@gmail.com</i>
        </small>
      )}
    </FormControl>
  );
}
