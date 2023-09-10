import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.div`
  width: 126px;
  height: 126px;
  border-radius: 50%;
  background-color: skyblue;
  border: 2px solid white;
  justify-self: left;
  cursor: pointer;
`;

export const HomeButton = () => (
  <Link to="/">
    <StyledButton></StyledButton>
  </Link>
);
