// ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./ProductsList.css";

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" });
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const token = JSON.parse(localStorage.getItem("token"));

  const getProducts = async () => {
    setLoading(true);
    setError("");
    
    try {
      let result = await fetch("http://localhost:9000/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error("Failed to fetch products");
      }

      result = await result.json();
      setProducts(result);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePr = async (id) => {
    try {
      let result = await fetch(`http://localhost:9000/product/${id}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error("Failed to delete product");
      }

      result = await result.json();
      setDeleteModal({ show: false, id: null, name: "" });
      getProducts();
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error(err);
    }
  };

  const updatecomp = (id) => {
    navigate(`/update/${id}`);
  };

  const search = async () => {
    if (!searchkey.trim()) {
      getProducts();
      return;
    }

    setSearchLoading(true);
    setError("");

    try {
      let result = await fetch(`http://localhost:9000/search/${searchkey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error("Search failed");
      }

      result = await result.json();
      setProducts(result);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const clearSearch = () => {
    setSearchkey("");
    getProducts();
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, name: "" });
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="products-container"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="products-header"
        >
          <div className="header-content">
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Manage your product inventory</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="add-product-btn"
            onClick={() => navigate("/add")}
          >
            <span className="btn-icon">+</span>
            Add Product
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="search-container"
        >
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, category, or company..."
              onChange={(e) => setSearchkey(e.target.value)}
              onKeyPress={handleKeyPress}
              value={searchkey}
            />
            <AnimatePresence>
              {searchkey && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={search}
            className="search-btn"
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search"}
          </motion.button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-message"
            >
              <span className="error-icon">⚠️</span>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-container"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="loading-spinner"
            >
              ⏳
            </motion.div>
            <p className="loading-text">Loading products...</p>
          </motion.div>
        ) : products.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="empty-state"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="empty-icon"
            >
              📦
            </motion.div>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-subtitle">
              {searchkey 
                ? "Try adjusting your search criteria" 
                : "Get started by adding your first product"}
            </p>
            {!searchkey && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="empty-action-btn"
                onClick={() => navigate("/add")}
              >
                Add Your First Product
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* Products Table */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="table-container"
          >
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      custom={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <td>
                        <span className="serial-number">{index + 1}</span>
                      </td>
                      <td>
                        <span className="product-name">{item.name}</span>
                      </td>
                      <td>
                        <span className="product-price">Rs. {item.price}</span>
                      </td>
                      <td>
                        <span className="product-quantity">{item.quantity || 0}</span>
                      </td>
                      <td>
                        <span className="product-category">{item.category}</span>
                      </td>
                      <td>
                        <span className="product-company">{item.company}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="action-btn edit-btn"
                            onClick={() => updatecomp(item._id)}
                          >
                            <span className="btn-icon">✏️</span>
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="action-btn delete-btn"
                            onClick={() => openDeleteModal(item._id, item.name)}
                          >
                            <span className="btn-icon">🗑️</span>
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={closeDeleteModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">Confirm Delete</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="modal-close-btn"
                    onClick={closeDeleteModal}
                  >
                    ✕
                  </motion.button>
                </div>
                <div className="modal-body">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="modal-icon warning"
                  >
                    ⚠️
                  </motion.div>
                  <p className="modal-message">
                    Are you sure you want to delete <strong>"{deleteModal.name}"</strong>?
                  </p>
                  <p className="modal-warning">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="modal-btn cancel-btn"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="modal-btn confirm-btn"
                    onClick={() => deletePr(deleteModal.id)}
                  >
                    Delete Product
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProductsList;