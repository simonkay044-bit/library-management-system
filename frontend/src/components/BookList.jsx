// Shows the books in a table. Books with fewer than 2 copies are highlighted.
// The Dashboard uses it without buttons; the Books page passes onEdit and onDelete
// to show the Update and Delete buttons.
export const LOW_STOCK_LIMIT = 2;

function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty">No books found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Qty</th>
            <th>Status</th>
            {onEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const low = book.quantity < LOW_STOCK_LIMIT;
            return (
              <tr key={book.id} className={low ? "low-row" : ""}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td className={low ? "low" : ""}>
                  {book.quantity === 0 ? "Out of Stock" : low ? "Low Stock" : "In Stock"}
                </td>
                {onEdit && (
                  <td>
                    <button onClick={() => onEdit(book)}>Update</button>{" "}
                    <button onClick={() => onDelete(book)}>Delete</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
