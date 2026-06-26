import {
  UseFormGetValues,
  UseFormRegister,
  // UseFormSetValues,
} from "react-hook-form";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

type option = {
  value: "offer" | "ask" | "none";
  label: string;
};

const StyledRadioGroupContainer = styled.div`
  margin-bottom: 2.4rem;
`;

const StyledRadioContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
`;

const StyledRadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-brand-600);

  &:checked {
    accent-color: var(--color-brand-700);
  }

  &:hover {
    accent-color: var(--color-brand-700);
  }
`;

export default function RadioGroupInput({
  groupLabel,
  register,
  // getValues,
  // setValue,
  registerName,
  options,
}: {
  groupLabel: string;
  register: UseFormRegister<any>;
  // getValues: UseFormGetValues<any>;
  // setValue: UseFormSetValues<any>;
  registerName: string;
  options: option[];
}) {
  return (
    <StyledRadioGroupContainer>
      <StyledLabel htmlFor={registerName}>{groupLabel}</StyledLabel>
      {options.map((option: option, key: number) => (
        <StyledRadioContainer key={key}>
          <StyledRadioInput
            type="radio"
            id={registerName + key}
            value={option.value}
            {...register(registerName)}
          />
          <label htmlFor={registerName + key}>{option.label}</label>
        </StyledRadioContainer>
      ))}
    </StyledRadioGroupContainer>
  );
}
