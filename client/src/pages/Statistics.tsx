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

const AllStatsContainer = styled.div`
  display: flex;
  gap: 2.4rem;

  @media (max-width: 59em) {
    /* flex-direction: column;
    align-items: center; */
    flex-wrap: wrap;
  }
  @media (max-width: 34em) {
    justify-content: center;
  }
`;

const StyledStatisticsTitleContainer = styled.div``;

export default function Statistics() {
  const { user } = useGlobalContext();
  const userLimits = useGetUserLimits();
  const groupedFlyers = groupFlyersBasedOnPostingMethod(user?.flyers || []);
  console.log("groupedFlyers", groupedFlyers);
  console.log("userLimits", userLimits.onLocationPosting.limit);
  let likesData = null;
  let totalLikes = totalNumberOfFlyerLikes(user?.flyers || []);

  // if (groupedFlyers?.onLocation?.length) {
  const onLocationData = {
    statNum: `${groupedFlyers?.onLocation?.length || 0}/${
      userLimits.onLocationPosting.limit
    }`,
    title: "On-location Posting",
    // labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Flyer",
        data: [
          groupedFlyers?.onLocation?.length || 0,
          userLimits.onLocationPosting.limit -
            (groupedFlyers?.onLocation?.length || 0),
        ],
        backgroundColor: ["#2B8A40", "#e9e9e9"],
        borderColor: ["#2B8A40", "#808080"],
        borderWidth: 1,
      },
    ],
  };
  // }

  // if (groupedFlyers?.remote?.length) {
  const remoteData = {
    statNum: `${groupedFlyers?.remote?.length || 0}/${
      userLimits.remotePosting.limit
    }`,
    title: "Remote Posting",
    // labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Flyer",
        data: [
          groupedFlyers?.remote?.length || 0,
          userLimits.remotePosting.limit - (groupedFlyers?.remote?.length || 0),
        ],
        backgroundColor: ["#2B8A40", "#e9e9e9"],
        borderColor: ["#2B8A40", "#808080"],
        borderWidth: 1,
      },
    ],
  };
  // }

  if (totalLikes) {
    likesData = {
      statNum: `${totalLikes}`,
      title: "Total Likes",
    };
  }

  const totalFlyersData = {
    statNum: `${user?.flyers?.length || 0}`,
    title: "Total Flyers",
  };

  return (
    <StyledStatisticsPage>
      <StyledHeadingContainer>
        <StyledStatisticsTitleContainer>
          <Heading as="h2">Statistics</Heading>
        </StyledStatisticsTitleContainer>
      </StyledHeadingContainer>
      <AllStatsContainer>
        <DoughnutStat data={onLocationData} />

        <DoughnutStat data={remoteData} />
        <NumberStat data={totalFlyersData} />
        {likesData && <NumberStat data={likesData} />}
      </AllStatsContainer>
    </StyledStatisticsPage>
  );
}
