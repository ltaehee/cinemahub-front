import { ChangeEvent, FC, useEffect, useState } from "react";
import UseDebounce from "../../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  useDebounce: boolean;
}

const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  placeholder = "검색어를 입력하세요",
  className,
}) => {
  const [query, setQuery] = useState("");

  const debouncedSearch = UseDebounce(query, 700);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <>
      <div className={`${className} flex items-center`}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="border p-2 w-full"
        />
      </div>
    </>
  );
};

export default SearchBar;
