import { useContext, useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home';
import { Navigate, Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { StoreContext } from './ContextApi';
import Payment from './pages/Payment'
import Product from './pages/Product'
import ProductListing from './pages/Product';
import CategoryShowcase from './pages/Category';
import ProductDetails from './pages/Details';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import DeveloperFallbackPage from './pages/Fallback';
import VerifyPayment from './pages/Verify';
import UserOrders from './pages/Orders';
import ProfilePage from './pages/Profile';
function App() {
  const ProtectedRoute = () => {
      const { user } = useContext(StoreContext); // check user from context
      if (user === undefined) return <>Loading...</>; // optional loading state
      return user ? <Outlet /> : <DeveloperFallbackPage/>;
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
             <Route path="/cart" element={<CartPage />} />
             <Route path='/orders' element={<UserOrders />} />
             <Route path='/Payment' element={<Payment/>}/>
             <Route path='/Product' element={<Product/>}/>
             <Route path='/checkout' element={<Checkout/>}/>
             <Route path='/verify' element={<VerifyPayment/>} />
             <Route path='/profile' element={<ProfilePage/>} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
