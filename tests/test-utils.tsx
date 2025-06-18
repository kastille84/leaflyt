// test-utils.jsx (or similar)
import React from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryClientProviderWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Important for reliable testing of error states
      },
    },
  });
  return ({ children: children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

export { renderHook, QueryClientProviderWrapper };
