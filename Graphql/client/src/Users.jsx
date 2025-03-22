import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      phone
    }
  }
`;

const Users = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {data.getAllUsers.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> <br />
            Email: {user.email} <br />
            Phone: {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
