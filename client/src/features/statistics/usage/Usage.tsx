import styled from "styled-components";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetUserLimits from "../../../hooks/useGetUserLimits";
import {
  groupFlyersBasedOnPostingMethod,
  totalNumberOfFlyerLikes,
} from "../../../utils/FlyerUtils";
import DoughnutStat from "../../../ui/Statistics/DoughnutStat";
import NumberStat from "../../../ui/Statistics/NumberStat";

const AllStatsContainer = styled.div`
  display: flex;
  gap: 2.4rem;

  @media (max-width: 75em) {
    /* flex-direction: column;
    align-items: center; */
    flex-wrap: wrap;
  }
  @media (max-width: 34em) {
    justify-content: center;
  }
`;

export default function Usage() {
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
    title: "On-location",
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
    title: "Remote",
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
  const templateData = {
    statNum: `${user?.templates?.length || 0}/${userLimits.templates.limit}`,
    title: "Templates",
    // labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Templates",
        data: [
          user?.templates?.length || 0,
          userLimits.templates.limit - (user?.templates?.length || 0),
        ],
        backgroundColor: ["#2B8A40", "#e9e9e9"],
        borderColor: ["#2B8A40", "#808080"],
        borderWidth: 1,
      },
    ],
  };

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
    <AllStatsContainer>
      <DoughnutStat data={onLocationData} />

      <DoughnutStat data={remoteData} />
      <DoughnutStat data={templateData} />
      <NumberStat data={totalFlyersData} />
      {likesData && <NumberStat data={likesData} />}
    </AllStatsContainer>
  );
}
