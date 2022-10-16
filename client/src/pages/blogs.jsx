import { useContext } from "react";
import BlogsList from "../components/blogsList";
import Sticker from "../components/sticker";
import { ActivePageContext } from "../context/ActivePageContext";

export default function Blogs() {
  document.title = "All Reviews";
  const { activePage, setActivePage } = useContext(ActivePageContext);
  setActivePage("blogs");

  return (
    <>
      <Sticker title="Reviews" subtitle="All" />
      <BlogsList />
    </>
  );
}
