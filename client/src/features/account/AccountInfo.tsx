import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
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

const StyledImportantDatumContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border: 1px solid var(--color-brand-500);
  border-radius: var(--border-radius-md);
  /* padding: 2.4rem; */
  width: 80%;
  max-width: 900px;

  @media (max-width: 44em) {
    width: 90%;
  }
`;

const ImportantDatum = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  /* margin-bottom: 1.2rem; */
  border-bottom: 1px solid var(--color-grey-50);
  padding: 1rem 1.2rem;
  line-height: 1.4;

  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
  &:last-child {
    border-bottom: none;
  }
  & span:first-child {
    display: inline-block;
    font-weight: 600;
    width: 200px;
    min-width: 200px;
    border-right: 1px solid var(--color-brand-500);
    @media (max-width: 44em) {
      width: 150px;
      min-width: 150px;
    }
    @media (max-width: 34em) {
      width: 100px;
      min-width: 100px;
    }
  }

  & small {
    font-size: 1.2rem;
  }
  & .deleteSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
  }
`;

export default function AccountInfo() {
  const {
    user,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    setShowDeleteAccountModal,
  } = useGlobalContext();


  const handleEditClick = () => {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("editAccountInfo");
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
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
      <StyledImportantDatumContainer>
        <ImportantDatum>
          <span>Delete Account</span>
          <span className="deleteSection">
            <small>
              <strong>Can't Be Undone</strong> You will lose all your data.
            </small>{" "}
            <div>
              <Button
                size="small"
                variation="danger"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </span>
        </ImportantDatum>
      </StyledImportantDatumContainer>
    </AccountContainer>
  );
}
