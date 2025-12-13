export default function Pagination({ page, totalPages, onChange }) {
    return (
      <div className="flex gap-3 my-3 items-center">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          Prev
        </button>
  
        <span>
          Page {page} / {totalPages}
        </span>
  
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    );
  }
  