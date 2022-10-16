import BlogsList from "../components/blogsList";
import Hero from "../components/Hero";
import axios from "axios";
import { useEffect } from "react";
import { getAllBlogsRoute } from "../api_routes";

export default function Home() {
  useEffect(() => {
    const getBlogs = async () => {
      const response = await axios.get(getAllBlogsRoute);
      console.log(response.data);
    };
    getBlogs();
  }, []);

  return (
    <>
      <Hero />
      {/* <BlogsList /> */}
    </>
  );
}
