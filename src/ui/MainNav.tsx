import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";

import {
  HiOutlineCog6Tooth,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlinePaperAirplane,
  HiOutlineNewspaper,
  HiBellAlert,
  HiCreditCard,
  HiOutlineMapPin,
} from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-brand-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--color-blue-100);
  }
`;
export default function MainNav() {
  const { id } = useParams();
  // # TODO - need to group links that are only for logged in users
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard/home">
            <HiOutlineBuildingStorefront /> <span>Home</span>
          </StyledNavLink>
        </li>
        {id && (
          <li>
            <StyledNavLink to={`/dashboard/board/${id}`}>
              <HiOutlineNewspaper /> <span>Current Board</span>
            </StyledNavLink>
          </li>
        )}
        <li>
          <StyledNavLink to="/dashboard/my-flyers">
            <HiOutlinePaperAirplane /> <span>My Flyers</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/dashboard/post-from-home">
            <HiOutlineMapPin /> <span>Post At Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/dashboard/account">
            <HiOutlineUsers /> <span>My Account</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/dashboard/notifications">
            <HiBellAlert /> <span>Notifications</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/dashboard/settings">
            <HiOutlineCog6Tooth /> <span>Settings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/dashboard/billings">
            <HiCreditCard /> <span>Billings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}
