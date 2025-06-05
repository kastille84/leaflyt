import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";

import GlobalStyles from "./styles/GlobalStyles";
import Landing from "./pages/Landing";
import { GlobalContextProvider } from "./context/GlobalContext";
import Board from "./features/board/Board";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <div data-testid="app">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        <GlobalStyles />
        <GlobalContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="board/:id" element={<Board />} />
              </Route>

              <Route path="/" index element={<Landing />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </BrowserRouter>
        </GlobalContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
