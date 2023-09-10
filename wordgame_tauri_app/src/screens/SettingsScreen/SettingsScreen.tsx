import { useState } from "react";
import { HomeButton } from "../../components/buttons/HomeButton/HomeButton";
import { SwitchToggle } from "../../components/SwitchToggle/SwitchToggle";
import { ACTION_SET_SOUND } from "../../contexts/appContext/actions";
import { useAppContext } from "../../contexts/appContext/context";
import * as Styled from "./styles";

export const SettingsScreen = () => {
  const { state, dispatch } = useAppContext();

  const onClickSound = () => {
    dispatch({ type: ACTION_SET_SOUND, payload: !state.settings.soundEnabled });
  };

  return (
    <Styled.SettingsScreenContainer>
      <Styled.Head>
        <HomeButton />
        <Styled.Head__ScreenTitle>Settings</Styled.Head__ScreenTitle>
      </Styled.Head>
      <Styled.Body>
        <Styled.LabelAndSwitch>
          <Styled.ToggleLabel>SOUND</Styled.ToggleLabel>
          <SwitchToggle
            isOn={state.settings.soundEnabled}
            onColor="rgb(138, 255, 138)"
            handleToggle={onClickSound}
          />
        </Styled.LabelAndSwitch>
      </Styled.Body>
    </Styled.SettingsScreenContainer>
  );
};
