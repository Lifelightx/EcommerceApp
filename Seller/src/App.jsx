import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SellerDashboard from './pages/Dashborad';
import { StoreContext } from './ContextApi';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import ProfilePage from './pages/Profile';

function App() {
  // ProtectedRoute using context
  const ProtectedRoute = () => {
    const { user } = useContext(StoreContext); // check user from context
    if (user === undefined) return <>Loading...</>; // optional loading state
    return user ? <Outlet /> : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ Seller Navbar with login/signup */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path='/products' element={<Products/>}/>
          <Route path='/add-product' element={<AddProduct/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path='/profile' element={<ProfilePage/>}/>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
