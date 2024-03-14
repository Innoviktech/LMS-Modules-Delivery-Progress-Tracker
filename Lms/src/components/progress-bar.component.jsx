import React, { useState, useEffect } from "react";
import "./ProgressBar.css";
import Fullchart from "./explainChart"; 

const ProgressBar = () => {
  const [moduleData, setModuleData] = useState([]);
  const colors = ["#FF6B6B", "#48DBFB", "#FF9F40", "#FFD700", "#C4E538"]; 
  const [selectedModuleId, setSelectedModuleId] = useState(null); 
  const [selectedModuleName, setSelectedModuleName] = useState("");

  useEffect(() => {
    fetch("http://68.178.175.207:8000/get_LMS_all_modules_list")
      .then(response => response.json())
      .then(data => {
        const initialCompletion = data.map(() => 0);
        setModuleData(data.map((module, index) => ({ ...module, completion: initialCompletion[index] })));
      })
      .catch(error => console.error("Error fetching module data:", error));
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch("http://68.178.175.207:8000/get_LMS_sdlc_weighted_percent_sum?module_id=2");
        const progressData = await response.json();
        const moduleIndex = moduleData.findIndex(module => module.module_id === progressData[0].module_id);
        if (moduleIndex !== -1) {
          setModuleData(prevModuleData => {
            const updatedModuleData = [...prevModuleData];
            updatedModuleData[moduleIndex].completion = progressData[0].overall_percentage;
            return updatedModuleData;
          });
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    // Fetch progress data initially and then set up interval to update progress periodically
    fetchProgress();
    const interval = setInterval(fetchProgress, 2000);

    return () => clearInterval(interval);
  }, [moduleData]);

  const handleBarClick = (moduleId, moduleName) => {
    setSelectedModuleId(moduleId); 
    setSelectedModuleName(moduleName); 
  };

  return (
    <div className="bars-main">
      <div className="container">
        <h1 className="heading">Progress Tracker</h1>
        <div className="bars-container">
          <h1 className="pb-5">Modules <span className="Progress-heading">Progress Percentage</span></h1>
          {moduleData.map((module, index) => (
            <div key={index} className="bar-wrapper">
              <div className="module-name">
                <span>{module.module_name}</span>
              </div>
              <div className="progress-bar" onClick={() => handleBarClick(module.module_id, module.module_name)}>
                <div className="bar" style={{ width: `${module.completion}%`, backgroundColor: colors[index] }}>
                  <span className="percentage">{`${module.completion}%`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedModuleId && <Fullchart moduleId={selectedModuleId} moduleName={selectedModuleName} />} 
    </div>
  );
};

export default ProgressBar;
