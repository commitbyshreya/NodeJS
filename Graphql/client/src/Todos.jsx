import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      user {
        name
      }
    }
  }
`;

const Todos = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Todos</h2>
      <ul>
        {data.getTodos.map((todo) => (
          <li key={todo.id}>
            <small>ID: {todo.id}</small> <br />
            <strong>{todo.title}</strong> - {todo.completed ? 'Completed' : 'Incomplete'} <br />
            <small>Assigned to: {todo.user?.name || 'Unknown'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
