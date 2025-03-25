import React from "react";

export default function Rating({ number }) {
  // Convert to number and handle decimal values
  const rating = parseFloat(number) || 0;
  const fullStars = Math.floor(rating);
  // Ensure even small decimal values like 0.1 are detected
  const hasHalfStar = rating % 1 >= 0.01;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Style for consistent gold color
  const starStyle = {
    color: '#FFB800' // Gold/yellow color
  };

  return (
    <div className="rating mt-2">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="icon-star" style={starStyle} />
      ))}
      
      {/* Partial star - width is set exactly to the decimal percentage */}
      {hasHalfStar && (
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <i 
            className="icon-star" 
            style={{ ...starStyle, opacity: 0.25 }} 
          />
          <span 
            style={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              width: `${(rating % 1) * 100}%`, 
              overflow: 'hidden',
              display: 'inline-block'
            }}
          >
            <i className="icon-star" style={starStyle} />
          </span>
        </span>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <i 
          key={`empty-${i}`} 
          className="icon-star" 
          style={{ ...starStyle, opacity: 0.25 }} 
        />
      ))}
    </div>
  );
}
