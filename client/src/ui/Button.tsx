import styled, { css, RuleSet } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background-color: var(--color-grey-50);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-0);
      color: var(--color-grey-0);
    }
  `,
  "secondary-outlined": css`
    color: var(--color-grey-200);
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
      color: var(--color-grey-600);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);
    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  disabled: css`
    cursor: not-allowed;
    background-color: var(--color-grey-200);
    color: var(--color-grey-400);
  `,
};

const Button = styled.button<{
  size?: "small" | "medium" | "large";
  variation?:
    | "primary"
    | "secondary"
    | "secondary-outlined"
    | "danger"
    | "disabled";
}>`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  ${(props) => sizes[props.size || "medium"]}
  ${(props) => variations[props.variation || "primary"]}
`;

export default Button;
