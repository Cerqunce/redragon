import Hero from "../components/Hero";
import axios from "axios";
import { useContext, useEffect } from "react";
import { getAllBlogsRoute } from "../api_routes";
import { ActivePageContext } from "../context/ActivePageContext";

export default function Home() {
  useEffect(() => {
    const getBlogs = async () => {
      const response = await axios.get(getAllBlogsRoute);
      console.log(response.data);
    };
    getBlogs();
  }, []);

  const {activePage, setActivePage} = useContext(ActivePageContext);
  setActivePage("home");

  return (
    <>
      <Hero />
      {/* <BlogsList /> */}
    </>
  );
}
