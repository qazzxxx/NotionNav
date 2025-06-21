interface FooterProps {
  daysUntil: number;
}

export const Footer = ({ daysUntil }: FooterProps) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(42, 42, 42, 0.42)",
      }}
      className="text-sm  space-x-6 p-6 bg-white rounded-2xl text-white mt-10 navhover"
    >
      <div className="text-2xl mb-2">也宝 {daysUntil} 天啦！</div>
    </div>
  );
};
