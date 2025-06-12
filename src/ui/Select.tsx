import { SelectHTMLAttributes } from "react";
import styled from "styled-components";

const StyledSelect = styled.select<SelectProps>`
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-brand-500)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);

  box-shadow: var(--shadow-sm);
`;

type Option = {
  value: string;
  label: string;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  type?: "white" | "default";
  options?: Option[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  // children: React.ReactNode;
}

function Select({ options, value, onChange, ...props }: SelectProps) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
