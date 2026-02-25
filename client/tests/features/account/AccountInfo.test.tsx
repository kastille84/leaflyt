import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountInfo from "../../../src/features/account/AccountInfo";
import { useGlobalContext } from "../../../src/context/GlobalContext";

// Mock Button component
vi.mock("../../../src/ui/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock useGlobalContext
const mockSetIsOpenBottomSlideIn = vi.fn();
const mockSetBottomSlideInType = vi.fn();
const mockSetShowDeleteAccountModal = vi.fn();

const individualUser = {
  typeOfUser: "individual",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123456789",
  address: { formatted_address: "123 Main St" },
  website: "https://john.com",
};

const businessUser = {
  typeOfUser: "business",
  name: "Acme Corp",
  email: "acme@example.com",
  phone: "987654321",
  address: { formatted_address: "456 Elm St" },
  website: "https://acme.com",
};

vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

describe("AccountInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders individual user info", () => {
    (useGlobalContext as any).mockReturnValue({
      user: individualUser,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("https://john.com")).toBeInTheDocument();
  });

  it("renders business user info", () => {
    (useGlobalContext as any).mockReturnValue({
      user: businessUser,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("acme@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("987654321")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("456 Elm St")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("https://acme.com")).toBeInTheDocument();
  });

  it("calls edit handlers when Edit button is clicked", () => {
    (useGlobalContext as any).mockReturnValue({
      user: individualUser,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);
    expect(mockSetIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(mockSetBottomSlideInType).toHaveBeenCalledWith("editAccountInfo");
  });

  it("calls delete handler when Delete Account button is clicked", () => {
    (useGlobalContext as any).mockReturnValue({
      user: individualUser,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    // const deleteBtn = screen.getByText("Delete Account");
    const deleteBtn = screen.getByRole("button", { name: "Delete Account" });
    fireEvent.click(deleteBtn);
    expect(mockSetShowDeleteAccountModal).toHaveBeenCalledWith(true);
  });

  it("shows warning text for delete account", () => {
    (useGlobalContext as any).mockReturnValue({
      user: individualUser,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    expect(screen.getByText(/Can't Be Undone/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You will lose all your data/i),
    ).toBeInTheDocument();
  });

  it("handles missing user gracefully", () => {
    (useGlobalContext as any).mockReturnValue({
      user: undefined,
      setIsOpenBottomSlideIn: mockSetIsOpenBottomSlideIn,
      setBottomSlideInType: mockSetBottomSlideInType,
      setShowDeleteAccountModal: mockSetShowDeleteAccountModal,
    });

    render(<AccountInfo />);
    expect(screen.queryByText("First Name")).not.toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
  });
});
