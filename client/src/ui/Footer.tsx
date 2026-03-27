import styled from "styled-components";
const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  padding: 2.4rem;
  background-color: var(--color-brand-800);
  color: #fff;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <p>
        Contact us at{" "}
        <a
          href="mailto:support@Leaflit.us"
          style={{ textDecoration: "underline" }}
        >
          support@Leaflit.us
        </a>
      </p>
      <p>
        Copyright © {new Date().getFullYear()} Leaflit. All rights reserved.
      </p>
    </StyledFooter>
  );
}
