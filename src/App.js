import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DistanceForm from './components/DistanceForm';
import ResponsiveExample from './components/ResponsiveExample'; // Importing the ResponsiveExample component

function App({destinations, origins}) {
  return (
    <div className="App">
      <h1>Distance Matrix API Form</h1>
      <DistanceForm />

      <h1>Import CSV Data</h1> 
      <ResponsiveExample /> 
    </div>
  );
}

export default App;


