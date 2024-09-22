import React, { useState, useEffect } from "react";
import styles from "../style/tables.module.css";

interface Match {
  flag_url: string;
  League: string;
  Week: string | number;
  Date: string;
  Local: string;
  Visitor: string;
}

interface DesktopMatchesTableProps {
  matches: Match[];
}

const DesktopMatchesTable: React.FC<DesktopMatchesTableProps> = ({
  matches,
}) => {
  const [sortedMatches, setSortedMatches] = useState<Match[]>(matches);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Match;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    setSortedMatches(matches); // Reset to the original matches when they change
  }, [matches]);

  const handleSort = (column: keyof Match) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === column &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    const sortedData = [...sortedMatches].sort((a, b) => {
      if (a[column] < b[column]) return direction === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortedMatches(sortedData);
    setSortConfig({ key: column, direction });
  };

  return (
    <table className="table table-hover">
      <thead className="align-top">
        <tr>
          <th onClick={() => handleSort("League")}>
            League{" "}
            <i
              className={`fa-solid fa-sort ${
                sortConfig?.key === "League"
                  ? sortConfig.direction === "ascending"
                    ? "fa-sort-up"
                    : "fa-sort-down"
                  : ""
              }`}
            ></i>
          </th>
          <th>Week</th>
          <th onClick={() => handleSort("Date")}>
            Date{" "}
            <i
              className={`fa-solid fa-sort ${
                sortConfig?.key === "Date"
                  ? sortConfig.direction === "ascending"
                    ? "fa-sort-up"
                    : "fa-sort-down"
                  : ""
              }`}
            ></i>
          </th>
          <th onClick={() => handleSort("Local")}>
            Local{" "}
            <i
              className={`fa-solid fa-sort ${
                sortConfig?.key === "Local"
                  ? sortConfig.direction === "ascending"
                    ? "fa-sort-up"
                    : "fa-sort-down"
                  : ""
              }`}
            ></i>
          </th>
          <th onClick={() => handleSort("Visitor")}>
            Visitor{" "}
            <i
              className={`fa-solid fa-sort ${
                sortConfig?.key === "Visitor"
                  ? sortConfig.direction === "ascending"
                    ? "fa-sort-up"
                    : "fa-sort-down"
                  : ""
              }`}
            ></i>
          </th>
        </tr>
      </thead>
      <tbody id="table-body">
        {sortedMatches.map((match, index) => (
          <tr className="search-teams" key={index}>
            <td>
              <div className="d-flex flex-row align-items-center">
                <img
                  className={`mx-2 ${styles.tableimage}`}
                  src={match.flag_url}
                  alt={match.League}
                />
                <div className="mx-2">
                  {match.League[0].toUpperCase() + match.League.slice(1)}
                </div>
              </div>
            </td>
            <td>{match.Week}</td>
            <td>
              {new Date(match.Date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td>{match.Local}</td>
            <td>{match.Visitor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DesktopMatchesTable;
