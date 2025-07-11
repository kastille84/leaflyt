import styled from "styled-components";
import Heading from "./Heading";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-blue-100);
  grid-column: 1/2;
  grid-row: 2/-1;
  border-right: 1px solid var(--color-blue-200);
  padding: 2.4rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.4rem;

  & h2 {
    font-size: 2.4rem;
    color: var(--color-brand-800);
    margin-left: 2.4rem;
  }
`;

export default function Sidebar() {
  return (
    <StyledSidebar>
      <Heading as="h2">Leaflyt</Heading>
      <MainNav />
    </StyledSidebar>
  );
}
