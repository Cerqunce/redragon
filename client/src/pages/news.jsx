import NewsList from "../components/newsList";
import Sticker from "../components/sticker";

export default function News() {
  document.title = "All Reviews";

  return (
    <>
      <Sticker title="Organic Information" subtitle="News Article" />
      <NewsList />
    </>
  );
}
