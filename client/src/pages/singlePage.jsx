import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { singleReviewRoute } from "../api_routes";
import SingleProduct from "../components/singleProduct";
import Sticker from "../components/sticker";

export default function SinglePage() {
  document.title = "Review";

  const { id } = useParams();

  const [review, setReview] = useState(null);

  useEffect(() => {
    const review = async (id) => {
      const response = await axios.post(singleReviewRoute, { id });
      setReview(response.data);
    };
    review(id);
  }, [id]);

  return (
    <>
      <Sticker
        title={review ? review.title : ""}
        subtitle={review ? review.type : ""}
        image={review ? review.image : ""}
      />
      <SingleProduct review={review} />
    </>
  );
}
