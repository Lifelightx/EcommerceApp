import { useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'
import Auth from './Hooks/Auth'
import Home from './pages/Home';
import { Navigate, Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Cart from './pages/Cart'
import Order from './pages/Order'
import Payment from './pages/Payment'
import Product from './pages/Product'
function App() {
  const ProtectedRoute = () => {
  const isAuth = Auth();
  if(isAuth == null){
    return <>Lodding...</>
  }
  return isAuth ? <Outlet/> : <Navigate to="/" replace />;
}
console.log(Auth())
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

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
