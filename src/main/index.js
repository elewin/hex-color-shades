import React, { useState } from "react";
import styles from "./styles.css";
import {
  isValidHexColorCode,
  lightenDarkenColor,
  contrastingColor
} from "html-color-tools";

const LIGHTER = "Lighter";
const DARKER = "Darker";
const BRIGHTNESS_THRESHOLD = 186;

const Main = props => {
  const [inputColor, setInputColor] = useState("");
  const colorCodeIsValid = isValidHexColorCode(inputColor);
  const badInput = inputColor.length >= 6 && !colorCodeIsValid;
  let lighter = [];
  let darker = [];
  let original = [];

  if (colorCodeIsValid) {
    lighter = getColors(inputColor, LIGHTER);
    darker = getColors(inputColor, DARKER);
    original = new Array(
      lighter.length > darker.length ? lighter.length : darker.length
    );
    original = original.fill(
      {
        colorCode: inputColor,
        pct: 0
      },
      0
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <span className={styles.title}>hex-color-shades</span>
        <div>
          <a href="https://github.com/elewin/hex-color-shades">
            https://github.com/elewin/hex-color-shades
          </a>
        </div>
        <div className={styles.instructions}>
          Enter a hex HTML color code to see its corresponding shades
        </div>
      </div>
      <div
        className={`${styles.inputContainer} ${
          badInput ? styles.invalid : null
        }`}
      >
        <div className={styles.input}>
          #
          <input
            maxLength="6"
            type="text"
            placeholder="Hex Color "
            onChange={e => setInputColor(e.target.value)}
          />
        </div>
        {badInput ? (
          <div className={styles.invalidLabel}> Invalid color code! </div>
        ) : null}
      </div>
      <div className={styles.resultsContainer}>
        <Swatches colors={lighter} label={"Lighter"} />
        <Swatches colors={original} label={"Original"} />
        <Swatches colors={darker} label={"Darker"} />
      </div>
    </div>
  );
};

const Swatches = props => {
  const { colors, label } = props;
  return (
    <div>
      {colors.length ? (
        <div className={styles.swatchLabel}> {label} </div>
      ) : null}
      {colors.map((e, idx) => {
        return (
          <div key={idx}>
            <Swatch color={e.colorCode} pct={e.pct} />
          </div>
        );
      })}
    </div>
  );
};

const Swatch = props => {
  const { color, pct } = props;
  const textColor = contrastingColor(color, BRIGHTNESS_THRESHOLD);
  return (
    <div
      className={styles.swatchContainer}
      style={{
        backgroundColor: `#${color}`,
        borderBottom: `1px solid ${textColor}`,
        color: textColor
      }}
    >
      <div> {`${pct}%`} </div> <div> {`#${color.toUpperCase()}`} </div>
    </div>
  );
};

/**
 * Gets color values for a given color and direction
 *
 * @param {String} colorCode original starting HTML color code
 * @param {String} direction whether to lighten or darken original color
 * @param {Number} [pct] percent to lighten/darken
 * @param {Array<Object>} [colors]
 * @returns {Array<Object>}
 */
function getColors(colorCode, direction, pct, colors) {
  colors = colors || [
    {
      colorCode,
      pct: 0
    }
  ];
  pct = pct || 1;
  if (
    (direction === LIGHTER &&
      colors[colors.length - 1].colorCode === "ffffff") ||
    (direction === DARKER && colors[[colors.length - 1]].colorCode === "000000")
  ) {
    return colors;
  }
  let newColor = lightenDarkenColor(
    colorCode,
    pct * (direction === DARKER ? -1 : 1)
  );
  colors.push({
    colorCode: newColor,
    pct
  });
  return getColors(colorCode, direction, ++pct, colors);
}

export default Main;
