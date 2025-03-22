import React from 'react';
import Todos from './Todos';
import Users from './Users';

const App = () => {
  return (
    <div>
      <h1>GraphQL Frontend with Apollo Client</h1>
      <Todos />
      <Users />
    </div>
  );
};

export default App;
