import React, { useState, useEffect } from "react";

const AppNavbar = (props) => {
  const { navtitle } = props;
  return (
    <div className="app_navbar">
      <font className="navtitle">{navtitle}</font>
    </div>
  );
};

export default AppNavbar;
