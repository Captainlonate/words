import * as Styled from "./styles";

import { ProfileButton } from "../../components/buttons/ProfileButton/ProfileButton";
import { FriendsButton } from "../../components/buttons/FriendsButton/FriendsButton";
import { SettingsButton } from "../../components/buttons/SettingsButton/SettingsButton";
import { useAppContext } from "../../contexts/appContext/context";
import { Link } from "react-router-dom";

export const HomeScreen = () => {
  const {
    state: { user },
  } = useAppContext();

  return (
    <Styled.HomePageContainer>
      <Styled.Top>
        <Styled.GameTitle>Word Game</Styled.GameTitle>
      </Styled.Top>
      <Styled.Center>
        <Link to="/game">
          <Styled.PlayButton>
            Continue {user.numberOfBoardsCompleted}
          </Styled.PlayButton>
        </Link>
      </Styled.Center>
      <Styled.Bottom>
        <ProfileButton />
        <FriendsButton />
        <SettingsButton />
      </Styled.Bottom>
    </Styled.HomePageContainer>
  );
};
