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
          title=""
          subtitle=""
          image="url(https://media.discordapp.net/attachments/1000595849077870612/1033447344487796888/redragon_wallpapaers_2.png)"
        />
        <BlogsList reviews={reviews} />
      </>
    );
  } else {
    return <Preloader />;
  }
}
