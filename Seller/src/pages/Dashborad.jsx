import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../ContextApi"; // adjust path
import { BarChart2, Package, ShoppingBag, DollarSign } from "lucide-react";

const SellerDashboard = () => {
  const { url, sellerToken } = useContext(StoreContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/sellers/dashboard`, {
          headers: { Authorization: `Bearer ${sellerToken}` },
        });
        setDashboard(res.data.dashboard);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (sellerToken) fetchDashboard();
  }, [url, sellerToken]);

  if (loading) return <p className="text-center py-10">Loading dashboard...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!dashboard) return null;

  const { totalProducts, totalOrders, totalRevenue, orderStats } = dashboard;

  return (
    <div className="container mx-auto px-4 py-13">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
          <ShoppingBag className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
          <DollarSign className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Order Status Stats */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(orderStats).map(([status, count]) => (
            <div
              key={status}
              className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <p className="capitalize">{status}</p>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
