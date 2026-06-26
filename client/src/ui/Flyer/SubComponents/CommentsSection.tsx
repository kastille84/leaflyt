import { DiscussionEmbed } from "disqus-react";
import styled from "styled-components";
import { useGlobalContext } from "../../../context/GlobalContext";
import { keysBasedOnEnv } from "../../../utils/GeneralUtils";

const StyledCommentsContainer = styled.div`
  min-height: 100%;
  padding: 2rem;
  background-color: var(--color-grey-0);
`;

export default function CommentsSection() {
  const { selectedFlyer } = useGlobalContext();
  const disqusShortname = keysBasedOnEnv().disqus.shortname;

  if (!selectedFlyer || !selectedFlyer.hasComments || !disqusShortname) {
    return null;
  }

  const disqusConfig = {
    url: `${window.location.origin}/dashboard/fullFlyer/${selectedFlyer.id}`,
    identifier: selectedFlyer.id,
    title: selectedFlyer.title || "Leaflit Flyer",
  };

  return (
    <StyledCommentsContainer>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </StyledCommentsContainer>
  );
}
