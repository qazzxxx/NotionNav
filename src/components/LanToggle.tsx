import { GlobalIcon, LanIcon } from "./icons";

interface LanToggleProps {
  isLan: boolean;
  onToggle: () => void;
}

export const LanToggle = ({ isLan, onToggle }: LanToggleProps) => {
  return (
    <a
      className="rounded-full navhover text-white p-2 text-sm font-semibold"
      style={{
        float: "right",
        backgroundColor: "rgba(42, 42, 42, 0.42)",
        cursor: "pointer",
        marginTop: "-37px",
      }}
      onClick={onToggle}
    >
      {isLan ? <LanIcon /> : <GlobalIcon />}
    </a>
  );
};
