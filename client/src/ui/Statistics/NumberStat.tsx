import styled from "styled-components";

const StyledNumberStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
`;

const StyledNumber = styled.div`
  font-size: 6.4rem;
  font-weight: 600;
  color: var(--color-brand-500);
`;

const StyledTitle = styled.p``;

export default function NumberStat({ data }: any) {
  return (
    <StyledNumberStatContainer>
      <StyledNumber>{data.statNum}</StyledNumber>
      <StyledTitle>{data.title}</StyledTitle>
    </StyledNumberStatContainer>
  );
}
