import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../ContextApi"; // adjust path as needed

function Products() {
  const { url, sellerToken } = useContext(StoreContext);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);

  // fetch products
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/products`, {
        params: { page, limit: 6 }, // limit per page
        headers: {
          Authorization: `Bearer ${sellerToken}`, // 🔑 send token here
        },
      });

      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    if (sellerToken) {
      fetchProducts(1);
    }
  }, [sellerToken]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.category?.name}</p>
                <p className="text-sm text-gray-500">
                  Seller: {product.seller?.name} ({product.seller?.email})
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => fetchProducts(pagination.currentPage - 1)}
              className={`px-4 py-2 rounded ${
                pagination.hasPrev
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Prev
            </button>

            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNext}
              onClick={() => fetchProducts(pagination.currentPage + 1)}
              className={`px-4 py-2 rounded ${
                pagination.hasNext
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
