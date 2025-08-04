import styled from "styled-components";
import Heading from "../../../ui/Heading";
import { useForm } from "react-hook-form";
import Form from "../../../ui/Form/Form";
import FormControlRow from "../../../ui/Form/FormControlRow";
import FormControl from "../../../ui/Form/FormControl";
import SelectInput from "../../../ui/Form/SelectInput";

const StyledConfigurationContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2.4rem;
  background-color: var(--color-grey-50);
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  flex-direction: column;
  border-left: 1px solid var(--color-grey-200);
  /* border-left: none; */
`;

export default function Configuration() {
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });
  // watchers
  const fontWatch = watch("font");

  return (
    <StyledConfigurationContainer>
      <Heading as="h2">Controls</Heading>
      <Form>
        <FormControlRow>
          <SelectInput
            register={register}
            registerName="font"
            options={[
              { value: '"Merriweather", serif', label: "Serif" },
              { value: '"DM Sans", sans-serif', label: "Sans Serif" },
            ]}
            value={fontWatch}
            errors={errors}
          />
        </FormControlRow>
      </Form>
    </StyledConfigurationContainer>
  );
}
