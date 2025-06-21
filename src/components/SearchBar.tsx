interface SearchBarProps {
  hitokoto: {
    hitokoto: string;
    from: string;
  };
  value: string; // 添加 value 属性
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const SearchBar = ({
  hitokoto,
  value,
  onSearch,
  onSubmit,
}: SearchBarProps) => {
  return (
    <form className="group relative md:w-1/3 w-9/12 m-auto" onSubmit={onSubmit}>
      <input
        className="focus:ring-2 inputsearch focus:ring-blue-500 focus:outline-none text-white appearance-none w-full text-sm leading-6 placeholder-gray-400 rounded-full py-2 pl-4 pr-16 shadow-sm"
        type="text"
        id="search"
        style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
        aria-label="搜索"
        placeholder={`${hitokoto.hitokoto} —— ${hitokoto.from}`}
        autoFocus
        value={value}
        onFocus={(e) => {
          e.target?.select();
        }}
        onChange={onSearch}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5
                 rounded-full hover:bg-white/10
                 transition-colors duration-200
                 text-white/70 hover:text-white"
        aria-label="搜索"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
};
