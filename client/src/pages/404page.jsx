import NoContent from "../components/noConent";
import Sticker from "../components/sticker";

export default function ErrorPage() {
  document.title = "404 Page Not Found";
  return (
    <>
      <Sticker title="404" subtitle="Page Not Found" />
      <NoContent />
    </>
  );
}
