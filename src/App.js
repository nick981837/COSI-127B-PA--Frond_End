import "./App.css";
import React, { useState } from "react";
import ForestContainer from "./components/ForestContainer";
import ButtonAppBar from "./components/AppsBar";
import WorkerContainer from "./components/WorkerContainer";
import SensorContainer from "./components/SensorContainer";
import Box from "@mui/material/Box";
import CoverageContainer from "./components/CoverageContainer";
import StateContainer from "./components/StateContainer";
import ReportContainer from "./components/ReportContainer";

function App() {
  const [formType, setFormType] = useState("");

  const getType = (type) => {
    console.log(type);
    setFormType(type);
  };
  return (
    <div>
      <ButtonAppBar sendData={getType}></ButtonAppBar>
      {formType === "Forest" ? <ForestContainer></ForestContainer> : null}
      {formType === "Worker" ? <WorkerContainer></WorkerContainer> : null}
      {formType === "Sensor" ? <SensorContainer></SensorContainer> : null}
      {formType === "Coverage" ? <CoverageContainer></CoverageContainer> : null}
      {formType === "State" ? <StateContainer></StateContainer> : null}
      {formType === "Report" ? <ReportContainer></ReportContainer> : null}
      {formType === "" ? (
        <Box
          component="img"
          className="image"
          alt="The house from the offer."
          src="/forest1.jpg"
        />
      ) : null}
      {formType === "" ? (
        <div class="title1">US Forest Prototype System</div>
      ) : null}
    </div>
  );
}

export default App;
