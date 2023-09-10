import styled from "styled-components";

export const ProfileScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

// ==============================================
// ==================== Head ====================
// ==============================================

export const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2vw 2vw 0;
`;

export const Head__ProfileName = styled.div`
  font-size: 5vw;
  font-weight: bold;
  text-align: center;
  flex: 1;
  justify-self: center;
  letter-spacing: 0.1vw;
`;

// ==============================================
// ==================== Body ====================
// ==============================================

export const Body = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Body__Left = styled.div`
  flex: 0 0 50%;
  padding: 8vw 2vw 2vw;
`;

export const Body__Right = styled.div`
  flex: 0 0 50%;
  padding: 2vw;
`;

// ==============================================
// ========= Left Section (Profile Info) ========
// ==============================================

export const ProfileInfoSection = styled.div`
  padding: 1vw;
  margin-bottom: 2vw;
`;

export const ProfileInfoSectionTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.5vw;
  font-weight: bold;
`;

export const ProfileInfoSectionSubtitle = styled.div`
  font-size: 2.25vw;
  font-weight: 500;
`;

export const ProfileInfoDetails = styled.div`
  font-size: 1.75vw;
  padding-left: 3vw;
  margin-bottom: 2vw;
`;

export const CopyIcon = styled.div`
  cursor: pointer;
  width: 1.5vw;
  height: 1.5vw;
  background-color: yellow;
  margin-left: 2vw;
  border-top-right-radius: 100px;
  border-top-left-radius: 50%;
`;

// ==============================================
// ========== Right Section (Trophies) ==========
// ==============================================

export const TrophiesSectionTitle = styled.div`
  font-size: 5vw;
  display: flex;
  align-items: baseline;
`;

export const TrophiesSectionSubTitle = styled.div`
  font-size: 2.5vw;
  font-style: italic;
  padding-left: 1vw;
`;

export const TrophiesFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 1vw;
`;

export const TrophyIconContainer = styled.div<{ grayscale?: boolean }>`
  width: 8vw;
  height: 8vw;
  border-radius: 50%;
  cursor: pointer;
  ${({ grayscale }) => (grayscale ? `filter: grayscale(1.0);` : "")}
`;
// &:hover {
//   filter: drop-shadow(0 0 2em #24c8db);
// }
