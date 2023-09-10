import styled from "styled-components";

/**
 * This element will wrap the canvas. It's dimensions
 * are important because the square canvas will compute it's
 * own dimensions based on the width of this container.
 */
export const LettersCircleContainer = styled.div`
  position: relative;
  @media (orientation: landscape) {
    aspect-ratio: 1 / 1;
    height: 100%;
  }

  @media (orientation: portrait) {
    aspect-ratio: 1 / 1;
    height: 100%;
  }
`

/**
 * The dimensions of the canvas will be computed in javascript,
 * and will be based on the dimensions of the container element
 * (the DOM element that wraps/parents the canvas).
 */
export const LettersCircleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
`