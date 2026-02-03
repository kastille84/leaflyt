import { useEffect } from "react";
import styled from "styled-components";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";

import { supabase } from "../services/supabase";
import ActionMenu from "../ui/ActionMenu";
import ActionMenuMobile from "../ui/ActionMenuMobile";
import Sidebar from "../ui/Sidebar";
import CloseSlideInModal from "../ui/Modals/CloseSlideInModal";
import EditFlyerModal from "../ui/Modals/EditFlyerModal";

import useLoginWithAccessToken from "../features/authentication/useLoginWithAccessToken";
import { useGlobalContext } from "../context/GlobalContext";
import DeleteFlyerTemplateModal from "../ui/Modals/DeleteFlyerTemplateModal";
import DeleteFilesModal from "../ui/Modals/DeleteFilesModal";
import { useResponsiveWidth } from "../hooks/useResponsiveWidth";
import FlaggedModal from "../ui/Modals/FlaggedModal";

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
  @media (max-height: 59em) {
    height: 800px;
    overflow-y: auto;
  }
`;

const StyledMainContentContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 2.4rem 2.4rem 2.4rem 2.4rem;
  position: relative;
  overflow-y: auto;
`;

export default function MainLayout() {
  const responsiveVal = useResponsiveWidth();

  const {
    setUser,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
  } = useGlobalContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { autoLogin } = useLoginWithAccessToken();
  useEffect(() => {
    // don't auto login on password page
    if (location.pathname.includes("password")) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        autoLogin(session.access_token, {
          onSuccess: (response) => {
            console.log("response", response);
            // set user in global context
            setUser(response.data);
            // a purposefully thrown error (i.e. user hasn't paid)
            if (response.error) {
              throw new Error((response.error as any).message);
            }
            // check if url contains "flyer"
            if (!location.pathname.includes("fullFlyer")) {
              navigate(`/dashboard${id ? "/board/" + id : "/home"}`);
            }
          },
          onError: (error) => {
            console.log("error", error);
            if (error.message === "unpaid") {
              setShowLoginModal(false);
              setIsOpenBottomSlideIn(true);
              setBottomSlideInType("unpaid");
            }
          },
        });
      }
    });
  }, []);

  return (
    <StyledMainLayout data-testid="main-layout">
      {["s_tablet", "l_mobile", "s_mobile"].includes(responsiveVal) ? (
        <ActionMenuMobile></ActionMenuMobile>
      ) : (
        <ActionMenu></ActionMenu>
      )}

      <StyledMainContentContainer>
        <Outlet />
      </StyledMainContentContainer>
      <Sidebar></Sidebar>
      <CloseSlideInModal />
      <EditFlyerModal />
      <DeleteFlyerTemplateModal />
      <DeleteFilesModal />
      <FlaggedModal />
    </StyledMainLayout>
  );
}
