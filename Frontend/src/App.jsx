import { useContext, useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home';
import { Navigate, Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { StoreContext } from './ContextApi';
import Cart from './pages/Cart'
import Order from './pages/Order'
import Payment from './pages/Payment'
import Product from './pages/Product'
import ProductListing from './pages/Product';
import CategoryShowcase from './pages/Category';
import ProductDetails from './pages/Details';
function App() {
  const ProtectedRoute = () => {
      const { user } = useContext(StoreContext); // check user from context
      if (user === undefined) return <>Loading...</>; // optional loading state
      return user ? <Outlet /> : <Navigate to="/" replace />;
    };
  
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path='/shop' element={<ProductListing/>}/>
        <Route path='/categories' element={<CategoryShowcase/>}/>
        <Route path='/details/:id' element={<ProductDetails/>}/>
        {/* All Protected */}
        <Route element={<ProtectedRoute />}>
             <Route path="/cart" element={<Cart />} />
             <Route path='/order' element={<Order />} />
             <Route path='/Payment' element={<Payment/>}/>
             <Route path='/Product' element={<Product/>}/>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
