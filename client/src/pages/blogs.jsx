import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllReviewsRoute } from "../api_routes";
import BlogsList from "../components/blogsList";
import Sticker from "../components/sticker";
import { ActivePageContext } from "../context/ActivePageContext";

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const { setActivePage } = useContext(ActivePageContext);
  setActivePage(filter);
  document.title = `All Reviews | ${filter}`;

  const [reviews, setReviews] = useState([]);
  console.log(filter);

  useEffect(() => {
    const getReviews = async () => {
      const response = await axios.post(getAllReviewsRoute, {
        filter: filter,
      });
      setReviews(response.data);
    };
    getReviews();
  }, [filter]);

  return (
    <>
      <Sticker title="Reviews" subtitle={filter} />
      <BlogsList reviews={reviews} />
    </>
  );
}
