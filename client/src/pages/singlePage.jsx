import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { singleReviewRoute, singleReviewBySlugRoute } from "../api_routes";
import SingleProduct from "../components/singleProduct";
import Sticker from "../components/sticker";

export default function SinglePage() {
  document.title = "Review";

  const { slug } = useParams(); // Changed from id to slug

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async (slug) => {
      try {
        setLoading(true);
        setError(null);
        
        // Try the new GET endpoint first
        let response;
        try {
          response = await axios.get(`${singleReviewBySlugRoute}/${slug}`);
        } catch (err) {
          // Fallback to the old POST endpoint for backward compatibility
          response = await axios.post(singleReviewRoute, { slug });
        }
        
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
        setError("Review not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchReview(slug);
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
