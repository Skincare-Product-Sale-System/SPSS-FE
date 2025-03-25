"use client";
import React from "react";

export default function CompareSpecifications({ 
  title, 
  items, 
  renderValue 
}) {
  // Dynamically generate grid template based on items count
  const gridTemplateColumns = `auto repeat(${items.length}, minmax(0, 1fr))`;
  
  return (
    <div 
      className="grid gap-4 tf-compare-row"
      style={{ gridTemplateColumns }}
    >
      <div 
        className="d-md-block d-none tf-compare-col tf-compare-field"
        style={{ 
          position: 'sticky', 
          left: 0, 
          zIndex: 2,
          backgroundColor: '#fff',
          boxShadow: '4px 0 8px rgba(0,0,0,0.05)'
        }}
      >
        <h6>{title}</h6>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderValue(item)}
        </React.Fragment>
      ))}
    </div>
  );
} 