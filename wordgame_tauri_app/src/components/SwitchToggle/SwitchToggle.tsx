import * as Styled from "./styles";

interface ISwitchToggleProps {
  isOn: boolean;
  handleToggle: () => void;
  onColor: string;
}

export const SwitchToggle = ({
  isOn,
  handleToggle,
  onColor,
}: ISwitchToggleProps) => (
  <>
    <Styled.SwitchCheckbox
      checked={isOn}
      onChange={handleToggle}
      id="react-switch-new"
    />
    <Styled.SwitchLabel
      onColor={onColor}
      isOn={isOn}
      htmlFor={`react-switch-new`}
    >
      <Styled.SwitchSpan></Styled.SwitchSpan>
    </Styled.SwitchLabel>
  </>
);
