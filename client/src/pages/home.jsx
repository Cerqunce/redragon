import Hero from "../components/Hero";
import axios from "axios";
import { useContext, useEffect } from "react";
import { getAllReviewsRoute } from "../api_routes";
import { ActivePageContext } from "../context/ActivePageContext";
import BlogsList from "../components/blogsList";
import { useState } from "react";
import Preloader from "../components/preloader";

export default function Home() {
  const { setActivePage } = useContext(ActivePageContext);

  const [reviews, setReviews] = useState(null);

  setActivePage("home");

  document.title = "Redragon | Keyboards, Mice, and more - Reviews Site";

  useEffect(() => {
    const getBlogs = async () => {
      const response = await axios.get(getAllReviewsRoute);
      setReviews(response.data);
    };
    getBlogs();
  }, []);
  if (reviews) {
    return (
      <>
        <Hero
          title="Redragon"
          subtitle=""
          image={reviews.length > 0 ? reviews[0].image : ""}
        />
        <BlogsList reviews={reviews} />
      </>
    );
  } else {
    return <Preloader />;
  }
}
