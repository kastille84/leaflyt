import styled from "styled-components";

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
  & .tag-input {
    border: 1px solid var(--color-brand-500);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-sm);
    align-items: center;
    font-family: "DM Sans", sans-serif;
    /* pill container */
    & > span {
      background-color: var(--color-brand-600);
      padding: 0.2rem 1.6rem;
      & span {
        color: var(--color-brand-50);
        font-weight: 400;
        font-size: 1.4rem;
      }
      & button {
        color: var(--color-brand-50);
        display: inline;
      }
      & button:hover {
        background-color: var(--color-brand-600);
        color: var(--color-red-600);
      }
    }
    & > span[class*="reactTagsInput-module_placeholder"] {
      border-radius: var(--border-radius-sm);
      color: var(--color-brand-50);
      font-size: 1.4rem;
    }
  }
`;

export default function FormControl({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <StyledFormControl className={className}>{children}</StyledFormControl>
  );
}
