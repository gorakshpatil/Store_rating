import React, { useState } from 'react';

const StarRating = ({ value, onChange, readOnly = false, size = 20 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: size,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#fbbf24' : '#374151',
            transition: 'color 0.15s, transform 0.1s',
            transform: !readOnly && hover >= star ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
