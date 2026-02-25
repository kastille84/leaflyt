import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import ChangePlanContainer from "../../../src/features/authentication/ChangePlanContainer";
import { useGlobalContext } from "../../../src/context/GlobalContext";

vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

// Mock child components
vi.mock("../../../src/features/authentication/WhyUpgrade", () => ({
  default: () => <div data-testid="WhyUpgrade" />,
}));
vi.mock("../../../src/features/authentication/PickPlanForm", () => ({
  default: (props: any) => (
    <div data-testid="PickPlanForm">
      PickPlanForm
      <span data-testid="signedUpUser">
        {JSON.stringify(props.signedUpUser)}
      </span>
      <span data-testid="isUpgrade">{String(props.isUpgrade)}</span>
      <span data-testid="isAnyPaidPlan">{String(props.isAnyPaidPlan)}</span>
      <span data-testid="currentPlanId">{String(props.currentPlanId)}</span>
      <button onClick={props.setPickPlanInfo}>Set Pick Plan Info</button>
    </div>
  ),
}));
vi.mock("../../../src/features/authentication/PaymentFormContainer", () => ({
  default: (props: any) => (
    <div data-testid="PaymentFormContainer">
      PaymentFormContainer
      <span data-testid="signedUpUser">
        {JSON.stringify(props.signedUpUser)}
      </span>
      <span data-testid="pickPlanInfo">
        {JSON.stringify(props.pickPlanInfo.id)}
      </span>
    </div>
  ),
}));

describe("ChangePlanContainer", () => {
  const mockUser = {
    id: "user1",
    firstName: "Edwin",
    lastName: "Martinez",
    plan: { id: 1 },
    address: {
      formatted_address: "94 Rockwell Ave, Bloomfield, CT 06002, USA",
    },
    typeOfUser: "individual",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("always renders WhyUpgrade", () => {
    (useGlobalContext as any).mockReturnValue({ user: mockUser });
    render(<ChangePlanContainer />);
    expect(screen.getByTestId("WhyUpgrade")).toBeInTheDocument();
  });

  it("renders PickPlanForm if signedUpUser exists and pickPlanInfo is null", () => {
    (useGlobalContext as any).mockReturnValue({ user: mockUser });
    render(<ChangePlanContainer />);
    expect(screen.getByTestId("PickPlanForm")).toBeInTheDocument();
    expect(
      screen.queryByTestId("PaymentFormContainer"),
    ).not.toBeInTheDocument();
  });

  it("renders PaymentFormContainer if signedUpUser and pickPlanInfo exist", async () => {
    (useGlobalContext as any).mockReturnValue({ user: mockUser });
    const pickPlanInfo = {
      plan: "premium",
      firstName: "Edwin",
      lastName: "Martinez",
      address: {
        city: "Bloomfield",
        country: "USA",
        line1: "94 Rockwell Ave",
        postal_code: "06002",
        state: "CT",
      },
    };
    const setPlanInfo = vi.fn().mockImplementation(() => pickPlanInfo);
    vi.spyOn(React, "useState")
      .mockImplementationOnce(() => [mockUser, () => {}])
      .mockImplementationOnce(() => [pickPlanInfo, setPlanInfo]);
    render(<ChangePlanContainer />);
    await waitFor(() => {
      expect(screen.getByTestId("PickPlanForm")).toBeInTheDocument();
    });

    // get the setPickPlanInfo function and call it to simulate setting pickPlanInfo
    const setPickPlanInfoButton = screen.getByText("Set Pick Plan Info");
    act(() => setPickPlanInfoButton.click());
    await waitFor(() => {
      expect(screen.getByTestId("PaymentFormContainer")).toBeInTheDocument();
    });
  });

  it("does not render PickPlanForm or PaymentFormContainer if signedUpUser is null", () => {
    (useGlobalContext as any).mockReturnValue({ user: null });
    render(<ChangePlanContainer />);
    expect(screen.getByTestId("WhyUpgrade")).toBeInTheDocument();
    expect(screen.queryByTestId("PickPlanForm")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("PaymentFormContainer"),
    ).not.toBeInTheDocument();
  });

  it("passes correct props to PickPlanForm", () => {
    (useGlobalContext as any).mockReturnValue({ user: mockUser });
    render(<ChangePlanContainer isUpgrade={true} isAnyPaidPlan={true} />);
    expect(screen.getByTestId("isUpgrade").textContent).toBe("true");
    expect(screen.getByTestId("isAnyPaidPlan").textContent).toBe("true");
    expect(screen.getByTestId("currentPlanId").textContent).toBe("1");
    expect(screen.getByTestId("signedUpUser").textContent).toContain("Edwin");
  });
});
