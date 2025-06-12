import { useState } from "react";

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

import Input from "../Input";
import styled from "styled-components";

const key = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

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
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  registerName: string;
}) {
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  // google autocomplete
  // https://www.npmjs.com/package/react-google-autocomplete
  const {
    // placesService,
    placePredictions,
    getPlacePredictions,
    // isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: key,
    debounce: 800,
  });

  return (
    <>
      <label htmlFor="address">Address</label>
      <Input
        type="text"
        id="address"
        {...register(registerName, {
          required: true,
          onChange: (evt) => {
            setAddressSelected(false);
            getPlacePredictions({ input: evt.target.value });
          },
        })}
      />
      {placePredictions.length > 0 && addressSelected === false && (
        <StyledAddressResultContainer>
          {placePredictions.map((placePrediction) => (
            <StyledAddressResult
              key={placePrediction.place_id}
              onClick={() => {
                setValue(registerName, placePrediction.description);
                setAddressSelected(true);
              }}
            >
              {placePrediction.description}
            </StyledAddressResult>
          ))}
        </StyledAddressResultContainer>
      )}
    </>
  );
}
