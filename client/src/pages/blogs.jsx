import BlogsList from "../components/blogsList";
import Sticker from "../components/sticker";

export default function Blogs() {
  document.title = "All Reviews";

  return (
    <>
      <Sticker title="Organic Information" subtitle="News Article" />
      <BlogsList />
    </>
  );
}
