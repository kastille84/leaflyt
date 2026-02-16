import styled from "styled-components";
import Heading from "../../../ui/Heading";
import { useForm } from "react-hook-form";
import Form from "../../../ui/Form/Form";
import FormControlRow from "../../../ui/Form/FormControlRow";
import FormControl from "../../../ui/Form/FormControl";
import SelectInput from "../../../ui/Form/SelectInput";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import ColorInput from "../../../ui/Form/ColorInput";
import { useEffect, useState } from "react";
import BorderRadiusInput from "../../../ui/Form/BorderRadiusInput";
import Button from "../../../ui/Button";
import { useGlobalContext } from "../../../context/GlobalContext";
import { REGISTERED_FLYER_DESIGN_DEFAULT } from "../../../constants";
import toast from "react-hot-toast";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

const StyledConfigurationContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2.4rem;
  background-color: var(--color-blue-100);
  display: flex;
  flex-direction: column;

  @media (max-width: 59em) {
    width: 500px;
  }
  @media (max-width: 44em) {
    width: 300px;
  }

  /* 
  position: relative;

  @media (max-width: 59em) {
    position: absolute;
    top: 0;
    right: -300px;
    z-index: 1000;
    width: 300px;
    height: 100%;
    transition: right 0.5s ease-in-out;

    &.open {
      right: 0;
    }
  } */
`;
const StyledFormButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

// const SlideOpener = styled.div`
//   position: absolute;
//   top: 25px;
//   left: -68px;
//   /* font-size: 1.2rem; */
//   /* opacity: 0.8; */
//   font-weight: 600;
//   letter-spacing: 1px;
//   color: var(--color-grey-700);
//   background-color: var(--color-orange-400);
//   padding: 0.8rem 1.6rem;
//   cursor: pointer;
//   display: none;

//   @media (max-width: 59em) {
//     display: flex;
//     align-items: center;
//     gap: 0.8rem;
//     border-radius: var(--border-radius-sm);
//     left: -35px;
//   }

//   @media (max-width: 34em) {
//     left: -25px;
//   }
// `;
export default function Configuration() {
  // const [isOpen, setIsOpen] = useState(false);

  const { setBottomSlideInType, setIsOpenBottomSlideIn, currentFormOptions } =
    useGlobalContext();
  const { selectedSection, selectedFlyer, setSelectedFlyer } =
    useFlyerDesignerContext();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...selectedFlyer.flyerDesign,
    },
  });
  // watchers
  const formValuesWatch = watch();
  const fontWatch = watch("font");

  useEffect(() => {
    setSelectedFlyer({ ...selectedFlyer, flyerDesign: getValues() });
  }, [formValuesWatch, getValues, setSelectedFlyer, selectedFlyer]);

  function handleReset() {
    reset(REGISTERED_FLYER_DESIGN_DEFAULT);
  }

  function onSubmit(data: any) {
    currentFormOptions.setValue("flyerDesign", getValues());
    toast.success("Flyer design updated!");
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
  }

  return (
    <StyledConfigurationContainer
      data-testid="configuration-container"
      // className={isOpen ? "open" : ""}
    >
      {/* <SlideOpener onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <HiOutlineChevronDoubleRight />
        ) : (
          <HiOutlineChevronDoubleLeft />
        )}
      </SlideOpener> */}
      <Heading as="h2">Controls</Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormControlRow>
          <SelectInput
            register={register}
            registerName="font"
            options={[
              { value: '"Noto Serif", serif', label: "Serif" },
              { value: '"DM Sans", sans-serif', label: "Sans Serif" },
            ]}
            value={fontWatch}
            errors={errors}
          />
        </FormControlRow>
        <FormControlRow>
          <FormControl>
            <ColorInput
              register={register}
              getValues={getValues}
              setValue={setValue}
              selectedSection={selectedSection}
            />
          </FormControl>
        </FormControlRow>
        <FormControlRow>
          <BorderRadiusInput register={register} getValues={getValues} />
        </FormControlRow>
        <StyledFormButtonContainer data-testid="form-button-container">
          <Button type="submit">All Done With Design</Button>
          <Button type="button" variation="secondary" onClick={handleReset}>
            Reset
          </Button>
        </StyledFormButtonContainer>
      </Form>
    </StyledConfigurationContainer>
  );
}
