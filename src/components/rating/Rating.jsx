import React from "react";
import "./rating.scss";
const getRating = (reviews) => {
  let sum = 0;
  if (reviews !== undefined) {
    reviews.map((review) => {
      sum += review.rating;
    });
    return sum / reviews.length;
  }
  return 0;
};

const Rating = (props) => {
  const { reviews, caption } = props;
  const rating = props.rating || getRating(reviews);
  let numReviews = 0;
  if (reviews !== undefined) {
    numReviews = reviews.length;
  }
  return (
    <div>
      <div className="rating">
        <span>
          <i
            className={
              rating >= 1
                ? "fas fa-star"
                : rating >= 0.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star"
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 2
                ? "fas fa-star"
                : rating >= 1.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star"
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 3
                ? "fas fa-star"
                : rating >= 2.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star"
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 4
                ? "fas fa-star"
                : rating >= 3.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star"
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 5
                ? "fas fa-star"
                : rating >= 4.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star"
            }
          />
        </span>
        {caption ? (
          <span> {caption} </span>
        ) : (
          <span> {" " + numReviews + " reviews"} </span>
        )}
      </div>
    </div>
  );
};

export default Rating;
