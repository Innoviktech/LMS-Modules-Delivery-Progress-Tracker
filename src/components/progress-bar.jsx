import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProgressBar.css";
import Fullchart from "./explainChart";
import { Accordion } from "react-bootstrap";

const ProgressBar = () => {
  const colors = ["#FF6B6B", "#48DBFB", "#FF9F40", "#FFD700", "#C4E538"];
  const [moduleData, setModuleData] = useState([]);

  const fetchInitialData = async () => {
    try {
      const response = await axios.get("http://68.178.175.207:8000/get_LMS_all_modules_list");
      const initialModuleData = response.data.map(module => ({ ...module, completion: 0 }));
      setModuleData(initialModuleData);
    } catch (error) {
      console.error("Error fetching module data:", error);
    }
  };

  const fetchProgress = async (moduleId) => {
    try {
      const response = await axios.get(`http://68.178.175.207:8000/get_LMS_sdlc_weighted_percent_sum?module_id=${moduleId}`);
      const progressData = response.data;
      setModuleData(prevModuleData => {
        return prevModuleData.map(module => {
          if (module.module_id === moduleId) {
            return { ...module, completion: progressData[0].overall_percentage };
          }
          return module;
        });
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAccordionChange = async (moduleId) => {
    await fetchProgress(moduleId);
  };

  return (
    <div className="bars-main container">
      <div className="container">
        <div className="bars-container">
          <h1 className="pb-5">Modules <span className="Progress-heading">Progress Percentage  Tracker</span></h1>
          <Accordion defaultActiveKey="0" >
            {moduleData.map((module, index) => (
               console.log(module),
              <Accordion.Item key={index} eventKey={module.module_id} onClick={() => handleAccordionChange(module.module_id)}>
              <span>{module.module_name}</span> 
                <Accordion.Header >
                  <span className="percentage">{`${module.overall_percentage}%`}</span>
                  <div className="progress-bar">
                <div className="bar-container">
                  <div className="bar" style={{ width: `${module.overall_percentage}%`, backgroundColor: colors[index] }}> 
                  <span className="percentage2">{`${module.overall_percentage}%`}</span>
                  </div>
                </div>
              
              </div>
                </Accordion.Header>
                <Accordion.Body>
                
                  <Fullchart moduleId={module.module_id} moduleName={module.module_name} />
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
