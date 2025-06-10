import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";
import Heading from "../../ui/Heading";
import {
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const StyledAnonymousContainer = styled.div``;
const StyledInfoAlertContainer = styled.div`
  background-color: var(--color-orange-200);
  padding: 1.6rem 2.4rem;

  & h4 {
    color: var(--color-orange-600);
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  & p {
    font-size: 1.4rem;
  }
  & .learn-more {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  & .learn-more,
  & .learn-more svg {
    font-size: 1.4rem;
    color: var(--color-orange-600);
  }
`;

const StyledFormContainer = styled.div`
  padding: 1.6rem 2.4rem;
`;

const StyledForm = styled.form``;

const StyledFormControlRow = styled.div`
  display: flex;
  gap: 2.4rem;

  & label {
    font-weight: 600;
    color: var(--color-brand-600);
  }

  & .ql-toolbar,
  & .ql-container {
    border: 1px solid var(--color-brand-500);
  }
  & .ql-editor {
    color: var(--color-grey-600);
  }
`;

const StyledFormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.4rem;
  flex: 1;
`;

export default function Anonymous() {
  const [content, setContent] = useState<string>("");
  return (
    <StyledAnonymousContainer>
      <StyledInfoAlertContainer>
        <Heading as={"h4"}>
          <span>
            <HiOutlineExclamationCircle />
          </span>
          <span>You are posting as Anonymous</span>
        </Heading>
        <p>Do more with your flyers by signing-in or registering</p>
        <p>
          Why is it better to be a registered user?{" "}
          <span className="learn-more">
            Learn more <HiOutlineArrowRight />
          </span>{" "}
        </p>
      </StyledInfoAlertContainer>
      <StyledFormContainer>
        <StyledForm>
          <StyledFormControlRow>
            {/* Title */}
            <StyledFormControl className="title">
              <label htmlFor="title">Title</label>
              <Input type="text" id="title" />
            </StyledFormControl>
            {/* Category */}
            <StyledFormControl className="category">
              <label htmlFor="category">Category</label>
              <Select
                options={[{ label: "hey", value: "hey" }]}
                value=""
                onChange={() => {}}
              />
            </StyledFormControl>
          </StyledFormControlRow>
          <StyledFormControlRow>
            {/* Description */}
            <StyledFormControl>
              <label htmlFor="description">Description</label>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
            </StyledFormControl>
            {/* Image */}
            <StyledFormControl>
              <label htmlFor="image">Image</label>
              <Input type="file" id="image" />
            </StyledFormControl>
          </StyledFormControlRow>
          {/* Org Info */}
          {/* Org Info / Name */}
          {/* Org Info / Location */}
          {/* Org Info / Website */}
          {/* Org Info / Phone number */}
        </StyledForm>
      </StyledFormContainer>
    </StyledAnonymousContainer>
  );
}
