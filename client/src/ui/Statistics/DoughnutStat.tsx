import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsBlockContainer = styled.div`
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

const DoughnutStatContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  position: relative;
  width: 300px;
  height: 300px;
`;

const StatsNum = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StatText = styled.p``;

export default function DoughnutStat({ data }: any) {
  const configuredData = {
    // labels: data.labels,
    datasets: data.datasets,
  };
  return (
    <StatsBlockContainer>
      {/* https://react-chartjs-2.js.org/examples/doughnut-chart */}
      <DoughnutStatContainer>
        <Doughnut data={configuredData} />
        <StatsNum>{data.statNum}</StatsNum>
      </DoughnutStatContainer>
      <StatText>{data.title}</StatText>
    </StatsBlockContainer>
  );
}
