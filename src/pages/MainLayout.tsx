import styled from "styled-components";
import { Outlet } from "react-router-dom";

import ActionMenu from "../ui/ActionMenu";
import Sidebar from "../ui/Sidebar";

const StyledMainLayout = styled.main`
  height: 100vh;
  display: grid;
  grid-template-columns: 25rem 1fr;
  grid-template-rows: auto 1fr;
  font-size: 1.8rem;
`;

const StyledMainContentContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 2.4rem;
  position: relative;
`;

export default function MainLayout() {
  return (
    <StyledMainLayout data-testid="main-layout">
      <ActionMenu></ActionMenu>
      <StyledMainContentContainer>
        <Outlet />
      </StyledMainContentContainer>
      <Sidebar></Sidebar>
    </StyledMainLayout>
  );
}
