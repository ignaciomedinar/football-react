// SearchBar.tsx
import React from "react";
import styles from "../style/search.module.css";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className={`${styles.search_container} col-6`}>
      <input
        className="form-control"
        type="text"
        placeholder="Search team..."
        id="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
