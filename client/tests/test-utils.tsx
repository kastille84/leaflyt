// test-utils.jsx (or similar)
import React from "react";
import { renderHook, screen } from "@testing-library/react";
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

// FORM
function getInput(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
  };
}
function getSelect(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    select: Container.querySelector("select") as HTMLSelectElement,
  };
}

function getFieldError(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    error: Container.querySelector(
      "[data-testid='field-error']"
    ) as HTMLDivElement,
  };
}

function getActionButtons() {
  const Container = screen.getByTestId("form-button-container");
  return {
    container: Container,
    submit: Container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement,
    cancel: Container.querySelector(
      'button[type="button"]'
    ) as HTMLButtonElement,
  };
}
function getQuill() {
  const Container = screen.getByTestId("content-container");
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    quill: Container.querySelector(".ql-editor") as HTMLDivElement,
  };
}

function getFileUpload(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
    button: Container.querySelector("button") as HTMLButtonElement,
  };
}

function getImagePreview() {
  return {
    imagePreview: screen.getByTestId("image-preview"),
  };
}
function getImagePreviewItem(idx: number) {
  const imagePreviewItem = screen.getByTestId(`image-preview-item-${idx}`);
  return {
    imagePreviewItem,
    deleteButton: imagePreviewItem.querySelector("[data-testid='delete']"),
  };
}

function getAddressResults() {
  const AddressResultContainer = screen.getByTestId("address-results");
  return {
    container: AddressResultContainer,
    getItem(idx: number) {
      return AddressResultContainer.querySelector(
        `[data-testid='address-result-${idx}']`
      );
    },
  };
}

export {
  renderHook,
  QueryClientProviderWrapper,
  getInput,
  getSelect,
  getFieldError,
  getActionButtons,
  getQuill,
  getFileUpload,
  getImagePreview,
  getImagePreviewItem,
  getAddressResults,
};
