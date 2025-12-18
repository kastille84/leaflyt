import { useEffect } from "react";
import styled from "styled-components";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { supabase } from "../services/supabase";
import ActionMenu from "../ui/ActionMenu";
import Sidebar from "../ui/Sidebar";
import CloseSlideInModal from "../ui/Modals/CloseSlideInModal";
import EditFlyerModal from "../ui/Modals/EditFlyerModal";

import useLoginWithAccessToken from "../features/authentication/useLoginWithAccessToken";
import { useGlobalContext } from "../context/GlobalContext";
import DeleteFlyerTemplateModal from "../ui/Modals/DeleteFlyerTemplateModal";
import DeleteFilesModal from "../ui/Modals/DeleteFilesModal";

const StyledMainLayout = styled.main`
  height: 100vh;
  display: grid;
  grid-template-columns: 25rem 1fr;
  grid-template-rows: auto 1fr;
  font-size: 1.8rem;
  position: relative;

  @media (max-width: 59em) {
    grid-template-columns: 1fr;
  }
`;

const StyledMainContentContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 4.8rem 2.4rem 2.4rem 2.4rem;
  position: relative;
  overflow-y: auto;
`;

export default function MainLayout() {
  const { setUser } = useGlobalContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const { autoLogin } = useLoginWithAccessToken();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        autoLogin(session.access_token, {
          onSuccess: (response) => {
            console.log("response", response);
            // set user in global context
            setUser(response.data);
            navigate(`/dashboard${id ? "/board/" + id : "/home"}`);
          },
          onError: (error) => {
            console.log("error", error);
          },
        });
      }
    });
  }, []);

  return (
    <StyledMainLayout data-testid="main-layout">
      <ActionMenu></ActionMenu>
      <StyledMainContentContainer>
        <Outlet />
      </StyledMainContentContainer>
      <Sidebar></Sidebar>
      <CloseSlideInModal />
      <EditFlyerModal />
      <DeleteFlyerTemplateModal />
      <DeleteFilesModal />
    </StyledMainLayout>
  );
}
