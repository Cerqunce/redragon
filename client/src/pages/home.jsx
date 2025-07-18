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
    // Google AdSense Ad Blocking Recovery script injection
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = "https://fundingchoicesmessages.google.com/i/pub-2102035845496652?ers=1";
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `(
      function() {
        function signalGooglefcPresent() {
          if (!window.frames['googlefcPresent']) {
            if (document.body) {
              const iframe = document.createElement('iframe');
              iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
              iframe.style.display = 'none';
              iframe.name = 'googlefcPresent';
              document.body.appendChild(iframe);
            } else {
              setTimeout(signalGooglefcPresent, 0);
            }
          }
        }
        signalGooglefcPresent();
      }
    )();`;
    document.body.appendChild(script2);

    // Clean up scripts on unmount
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

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
