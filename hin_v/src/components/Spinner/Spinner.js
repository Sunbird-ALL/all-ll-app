import React from 'react';

//custom
import './Spinner.css';

function Spinner() {
  const styles = {
    display: 'none',
  };
  return (
    <React.Fragment>
      <div id="loadingmsg1" style={styles}>
        <div className="loader"></div>
        <div id="progresspercentage1"></div>
      </div>
      <div id="loadingover1" style={styles}></div>
    </React.Fragment>
  );
}

export default Spinner;
