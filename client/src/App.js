import { Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import ErrorPage from "./pages/404page";
import Home from "./pages/home";
import Blogs from "./pages/blogs";
import SinglePage from "./pages/singlePage";
import Login from "./pages/login/index.jsx";
import { ActivePageContext } from "./context/ActivePageContext";
import { useState } from "react";


function App() {
  const [activePage, setActivePage] = useState(null);
  return (
    <ActivePageContext.Provider value={{activePage, setActivePage}}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="reviews"
          element={
            <>
              <Header />
              <Blogs />
              <Footer />
            </>
          }
        />
        <Route
          path="reviews/:id"
          element={
            <>
              <Header />
              <SinglePage />
              <Footer />
            </>
          }
        />

        <Route
          path="*"
          element={
            <>
              <Header />
              <ErrorPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </ActivePageContext.Provider>
  );
}

export default App;
