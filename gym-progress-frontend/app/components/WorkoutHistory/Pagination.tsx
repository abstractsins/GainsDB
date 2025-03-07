import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4 justify-center">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="pagination bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="nav-readout text-white">Page {page} of {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="pagination bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
