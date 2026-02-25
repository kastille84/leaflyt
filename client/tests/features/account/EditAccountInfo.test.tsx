import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditAccountInfo from "../../../src/features/account/EditAccountInfo";
import { useGlobalContext } from "../../../src/context/GlobalContext";

// Mock child components to avoid deep rendering
vi.mock("../../../src/ui/Form/FirstNameInput", () => ({
  default: () => <div data-testid="FirstNameInput" />,
}));
vi.mock("../../../src/ui/Form/LastNameInput", () => ({
  default: () => <div data-testid="LastNameInput" />,
}));
vi.mock("../../../src/ui/Form/PhoneInput", () => ({
  default: () => <div data-testid="PhoneInput" />,
}));
vi.mock("../../../src/ui/Form/AddressInput", () => ({
  default: () => <div data-testid="AddressInput" />,
}));
vi.mock("../../../src/ui/Form/WebsiteInput", () => ({
  default: () => <div data-testid="WebsiteInput" />,
}));
vi.mock("../../../src/ui/Form/FullNameInput", () => ({
  default: () => <div data-testid="FullNameInput" />,
}));
vi.mock("../../../src/ui/OverlaySpinner", () => ({
  default: ({ message }: any) => (
    <div data-testid="OverlaySpinner">{message}</div>
  ),
}));
vi.mock("../../../src/ui/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock("../../../src/ui/Form/FormControlRow", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("../../../src/ui/Form/FormControl", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("../../../src/ui/Heading", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock useAccount
const mockUpdateProfile = vi.fn();
vi.mock("../../../src/features/account/useAccount", () => ({
  default: () => ({
    updateProfile: mockUpdateProfile,
  }),
}));

vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

// Mock useGetUserLimits
const mockPlanLimits = { maxProjects: 5, maxMembers: 10 };
vi.mock("../../../src/hooks/useGetUserLimits", () => ({
  default: () => mockPlanLimits,
}));

describe("EditAccountInfo", () => {
  const mockSetUser = vi.fn();
  const mockSetBottomSlideInType = vi.fn();
  const mockSetIsOpenBottomSlideIn = vi.fn();

  const userIndividual = {
    typeOfUser: "individual",
    firstName: "John",
    lastName: "Doe",
    phone: "123456789",
    address: { formatted_address: "123 Main St" },
    website: "https://john.com",
    id: "user1",
  };
  const userBusiness = {
    typeOfUser: "business",
    name: "Acme Corp",
    phone: "987654321",
    address: { formatted_address: "456 Elm St" },
    website: "https://acme.com",
    id: "user2",
  };
  const userOrganization = {
    typeOfUser: "organization",
    name: "Org Name",
    phone: "555555555",
    address: { formatted_address: "789 Oak Ave" },
    website: "https://org.com",
    id: "user3",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders individual form fields", () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    render(<EditAccountInfo />);
    expect(screen.getByTestId("FirstNameInput")).toBeInTheDocument();
    expect(screen.getByTestId("LastNameInput")).toBeInTheDocument();
    expect(screen.getByTestId("PhoneInput")).toBeInTheDocument();
    expect(screen.getByTestId("AddressInput")).toBeInTheDocument();
    expect(screen.getByTestId("WebsiteInput")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders business form fields", () => {
    (useGlobalContext as any).mockReturnValue({
      user: userBusiness,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    render(<EditAccountInfo />);
    expect(screen.getByTestId("FullNameInput")).toBeInTheDocument();
    expect(screen.getByTestId("AddressInput")).toBeInTheDocument();
    expect(screen.getByTestId("PhoneInput")).toBeInTheDocument();
    expect(screen.getByTestId("WebsiteInput")).toBeInTheDocument();
  });

  it("renders organization form fields", () => {
    (useGlobalContext as any).mockReturnValue({
      user: userOrganization,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    render(<EditAccountInfo />);
    expect(screen.getByTestId("FullNameInput")).toBeInTheDocument();
    expect(screen.getByTestId("AddressInput")).toBeInTheDocument();
    expect(screen.getByTestId("PhoneInput")).toBeInTheDocument();
    expect(screen.getByTestId("WebsiteInput")).toBeInTheDocument();
  });

  it("shows spinner when showSpinner is true", async () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    mockUpdateProfile.mockImplementation(() => new Promise(() => {}));
    render(<EditAccountInfo />);
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(screen.getByTestId("OverlaySpinner")).toBeInTheDocument();
    });
  });

  it("calls handleCancel when Cancel button is clicked", () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    render(<EditAccountInfo />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetBottomSlideInType).toHaveBeenCalledWith(null);
    expect(mockSetIsOpenBottomSlideIn).toHaveBeenCalledWith(false);
  });

  it("shows submit error if updateProfile throws", async () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    mockUpdateProfile.mockRejectedValueOnce(new Error("Failed to update"));
    render(<EditAccountInfo />);
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to update/)).toBeInTheDocument();
    });
  });

  it("shows submit error if updateProfile calls onError", async () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    mockUpdateProfile.mockImplementation((_payload, { onError }) => {
      onError({ message: "onError failed" });
      return Promise.resolve();
    });
    render(<EditAccountInfo />);
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(screen.getByText(/Error: onError failed/)).toBeInTheDocument();
    });
  });

  it("calls setUser and closes slide-in on successful update", async () => {
    (useGlobalContext as any).mockReturnValue({
      user: userIndividual,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    mockUpdateProfile.mockImplementation((_payload, { onSuccess }) => {
      onSuccess({ user: { ...userIndividual, firstName: "Jane" } });
      return Promise.resolve();
    });
    render(<EditAccountInfo />);
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Jane" }),
      );
      expect(mockSetBottomSlideInType).toHaveBeenCalledWith(null);
      expect(mockSetIsOpenBottomSlideIn).toHaveBeenCalledWith(false);
    });
  });

  it("renders nothing if user is undefined", () => {
    (useGlobalContext as any).mockReturnValue({
      user: undefined,
      setUser: mockSetUser,
      setBottomSlideInType: mockSetBottomSlideInType,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
    });
    render(<EditAccountInfo />);
    expect(screen.getByText("Edit Account Info")).toBeInTheDocument();
    // No form fields rendered
    expect(screen.queryByTestId("FirstNameInput")).not.toBeInTheDocument();
    expect(screen.queryByTestId("FullNameInput")).not.toBeInTheDocument();
  });
});
