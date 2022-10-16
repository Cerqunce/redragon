import SingleProduct from "../components/singleProduct";
import Sticker from "../components/sticker";

export default function SinglePage() {
  document.title = "Review";

  return (
    <>
      <Sticker title="Single Article" subtitle="read the details" />
      <SingleProduct />
    </>
  );
}
