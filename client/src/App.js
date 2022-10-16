import { Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import ErrorPage from "./pages/404page";
import Home from "./pages/home";
import Blogs from "./pages/blogs";
import SinglePage from "./pages/singlePage";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="reviews" element={<Blogs />} />
        <Route path="reviews/:id" element={<SinglePage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
