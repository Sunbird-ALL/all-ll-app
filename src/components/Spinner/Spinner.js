import React from "react";

//custom
import "./Spinner.css";

function Spinner() {
  const styles = {
    display: "none",
  };
  return (
    <React.Fragment>
      <div id="loadingmsg" style={styles}>
        <div className="loader"></div>
        <div id="progresspercentage"></div>
      </div>
      <div id="loadingover" style={styles}></div>
    </React.Fragment>
  );
}

export default Spinner;
