import { COLORS } from "~/styles/constants";
import pSBCLib from "shade-blend-color";

const pSBC = pSBCLib;

const Colors = () => {
  const lightOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50);
  const darkOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50 + 500);
  const PALETTE = {};
  Object.entries(COLORS).forEach((value) => {
    const [key, color] = value;

    PALETTE[key] = [
      ...lightOffsets.map((offset) => [offset, pSBC((offset - 500) / 500, color, "#fff")]),
      ...darkOffsets.map((offset) => [offset, pSBC((500 - offset) / 500, color, "#000")]),
    ].reduce((acc, [offset, color]) => { acc[offset] = color; return acc; }, { 500: color });
  });
  PALETTE["dark"] = {
    900: "#0C0C0C",
    800: "#1C1C1C",
    700: "#2A2A2A",
    600: "#323232",
    500: "#505050",
    400: "#C8C8C8",
    300: "#ECECEC",
    200: "#FBF8F4",
    100: "#FDFDFD",
  };

  return (
    <div>
      {Object.entries(PALETTE).map(([key, colors]) => (
        Object.entries(colors).map(([offset, color]) => (
          <div
            key={`${key}-${offset}`}
            className="flex items-center justify-center"
            style={{ backgroundColor: color, height: 25 }}
          >
            <span className={`text-${key}-content`}>{`${key}-${offset}`}</span>
          </div>
        ))
      ))}
    </div>
  );
}

export default Colors;