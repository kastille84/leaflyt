import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import AddressInput from "../../../src/ui/Form/AddressInput";
import FormHarness from "./FormHarness";
import { getAddressResults, getFieldError, getInput } from "../../test-utils";
import { placePredictionsArr } from "../../fixtures/googlePlaces";

vi.mock("react-google-autocomplete/lib/usePlacesAutocompleteService");

const getPlacePredictions = vi.fn();
const getDetails = vi.fn();

function mockPlaces(
  overrides: Partial<{
    placePredictions: any[];
    isPlacePredictionsLoading: boolean;
  }> = {},
) {
  vi.mocked(usePlacesService).mockImplementation(
    () =>
      ({
        placesService: { getDetails },
        placePredictions: placePredictionsArr,
        isPlacePredictionsLoading: false,
        getPlacePredictions,
        ...overrides,
      }) as any,
  );
}

function renderAddress(
  props: Partial<React.ComponentProps<typeof AddressInput>> = {},
  onSubmit = vi.fn(),
) {
  return render(
    <FormHarness onSubmit={onSubmit}>
      {({ register, setValue, formState: { errors } }) => (
        <AddressInput
          register={register}
          setValue={setValue}
          registerName="address"
          errors={errors}
          {...props}
        />
      )}
    </FormHarness>,
  );
}

describe("AddressInput", () => {
  beforeEach(() => mockPlaces());
  afterEach(() => vi.clearAllMocks());

  it("should render the default label, an enabled input and no advisories", () => {
    mockPlaces({ placePredictions: [] });
    renderAddress();
    const { label, input } = getInput("address");
    expect(label).toHaveTextContent("Address");
    expect(input).toBeEnabled();
    expect(screen.queryByText(/center point/)).toBeNull();
    expect(screen.queryByText(/can't be updated/)).toBeNull();
  });

  it("should use a custom field name, disable the input and show both notes", () => {
    mockPlaces({ placePredictions: [] });
    renderAddress({
      fieldName: "Home address",
      disabled: true,
      locationAdvisory: true,
      cantUpdate: true,
    });
    const { label, input } = getInput("address");
    expect(label).toHaveTextContent("Home address");
    expect(input).toBeDisabled();
    expect(screen.getByText(/center point/)).toBeInTheDocument();
    expect(screen.getByText(/can't be updated/)).toBeInTheDocument();
  });

  it("should request predictions as the user types", async () => {
    mockPlaces({ placePredictions: [] });
    renderAddress();
    await userEvent.setup().type(getInput("address").input, "75");
    expect(getPlacePredictions).toHaveBeenLastCalledWith({ input: "75" });
  });

  it("should show a spinner while predictions load", () => {
    mockPlaces({ placePredictions: [], isPlacePredictionsLoading: true });
    renderAddress();
    expect(screen.queryByTestId("address-results")).toBeNull();
    expect(document.querySelector("ul")).toBeInTheDocument();
  });

  it("should fill the input with the clicked prediction and hide the list", async () => {
    const onSubmit = vi.fn();
    renderAddress({}, onSubmit);
    const user = userEvent.setup();
    await user.click(getAddressResults().getItem(0)!);
    expect(getInput("address").input).toHaveValue(
      placePredictionsArr[0].description,
    );
    expect(screen.queryByTestId("address-results")).toBeNull();
    expect(getDetails).not.toHaveBeenCalled();
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({
      address: placePredictionsArr[0].description,
    });
  });

  it("should select the first prediction when Tab is pressed", async () => {
    renderAddress();
    await userEvent.setup().keyboard("{Tab}");
    await waitFor(() =>
      expect(getInput("address").input).toHaveValue(
        placePredictionsArr[0].description,
      ),
    );
  });

  it("should fetch place details and store the address object when asked to", async () => {
    const onSubmit = vi.fn();
    renderAddress({ shouldSaveAddressObj: true }, onSubmit);
    const user = userEvent.setup();
    await user.click(getAddressResults().getItem(0)!);
    expect(getDetails).toHaveBeenCalledTimes(1);
    expect(getDetails.mock.calls[0][0].placeId).toBe(
      placePredictionsArr[0].place_id,
    );
    const details = {
      formatted_address: "754 Broadway, Newburgh, NY 12550, USA",
    };
    await act(async () => {
      getDetails.mock.calls[0][1](details);
    });
    expect(getInput("address").input).toHaveValue(details.formatted_address);
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({
      address: details.formatted_address,
      addressObjToSave: details,
    });
  });

  it("should show a required error when submitted empty", async () => {
    mockPlaces({ placePredictions: [] });
    renderAddress();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(await screen.findByText("Address is required")).toBeInTheDocument();
    expect(getInput("address").label).toHaveClass("error");
    expect(getFieldError("address").error).toBeInTheDocument();
  });
});
