import React, { useState, useEffect, useMemo } from 'react';

const UserList = ({ users }) => {
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [sortBy, setSortBy] = useState('userId');
  const [sortDir, setSortDir] = useState('asc');
  const [filterValue, setFilterValue] = useState('');
  const [filterInput, setFilterInput] = useState('');

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.username.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(filterValue.toLowerCase())
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
  }, [users, filterValue, sortBy, sortDir]);

  const paginatedUsers = useMemo(() => {
    const start = page * size;
    return filteredAndSortedUsers.slice(start, start + size);
  }, [filteredAndSortedUsers, page, size]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / size);

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
      <h2>Users</h2>
      <div>
        <input
          type="text"
          placeholder="Filter by username or email"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <button onClick={handleFilterApply}>Apply Filter</button>
        <button onClick={handleFilterClear}>Clear Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('userId')}>
              ID {sortBy === 'userId' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('username')}>
              Username {sortBy === 'username' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {sortBy === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
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

export default UserList;
