import React, { useState, useEffect, useMemo } from 'react';

const WalletList = ({ wallets }) => {
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [sortBy, setSortBy] = useState('walletId');
  const [sortDir, setSortDir] = useState('asc');
  const [filterValue, setFilterValue] = useState('');
  const [filterInput, setFilterInput] = useState('');

  const filteredAndSortedWallets = useMemo(() => {
    let filtered = wallets.filter(wallet =>
      wallet.walletName.toLowerCase().includes(filterValue.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [wallets, filterValue, sortBy, sortDir]);

  const paginatedWallets = useMemo(() => {
    const start = page * size;
    return filteredAndSortedWallets.slice(start, start + size);
  }, [filteredAndSortedWallets, page, size]);

  const totalPages = Math.ceil(filteredAndSortedWallets.length / size);

  useEffect(() => {
    setPage(0);
  }, [filterValue]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleFilterApply = () => {
    setFilterValue(filterInput);
    setPage(0);
  };

  const handleFilterClear = () => {
    setFilterValue('');
    setFilterInput('');
    setPage(0);
  };

  return (
    <div>
      <h2>Wallets</h2>
      <div>
        <input
          type="text"
          placeholder="Filter by wallet name"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <button onClick={handleFilterApply}>Apply Filter</button>
        <button onClick={handleFilterClear}>Clear Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('walletId')}>
              ID {sortBy === 'walletId' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('walletName')}>
              Name {sortBy === 'walletName' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('balance')}>
              Balance {sortBy === 'balance' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedWallets.map(wallet => (
            <tr key={wallet.walletId}>
              <td>{wallet.walletId}</td>
              <td>{wallet.walletName}</td>
              <td>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default WalletList;
