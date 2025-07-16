import Hero from "../components/Hero";
import axios from "axios";
import { useContext, useEffect } from "react";
import { getAllReviewsRoute, getSiteSettingsRoute } from "../api_routes";
import { ActivePageContext } from "../context/ActivePageContext";
import BlogsList from "../components/blogsList";
import { useState } from "react";
import Preloader from "../components/preloader";

export default function Home() {
  const { setActivePage } = useContext(ActivePageContext);

  const [reviews, setReviews] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  setActivePage("home");

  document.title = "Redragon | Keyboards, Mice, and more - Reviews Site";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews and site settings in parallel
        const [reviewsResponse, settingsResponse] = await Promise.all([
          axios.get(getAllReviewsRoute),
          axios.get(getSiteSettingsRoute)
        ]);
        
        setReviews(reviewsResponse.data);
        setSiteSettings(settingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set default values if API calls fail
        setSiteSettings({
          title: "Redragon Reviews",
          subtitle: "Your trusted source for gaming gear reviews",
          heroImage: "assets/img/wallpaper.jpg"
        });
      }
    };
    
    fetchData();
  }, []);
  if (reviews && siteSettings) {
    return (
      <>
        <Hero
          title={siteSettings.title}
          subtitle={siteSettings.subtitle}
          image={siteSettings.heroImage}
        />
        <BlogsList reviews={reviews} />
      </>
    );
  } else {
    return <Preloader />;
  }
}
