import React from "react";
import styles from "../style/tables.module.css";

interface Prediction {
  flag_url: string;
  country: string;
  League: string;
  Date: string;
  Local: string;
  goalslocal: number | null;
  goalsvisitor: number | null;
  pag: number; // visitor goals
  phg: number; // home goals
  Visitor: string;
  result: string;
  bet: string;
  max_prob: number | null;
}

interface DesktopPredictionsTableProps {
  predictions: Prediction[];
}

const DesktopPredictionsTable: React.FC<DesktopPredictionsTableProps> = ({
  predictions,
}) => {
  const getCellClass = (bet: string, result: string) => {
    if (bet === "Local") {
      if (result === "l") return styles.boldGreen; // Local win
      if (result === "v" || result === "t") return styles.boldRed; // Local loss or tie
    } else if (bet === "Visitor") {
      if (result === "v") return styles.boldGreen; // Visitor win
      if (result === "l" || result === "t") return styles.boldRed; // Visitor loss or tie
    }
    return ""; // Return an empty string if no conditions are met
  };

  return (
    <table className="table table-hover">
      <thead className="align-top">
        <tr>
          <th className="text-center">Country</th>
          <th className="text-center">League</th>
          <th className="text-center">Date</th>
          <th className="text-center">Local</th>
          <th className="text-center">Goals Local</th>
          <th className="text-center">Goals Visitor</th>
          <th className="text-center">Visitor</th>
          <th className="text-center">Victor</th>
          <th className="text-center">Probability</th>
        </tr>
      </thead>
      <tbody id="table-body">
        {predictions.map((prediction, index) => (
          <tr className="search-teams" key={index}>
            <td className="text-center">
              <div className="d-flex flex-row align-items-center">
                <img
                  className={`mx-2 ${styles.tableimage}`}
                  src={prediction.flag_url}
                  alt={prediction.country}
                />
                <div className="mx-2">
                  {prediction.country[0].toUpperCase() +
                    prediction.country.slice(1)}
                </div>
              </div>
            </td>
            <td className="text-center">
              {prediction.League[0].toUpperCase() + prediction.League.slice(1)}
            </td>
            <td className="text-center">
              {new Date(prediction.Date).toLocaleDateString()}
            </td>
            <td
              className={`text-center ${
                prediction.bet === "Local" &&
                getCellClass(prediction.bet, prediction.result)
              }`}
            >
              {prediction.Local}
            </td>
            <td className="text-center">
              {prediction.phg} <br />
              <span className="realgoals">{prediction.goalslocal}</span>
            </td>
            <td className="text-center">
              {prediction.pag} <br />
              <span className="realgoals">{prediction.goalsvisitor}</span>
            </td>
            <td
              className={`text-center ${
                prediction.bet === "Visitor" &&
                getCellClass(prediction.bet, prediction.result)
              }`}
            >
              {prediction.Visitor}
            </td>
            <td className="text-center">{prediction.bet}</td>
            <td className="text-center">
              {prediction.max_prob !== null
                ? `${(prediction.max_prob * 100).toFixed(1)} %`
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DesktopPredictionsTable;
