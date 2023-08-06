import styled, { createGlobalStyle } from "styled-components";

interface Props {
  brightness: any;
}

interface BackgroundColor {
  color: any;
}

export const BrightnessDiv = styled.div<Props>`
  height: 100vh;
  width: 100vw;
  filter: brightness(${(props) => props.brightness});
`;

export const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  transition: 0.6s ease-in-out;
  transform: scale(1.1);
`;

export const BackgroundColor = createGlobalStyle<BackgroundColor>`
  body {
    background: ${(props) => props.color};
  }
`;
