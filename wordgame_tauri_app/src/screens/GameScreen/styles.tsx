import styled from "styled-components";

const HEIGHTS = {
  // Portrait Orientation
  P: {
    BOARD_SECTION: "50vh",
    ACTIVE_WORD_SECTION: "7vh",
    WHEEL_SECTION: "43vh",
  },
  // Landscape Oritentation
  L: {
    BOARD_SECTION: "50vh",
    ACTIVE_WORD_SECTION: "7vh",
    WHEEL_SECTION: "43vh",
  }
};

export const GameScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
`;

export const BoardSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  padding: 1vw;
  @media (orientation: landscape) {
    height: ${HEIGHTS.L.BOARD_SECTION};
  }

  @media (orientation: portrait) {
    height: ${HEIGHTS.P.BOARD_SECTION};
  }
`;

export const ActiveWordSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  letter-spacing: 3vw;
  height: 5vw;
  box-sizing: border-box;
  background-color: grey;
  color: white;
  @media (orientation: landscape) {
    height: ${HEIGHTS.L.ACTIVE_WORD_SECTION};
  }

  @media (orientation: portrait) {
    height: ${HEIGHTS.P.ACTIVE_WORD_SECTION};
  }
`;

export const WheelSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 1vw;
  box-sizing: border-box;
  @media (orientation: landscape) {
    height: ${HEIGHTS.L.WHEEL_SECTION};
  }

  @media (orientation: portrait) {
    height: ${HEIGHTS.P.WHEEL_SECTION};
  }
`;
