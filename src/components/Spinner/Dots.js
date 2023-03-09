import React from 'react';

//custom
import './Dots.css';

function Dots() {
  const styles = {
    display: 'none',
  };
  return (
    <React.Fragment>
      <div id="loadingmsg" style={styles}>
        <div id="blue" className="dot"></div>
        <div id="red" className="dot"></div>
        <div id="yellow" className="dot"></div>
        <div id="green" className="dot"></div>
        <div id="progresspercentage"></div>
      </div>
      <div id="loadingover" style={styles}></div>
    </React.Fragment>
  );
}

export default Dots;
