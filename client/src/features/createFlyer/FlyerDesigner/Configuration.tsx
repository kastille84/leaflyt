import styled from "styled-components";
import Heading from "../../../ui/Heading";
import { useForm } from "react-hook-form";
import Form from "../../../ui/Form/Form";
import FormControlRow from "../../../ui/Form/FormControlRow";
import FormControl from "../../../ui/Form/FormControl";
import SelectInput from "../../../ui/Form/SelectInput";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import ColorInput from "../../../ui/Form/ColorInput";
import { useEffect } from "react";
import BorderRadiusInput from "../../../ui/Form/BorderRadiusInput";

const StyledConfigurationContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2.4rem;
  background-color: var(--color-grey-50);
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  flex-direction: column;
  /* border-left: 1px solid var(--color-grey-200); */
  /* border-left: none; */
`;

export default function Configuration() {
  const { selectedSection, selectedFlyer, setSelectedFlyer } =
    useFlyerDesignerContext();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
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
  console.log("selectedFlyer", selectedFlyer);

  useEffect(() => {
    setSelectedFlyer({ ...selectedFlyer, flyerDesign: getValues() });
  }, [formValuesWatch]);

  return (
    <StyledConfigurationContainer>
      <Heading as="h2">Controls</Heading>
      <Form>
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
      </Form>
    </StyledConfigurationContainer>
  );
}
