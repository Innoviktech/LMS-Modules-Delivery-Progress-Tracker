import React, { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/progress-bar.component";
//import Fullchart from "./components/explainChart";

function App() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setInterval(() => setCompleted(Math.floor(Math.random() * 100) + 1), 2000);
  }, []);

  return (
    <div className="App">
      <ProgressBar />
      
    </div>
  );
}

export default App;
