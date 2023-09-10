import styled from "styled-components";

export const SwitchSpan = styled.span`
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  transition: 0.2s;
  background: #ff6afe;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

export const SwitchLabel = styled.label<{
  onColor: string;
  isOn: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100px;
  height: 50px;
  background: ${({ onColor, isOn }) => (isOn ? onColor : "grey")};
  border-radius: 100px;
  position: relative;
  transition: background-color 0.2s;
`;

export const SwitchCheckbox = styled.input.attrs({
  type: "checkbox",
})`
  height: 0;
  width: 0;
  visibility: hidden;

  &:checked + ${SwitchLabel} > ${SwitchSpan} {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`;
