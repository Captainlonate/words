import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.div`
  width: 126px;
  height: 126px;
  border-radius: 50%;
  background-color: #eb8787;
  border: 2px solid white;
  justify-self: left;
  cursor: pointer;
`;

export const ProfileButton = () => (
  <Link to="/profile">
    <StyledButton></StyledButton>
  </Link>
);
