import styled from "styled-components";
import Heading from "../ui/Heading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useGlobalContext } from "../context/GlobalContext";
import useGetUserLimits from "../hooks/useGetUserLimits";
import {
  groupFlyersBasedOnPostingMethod,
  totalNumberOfFlyerLikes,
} from "../utils/FlyerUtils";
import DoughnutStat from "../ui/Statistics/DoughnutStat";
import NumberStat from "../ui/Statistics/NumberStat";
import { useState } from "react";
import Usage from "../features/statistics/usage/Usage";

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledStatisticsPage = styled.div`
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;

  @media (max-width: 59em) {
    justify-content: center;
  }
`;

const StyledActionPillsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;

const Pill = styled.div<{ active?: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 1.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-brand-600);
  border: 1px solid var(--color-brand-600);

  ${(props) =>
    props.active &&
    `
    background-color: var(--color-brand-600);
    color: var(--color-grey-50);
  `}
`;

const StyledStatisticsTitleContainer = styled.div``;

export default function Statistics() {
  const [activeTab, setActiveTab] = useState<"usage" | "analytics">("usage");

  return (
    <StyledStatisticsPage>
      <StyledHeadingContainer>
        <StyledStatisticsTitleContainer>
          <Heading as="h2">Statistics</Heading>
        </StyledStatisticsTitleContainer>
        <StyledActionPillsContainer>
          <Pill
            active={activeTab === "usage"}
            onClick={() => setActiveTab("usage")}
          >
            Usage
          </Pill>
          <Pill
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Pill>
        </StyledActionPillsContainer>
      </StyledHeadingContainer>
      <div>
        {activeTab === "usage" && <Usage />}
        {activeTab === "analytics" && (
          <p style={{ textAlign: "center" }}>Analytics Coming Soon.</p>
        )}
      </div>
    </StyledStatisticsPage>
  );
}
