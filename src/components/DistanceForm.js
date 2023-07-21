// Import libaries
import React, { useState } from 'react';
import axios from 'axios';
////////////////////////////////////////////////////////////////


const DistanceForm = () => {

  // use stat hooks 
  const [destinations, setDestinations] = useState('');
  const [origins, setOrigins] = useState('');
  const [distanceData, setDistanceData] = useState(null);
////////////////////////////////////////////////////////////////

  //try catch fetch  request to api
  const getDistance = async () => {
    try {
      const response = await axios.post('https://distance-app-google-3487e739ad8e.herokuapp.com/distance', {
        destinations,
        origins,
      });
      return response.data; // Axios automatically parses the response data as JSON
    } catch (error) {
      console.log('Error getting distance', error);
      return null;
    }
  };


  // fecthes data when handleSumit is clicked
  const fetchDistance = async () => {
    const results = await getDistance();
    setDistanceData(results);
  };

  // delets input data once request is submitted
  const resetDistance = async () => {
    setDestinations("");
    setOrigins("");

  }


  //handles sumbit when button is clicked it fetches the data from api
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchDistance();
    resetDistance();
  };

// returns starts
  return (
    <div className="container mt-4">

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Distance Matrix API</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="destinations">Destinations:</label>
              <input
                type="text"
                className="form-control"
                id="destinations"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="origins">Origins:</label>
              <input
                type="text"
                className="form-control"
                id="origins"
                value={origins}
                onChange={(e) => setOrigins(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Get Distance Data
            </button>
          </form>
        </div>
      </div>

      {distanceData && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Raw JSON Data</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(distanceData).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>
                      {typeof value === "object" ? (
                        <pre>{JSON.stringify(value, null, 2)}</pre>
                      ) : (
                        String(value)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
       


    </div>
  );
};

export default DistanceForm;

