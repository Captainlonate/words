import * as Styled from "./styles";

import { allTrophies } from "../../constants/trophies";
import { useAppContext } from "../../contexts/appContext/context";
import { HomeButton } from "../../components/buttons/HomeButton/HomeButton";

export const ProfileScreen = () => {
  const {
    state: { user },
  } = useAppContext();

  const numberOfEarnedTrophies = user.trophyIdsObtained.length;
  const numberOfTotalTrophies = allTrophies.length;

  const copyFriendIdToClipboard = () => {
    if (typeof navigator?.clipboard?.writeText === "function") {
      navigator.clipboard.writeText(user.friendId);
    }
  };

  return (
    <Styled.ProfileScreenContainer>
      <Styled.Head>
        <HomeButton />
        <Styled.Head__ProfileName>{user.userName}</Styled.Head__ProfileName>
      </Styled.Head>
      <Styled.Body>
        <Styled.Body__Left>
          <Styled.ProfileInfoSection>
            <Styled.ProfileInfoSectionTitle>
              Friend ID <Styled.CopyIcon onClick={copyFriendIdToClipboard} />
            </Styled.ProfileInfoSectionTitle>
            <Styled.ProfileInfoDetails>
              {user.friendId}
            </Styled.ProfileInfoDetails>
          </Styled.ProfileInfoSection>
          <Styled.ProfileInfoSection>
            <Styled.ProfileInfoSectionSubtitle>
              Date Joined
            </Styled.ProfileInfoSectionSubtitle>
            <Styled.ProfileInfoDetails>
              {user.memberSince}
            </Styled.ProfileInfoDetails>
            <Styled.ProfileInfoSectionSubtitle>
              Number Of Words Placed
            </Styled.ProfileInfoSectionSubtitle>
            <Styled.ProfileInfoDetails>
              {user.numberOfWordsPlaced}
            </Styled.ProfileInfoDetails>
            <Styled.ProfileInfoSectionSubtitle>
              Number Of Letters Placed
            </Styled.ProfileInfoSectionSubtitle>
            <Styled.ProfileInfoDetails>
              {user.numberOfLettersPlaced}
            </Styled.ProfileInfoDetails>
          </Styled.ProfileInfoSection>
        </Styled.Body__Left>
        <Styled.Body__Right>
          <Styled.TrophiesSectionTitle>
            Trophies
            <Styled.TrophiesSectionSubTitle>
              ({numberOfEarnedTrophies}/{numberOfTotalTrophies})
            </Styled.TrophiesSectionSubTitle>
          </Styled.TrophiesSectionTitle>
          <Styled.TrophiesFrame>
            {allTrophies.map(({ key, icon }) => (
              <Styled.TrophyIconContainer
                key={key}
                grayscale={user.trophyIdsObtained.indexOf(key) === -1}
              >
                <img src={icon} alt={`Trophy ${key}`} />
              </Styled.TrophyIconContainer>
            ))}
          </Styled.TrophiesFrame>
        </Styled.Body__Right>
      </Styled.Body>
    </Styled.ProfileScreenContainer>
  );
};
