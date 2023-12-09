import React from 'react';
import LineChart from './Components/LineChart';
import OverviewFlow from './Components/Graph/OverviewFlow';


function App() {
  return (
    <div className="App">
      
      <h2 style={{textAlign: "center"}}>Ciudad Torowel</h2>
      <LineChart />
      <div style={{width: "1200px", height: "300px", margin: "auto", border:"2px solid"}}>
      <OverviewFlow/></div>
    </div>
  );  
}

export default App;