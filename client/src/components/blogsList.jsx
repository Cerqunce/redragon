import Pagination from "./pagination";
import ReviewCard from "./ReviewCard.";

export default function BlogsList({ reviews }) {
  return (
    <div className="latest-news mt-150 mb-150">
      <div className="container">
        <div className="row">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              id={review.id}
              img={review.image}
              title={review.title}
              desc={review.summary}
              date={review.updatedAt}
            />
          ))}
        </div>

        <Pagination />
      </div>
    </div>
  );
}
