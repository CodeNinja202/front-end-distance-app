import React from 'react';
import DistanceForm from './components/DistanceForm';

function App({destinations,origins}) {
  return (
    <div className="App">
      <h1>Distance Matrix API Form</h1>
      <DistanceForm />
    </div>
    
  );
}

export default App;

