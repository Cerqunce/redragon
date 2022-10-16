import { Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import ErrorPage from "./pages/404page";
import Home from "./pages/home";
import News from "./pages/news";
import SinglePage from "./pages/singlePage";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SinglePage />} />
        <Route path="reviews" element={<News />}>
          <Route path=":id" element={<Home />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />

      
    </>
  );
}

export default App;
