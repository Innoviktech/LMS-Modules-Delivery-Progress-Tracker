import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProgressBar.css";
import Fullchart from "./explainChart";
import { Accordion } from "react-bootstrap";

const ProgressBar = () => {
  const [moduleData, setModuleData] = useState([]);
  const [colors, setColors] = useState([]);

  const fetchInitialData = async () => {
    try {
      const response = await axios.get("http://68.178.175.207:8000/get_LMS_all_modules_list");
      const initialModuleData = response.data.map(module => ({ ...module, completion: 0 }));
      setModuleData(initialModuleData);
      generateColors(initialModuleData.length);
    } catch (error) {
      console.error("Error fetching module data:", error);
    }
  };

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  const generateColors = (numberOfColors) => {
    const generatedColors = [];
    for (let i = 0; i < numberOfColors; i++) {
      generatedColors.push(generateRandomColor());
    }
    setColors(generatedColors);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getStatusColor = (status) => {
    const index = moduleData.findIndex(module => module.remarks === status);
    if (index !== -1) {
      return colors[index % colors.length];
    } else {
      return "black"; // Default color
    }
  };
 


  return (
    <div className="bars-main container">
      <div className="container">
        <div className="bars-container">
          <h1 className="pb-5">Modules <span className="Progress-heading">Progress Percentage  Tracker</span></h1>
          <Accordion defaultActiveKey="0">
            {moduleData.map((module, index) => (
              <Accordion.Item key={index} eventKey={module.module_id}>
                <span>{module.module_name}</span>
                <Accordion.Header>
                  <span className="percentage">{`${module.overall_percentage}%`}</span>
                  <div className="progress-bar">
                    <div className="bar-container">
                      <div className="bar" style={{ width: `${module.overall_percentage}%`, backgroundColor: colors[index] }}>
                        {/* <span className="percentage2">{`${module.overall_percentage}%`}</span> */}
                      </div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>
                      <div className="fullchart-container">
                      <Fullchart moduleId={module.module_id} moduleName={module.module_name} colors={colors} />

                      </div>
                    </div>
                    {/* <div style={{ width: '30%', display: 'flex', alignItems: 'center' }}>
                     <strong style={{ marginRight: '15px'}}>Remarks Status:</strong> <span style={{ marginRight: '5px', backgroundColor: getStatusColor(module.remarks), width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                       {module.remarks ? module.remarks : "No remarks"}
                    </div> */}
                  </div>
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
