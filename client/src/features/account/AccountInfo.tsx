import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import Button from "../../ui/Button";

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const AccountDatumContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const AccountDatum = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.2rem;

  & span:first-child {
    font-weight: 600;
    width: 100px;
  }
  & span:last-child {
    font-weight: 400;
  }
`;

export default function AccountInfo() {
  const { user, setIsOpenBottomSlideIn, setBottomSlideInType } =
    useGlobalContext();
  console.log("user", user);

  const handleEditClick = () => {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("editAccountInfo");
  };

  const determineNameToDisplay = () => {
    if (user?.typeOfUser === "individual") {
      return (
        <>
          <AccountDatum>
            <span>First Name</span>
            <span>{user.firstName}</span>
          </AccountDatum>
          <AccountDatum>
            <span>Last Name</span>
            <span>{user.lastName}</span>
          </AccountDatum>
        </>
      );
    } else {
      return (
        <AccountDatum>
          <span>Name</span>
          <span>{user?.name}</span>
        </AccountDatum>
      );
    }
  };
  return (
    <AccountContainer>
      <AccountDatumContainer>
        {determineNameToDisplay()}
        <AccountDatum>
          <span>Email</span>
          <span>{user?.email}</span>
        </AccountDatum>
        <AccountDatum>
          <span>Phone</span>
          <span>{user?.phone}</span>
        </AccountDatum>
        <AccountDatum>
          <span>Address</span>
          <span>{user?.address.formatted_address}</span>
        </AccountDatum>
        <AccountDatum>
          <span>Website</span>
          <span>{user?.website}</span>
        </AccountDatum>
        <AccountDatum>
          <span></span>
          <Button size="small" onClick={handleEditClick}>
            Edit
          </Button>
        </AccountDatum>
      </AccountDatumContainer>
    </AccountContainer>
  );
}
