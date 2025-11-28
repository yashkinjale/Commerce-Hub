// UpdateProduct.jsx - Enhanced with Framer Motion + Quantity Field
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import "./Product.css";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState(""); // ✅ NEW FIELD

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const params = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    getProduct();
  }, []);

  // Fetch existing product details
  const getProduct = async () => {
    try {
      let result = await fetch(`http://localhost:9000/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      result = await result.json();

      setName(result.name);
      setPrice(result.price);
      setCategory(result.category);
      setCompany(result.company);
      setQuantity(result.quantity); // ✅ NEW
    } catch (error) {
      setErrors({ submit: "Unable to load product. Try again." });
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Product name is required";

    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Enter a valid price";

    if (!category.trim()) newErrors.category = "Category is required";

    if (!company.trim()) newErrors.company = "Company is required";

    // ✅ Quantity validation
    if (quantity === "" || quantity === null || quantity === undefined) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(quantity) || Number(quantity) <= 0) {
      newErrors.quantity = "Enter a valid quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update product
  const updateData = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      let result = await fetch(`http://localhost:9000/product/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({ name, price, category, company, quantity }), // ✅ SEND QUANTITY
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (result.ok) {
        setSuccessMessage("Product updated successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErrors({ submit: data.message || "Failed to update product" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    switch (field) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "company":
        setCompany(value);
        break;
      case "quantity": // ✅ NEW HANDLE
        setQuantity(value);
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      updateData();
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="add-product-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="add-product-background">
        <div className="add-product-gradient-orb add-product-gradient-orb-1"></div>
        <div className="add-product-gradient-orb add-product-gradient-orb-2"></div>
      </div>

      <motion.div className="add-product-card" variants={cardVariants}>
        {/* Header */}
        <motion.div className="add-product-header" variants={itemVariants}>
          <div className="add-product-icon-wrapper">
            <svg className="add-product-icon" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4h2v16h-2zM4 11h16v2H4z"
              />
            </svg>
          </div>
          <h1 className="add-product-title">Update Product</h1>
          <p className="add-product-subtitle">
            Modify the product details and save changes
          </p>
        </motion.div>

        {/* Success Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="add-product-success-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <svg className="add-product-success-icon" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
              </svg>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              className="add-product-error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <svg className="add-product-error-icon" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01"
                />
              </svg>
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="add-product-form">
          {/* Name */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">Product Name *</label>
            <motion.input
              className={`add-product-input ${
                errors.name ? "add-product-input-error" : ""
              }`}
              type="text"
              value={name}
              placeholder="e.g., iPhone 15 Pro"
              onChange={(e) => handleInputChange("name", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="add-product-error-text">{errors.name}</span>
            )}
          </motion.div>

          {/* Price */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">Price *</label>
            <motion.input
              className={`add-product-input ${
                errors.price ? "add-product-input-error" : ""
              }`}
              type="number"
              value={price}
              placeholder="e.g., 999"
              onChange={(e) => handleInputChange("price", e.target.value)}
              disabled={isLoading}
            />
            {errors.price && (
              <span className="add-product-error-text">{errors.price}</span>
            )}
          </motion.div>

          {/* Quantity (NEW) */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">Quantity *</label>
            <motion.input
              className={`add-product-input ${
                errors.quantity ? "add-product-input-error" : ""
              }`}
              type="number"
              value={quantity}
              placeholder="e.g., 10"
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              disabled={isLoading}
            />
            {errors.quantity && (
              <span className="add-product-error-text">{errors.quantity}</span>
            )}
          </motion.div>

          {/* Category + Company (Two Column) */}
          <motion.div
            className="add-product-two-column"
            variants={itemVariants}
          >
            {/* Category */}
            <div className="add-product-form-group">
              <label className="add-product-label">Category *</label>
              <motion.input
                className={`add-product-input ${
                  errors.category ? "add-product-input-error" : ""
                }`}
                type="text"
                value={category}
                placeholder="e.g., Electronics"
                onChange={(e) => handleInputChange("category", e.target.value)}
                disabled={isLoading}
              />
              {errors.category && (
                <span className="add-product-error-text">
                  {errors.category}
                </span>
              )}
            </div>

            {/* Company */}
            <div className="add-product-form-group">
              <label className="add-product-label">Company *</label>
              <motion.input
                className={`add-product-input ${
                  errors.company ? "add-product-input-error" : ""
                }`}
                type="text"
                value={company}
                placeholder="e.g., Apple"
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={isLoading}
              />
              {errors.company && (
                <span className="add-product-error-text">{errors.company}</span>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            className="add-product-submit-btn"
            onClick={updateData}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <span className="add-product-loading-content">
                <svg className="add-product-spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
                </svg>
                Updating...
              </span>
            ) : (
              <span className="add-product-btn-content">
                <svg className="add-product-btn-icon" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 4h2v16h-2z"
                  />
                </svg>
                Update Product
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProduct;
