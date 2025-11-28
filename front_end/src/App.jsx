import React from "react";
import Nav from "./components/nav.jsx";
import Footer from "./components/footer.jsx";
import SignUp from "./components/signUp.jsx";
import Privatecomponent from "./components/privatecomponent.jsx";
import Login from "./components/login.jsx";
import Product from "./components/Product.jsx";
import ProductsList from "./components/ProductsList.jsx";
import UpdateProduct from "./components/UpdateProduct.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserProfile.jsx";

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Nav />

        <div className="main-content">
          <Routes>
            <Route element={<Privatecomponent />}>
              <Route path="/" element={<ProductsList />} />
              <Route path="/add" element={<Product />} />
              <Route path="/update/:id" element={<UpdateProduct />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/logout" element={<h1>Log Out</h1>} />
            </Route>

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
