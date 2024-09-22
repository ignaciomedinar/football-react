import React, { useEffect, useState } from "react";
import DesktopPredictionsTable from "./DesktopPredictionsTable";
import SearchBar from "./SearchBar";
import axios from "axios";

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

const PredictionsContainer: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get<Prediction[]>(
          "http://localhost:5000/api/predictions"
        );
        setPredictions(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Filter predictions based on search term
  const filteredPredictions = predictions.filter(
    (prediction) =>
      prediction.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.League.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.Local.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.Visitor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredPredictions.length / rowsPerPage);

  // Slice the predictions data to get only the rows for the current page
  const displayedPredictions = filteredPredictions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentDate = new Date();
  const mi = currentDate.toLocaleString("default", { month: "short" });
  const di = currentDate.getDate();
  const mf = currentDate.toLocaleString("default", { month: "short" });
  const df = currentDate.getDate();
  const yf = currentDate.getFullYear();

  // Determine the range of page numbers to display
  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h4 className="m-2">{`${mi} ${di} - ${mf} ${df}, ${yf}`}</h4>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <DesktopPredictionsTable predictions={displayedPredictions} />

      {/* Bootstrap Pagination Controls */}
      <nav aria-label="Page navigation" style={{ marginTop: "20px" }}>
        <ul className="pagination justify-content-center">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {/* First Page */}
          {startPage > 1 && (
            <>
              <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page Numbers within the range */}
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Last Page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Next Button */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PredictionsContainer;
