// Log of every stock change, newest first
function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return <p className="empty">No transactions recorded yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Member</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.book_title}</td>
              <td>
                {t.type === "ADD_STOCK" ? (
                  "Stock added"
                ) : (
                  "Borrowed"
                )}
              </td>
              <td>{t.type === "ADD_STOCK" ? "+" + t.quantity : "-" + t.quantity}</td>
              <td>{t.user_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
