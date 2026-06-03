import React from 'react';

const AccordionPanel = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="panel">
      <div className="panel-header" onClick={onToggle}>
        <span>{title}</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && <div className="panel-body">{children}</div>}
    </div>
  );
};

export default AccordionPanel;