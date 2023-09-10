import styled from "styled-components";

export const SettingsScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

// ==============================================
// ==================== Head ====================
// ==============================================

export const Head = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 25px 25px 0;
`;

export const Head__ScreenTitle = styled.div`
  font-size: 72px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  justify-self: center;
  letter-spacing: 4px;
`;

// ==============================================
// ==================== Body ====================
// ==============================================

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px 6vw;
`;

export const ToggleLabel = styled.div`
  font-size: 36px;
  color: #f3dfca;
  letter-spacing: 4px;
`;

export const LabelAndSwitch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 40px;
  border-radius: 10px;
  align-items: center;
  background-color: #05b1e5;
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;
