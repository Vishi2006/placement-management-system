export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="mt-5 flex items-center justify-end gap-2">
      <button className="btn-ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
        Prev
      </button>
      <span className="px-2 text-sm">Page {page}</span>
      <button className="btn-ghost" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
    </div>
  )
}
