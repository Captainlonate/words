interface ILettersCircleConfig {
  /**
   * Background color of the entire wheel
   */
  circleBGColor: string;
  /**
   * Font Color of the letters
   */
  letterFontColor: string;
  /**
   * Color of the circles drawn on the actively selected letters,
   * meaning those that are part of the current attempt.
   */
  letterHighlightColor: string;
  /**
   * Color of the lines drawn between active letters
   */
  lineColor: string;
  /**
   * What percentage of the canvas width should the width
   * of the segment be lines
   */
  lineWidthPercentage: number;
}

export const LETTERS_WHEEL_CONFIG: ILettersCircleConfig = {
  circleBGColor: "white",
  letterFontColor: "black",
  letterHighlightColor: "purple",
  lineColor: "purple",
  lineWidthPercentage: 0.03,
};
