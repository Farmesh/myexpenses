import { useWallet } from '../context/WalletContext';

const TransactionHistory = () => {
  const { transactions } = useWallet();

  return (
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Transactions</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: '400px' }}>
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <span className={`badge ${transaction.type === 'CREDIT' ? 'bg-success' : 'bg-danger'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={transaction.type === 'CREDIT' ? 'text-success' : 'text-danger'}>
                    {transaction.type === 'CREDIT' ? '+' : '-'}${transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory; 