import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const StarRating = ({ max = 5 }) => {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);

  const displayStar = (i) => {
    if (hover > 0) {
      return hover >= i + 1;
    } else {
      return selected >= i + 1;
    }
  };

  return (
    <div className="star-rating-container">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setSelected(i + 1)}
        >
          {displayStar(i) ? (
            <AiFillStar className="star" />
          ) : (
            <AiOutlineStar className="star" />
          )}
        </span>
      ))}
      <p>{hover !== 0 ? hover : selected}</p>
    </div>
  );
};

export default StarRating;
