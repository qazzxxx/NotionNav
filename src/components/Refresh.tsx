import { RefreshIcon } from "./icons";

interface RefreshProps {
  onClick: () => void;
}

export const Refresh = ({ onClick }: RefreshProps) => {
  return (
    <a
      className="rounded-full navhover text-white p-2 text-sm font-semibold md:block hidden"
      style={{
        float: "right",
        backgroundColor: "rgba(42, 42, 42, 0.42)",
        cursor: "pointer",
        marginTop: "-35px",
        marginRight: "8px",
      }}
      onClick={onClick}
    >
      <RefreshIcon />
    </a>
  );
};
