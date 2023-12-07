import React, { useState } from 'react';
import './Tabs.css';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = index => {
    setActiveTab(index);
  };

  const renderTabs = () => {
    const tabs = ['Discover', 'Validate', 'Practice'];

    return tabs.map((tab, index) => (
      <div className="tab-container">
        <a
          key={index}
          href="#"
          className={`tab ${index + 1 === activeTab ? 'active' : ''}`}
          onClick={e => {
            e.preventDefault();
            handleTabClick(index + 1);
          }}
        >
          {tab}
        </a>
      </div>
    ));
  };

  return <div className="tabs">{renderTabs()}</div>;
};

export default Tabs;
