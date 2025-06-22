import { useState, useRef, useEffect } from "react";
import { NavMenuItem } from "@/types";
import { SearchSuggestions } from "./SearchSuggestions";

interface SearchBarProps {
  hitokoto: {
    hitokoto: string;
    from: string;
  };
  value: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  menuItems?: NavMenuItem[];
  userRole?: string;
  isLan?: boolean;
  onSelectMenuItem?: (item: NavMenuItem) => void;
}

export const SearchBar = ({
  hitokoto,
  value,
  onSearch,
  onSubmit,
  menuItems = [],
  userRole = "guest",
  isLan = false,
  onSelectMenuItem,
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e);
    setShowSuggestions(e.target.value.trim().length > 0);
  };

  const handleSelectItem = (item: NavMenuItem) => {
    if (onSelectMenuItem) {
      onSelectMenuItem(item);
    }
    setShowSuggestions(false);
    // 选择后清空搜索框
    onSearch({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div ref={searchRef} className="relative md:w-1/3 w-9/12 m-auto">
      <form className="group relative" onSubmit={onSubmit}>
        <input
          className="focus:ring-2 inputsearch focus:ring-blue-500 focus:outline-none text-white appearance-none w-full text-sm leading-6 placeholder-gray-400 rounded-full py-2 pl-4 pr-16 shadow-sm"
          type="text"
          id="search"
          style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
          aria-label="搜索"
          placeholder={`${hitokoto.hitokoto} —— ${hitokoto.from}`}
          autoFocus
          value={value}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
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

      {/* 搜索建议 */}
      <SearchSuggestions
        searchValue={value}
        menuItems={menuItems}
        userRole={userRole}
        isLan={isLan}
        onSelectItem={handleSelectItem}
        visible={showSuggestions}
      />
    </div>
  );
};
