import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import GlobalStyles from "./styles/GlobalStyles";
import { GlobalContextProvider } from "./context/GlobalContext";
import { StripeProvider } from "./context/StripeContext";

// pages
import Landing from "./pages/Landing";
import Board from "./features/board/Board";
import MainLayout from "./pages/MainLayout";
import FlyerSlideIn from "./ui/Flyer/FlyerSlideIn";
import LoginModal from "./features/authentication/LoginModal";
import SlideInBottom from "./ui/SlideIn/SlideInBottom";
import MyArea from "./pages/MyArea";
import MyTemplates from "./pages/MyTemplates";
import SavedFlyers from "./pages/SavedFlyers";
import Home from "./pages/Home";
import MyAssets from "./pages/MyAssets";
import Statistics from "./pages/Statistics";
import MyAccount from "./pages/MyAccount";
import ForgotPassword from "./features/authentication/ForgotPassword";
import ResetPassword from "./features/authentication/ResetPassword";
import TermsModal from "./ui/Modals/TermsModal";
import PlansModal from "./ui/Modals/PlansModal";
import CancelSubscriptionModal from "./ui/Modals/CancelSubscriptionModal";
import DeleteAccountModal from "./ui/Modals/DeleteAccountModal";
import { keysBasedOnEnv } from "./utils/GeneralUtils";
import SingleFlyer from "./features/single_flyer/SingleFlyer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
      gcTime: 0,
    },
  },
});

function App() {
  return (
    <div data-testid="app">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        ></ReactQueryDevtools>
        <GlobalStyles />
        <GlobalContextProvider>
          <StripeProvider
            publishableKey={keysBasedOnEnv().stripe.publishableKey}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/dashboard/" element={<MainLayout />}>
                  <Route path="home" element={<Home />} />
                  <Route path="flyer/:id" element={<SingleFlyer />} />
                  <Route path="board/:id" element={<Board />} />
                  <Route path="my-area" element={<MyArea />} />
                  <Route path="templates" element={<MyTemplates />} />
                  <Route path="saved-flyers" element={<SavedFlyers />} />
                  <Route path="assets" element={<MyAssets />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="account" element={<MyAccount />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="update-password" element={<ResetPassword />} />
                </Route>

                <Route path="/" index element={<Landing />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
              <LoginModal />
              <TermsModal />
              <PlansModal />
              <CancelSubscriptionModal />
              <DeleteAccountModal />
              <FlyerSlideIn />
              <SlideInBottom />
            </BrowserRouter>
            <Toaster
              position="top-center"
              gutter={12}
              containerStyle={{ margin: "8px" }}
              toastOptions={{
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 6000,
                },
                style: {
                  fontSize: "16px",
                  maxWidth: "500px",
                  padding: "16px 24px",
                  backgroundColor: "var(--color-grey-50)",
                  color: "var(--color-grey-700)",
                  opacity: 0,
                },
                ariaProps: {
                  role: "alert",
                  "aria-live": "polite",
                },
              }}
            />
          </StripeProvider>
        </GlobalContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
