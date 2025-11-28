// Product.jsx - Enhanced with Framer Motion
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Product.css";

const Product = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = "Please enter a valid price greater than 0";
    }

    if (!category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!company.trim()) {
      newErrors.company = "Company name is required";
    }
    if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const collectdata = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      const token = JSON.parse(localStorage.getItem("token"));

      const result = await fetch("http://localhost:9000/add-product", {
        method: "post",
        body: JSON.stringify({
          name,
          price,
          category,
          company,
          quantity,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (result.ok) {
        setSuccessMessage("Product added successfully!");
        // Clear form
        setName("");
        setPrice("");
        setCategory("");
        setCompany("");
        setQuantity("");
        setErrors({});

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ submit: data.message || "Failed to add product" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
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
      case "quantity":
        setQuantity(value);
        break;

      default:
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      collectdata();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="add-product-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="add-product-background">
        <div className="add-product-gradient-orb add-product-gradient-orb-1"></div>
        <div className="add-product-gradient-orb add-product-gradient-orb-2"></div>
      </div>

      <motion.div className="add-product-card" variants={cardVariants}>
        {/* Header */}
        <motion.div className="add-product-header" variants={itemVariants}>
          <div className="add-product-icon-wrapper">
            <svg
              className="add-product-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h1 className="add-product-title">Add New Product</h1>
          <p className="add-product-subtitle">
            Fill in the details to add a product to your inventory
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="add-product-success-banner"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="add-product-success-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Error */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              className="add-product-error-banner"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="add-product-error-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="add-product-form">
          {/* Product Name */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">
              <svg
                className="add-product-label-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Product Name
              <span className="add-product-required">*</span>
            </label>
            <motion.input
              className={`add-product-input ${
                errors.name ? "add-product-input-error" : ""
              }`}
              type="text"
              placeholder="e.g., iPhone 15 Pro"
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.span
                  className="add-product-error-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Product Price */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">
              <svg
                className="add-product-label-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Price
              <span className="add-product-required">*</span>
            </label>
            <motion.input
              className={`add-product-input ${
                errors.price ? "add-product-input-error" : ""
              }`}
              type="number"
              placeholder="e.g., 999.99"
              value={price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              step="0.01"
              min="0"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence>
              {errors.price && (
                <motion.span
                  className="add-product-error-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {errors.price}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Product Quantity */}
          <motion.div
            className="add-product-form-group"
            variants={itemVariants}
          >
            <label className="add-product-label">
              <svg
                className="add-product-label-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h18M3 12h18M3 21h18"
                />
              </svg>
              Quantity
              <span className="add-product-required">*</span>
            </label>

            <motion.input
              className={`add-product-input ${
                errors.quantity ? "add-product-input-error" : ""
              }`}
              type="number"
              placeholder="e.g., 10"
              value={quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              min="1"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />

            <AnimatePresence>
              {errors.quantity && (
                <motion.span
                  className="add-product-error-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {errors.quantity}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Two Column Layout for Category and Company */}
          <motion.div
            className="add-product-two-column"
            variants={itemVariants}
          >
            {/* Category */}
            <div className="add-product-form-group">
              <label className="add-product-label">
                <svg
                  className="add-product-label-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                Category
                <span className="add-product-required">*</span>
              </label>
              <motion.input
                className={`add-product-input ${
                  errors.category ? "add-product-input-error" : ""
                }`}
                type="text"
                placeholder="e.g., Electronics"
                value={category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.category && (
                  <motion.span
                    className="add-product-error-text"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {errors.category}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Company */}
            <div className="add-product-form-group">
              <label className="add-product-label">
                <svg
                  className="add-product-label-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Company
                <span className="add-product-required">*</span>
              </label>
              <motion.input
                className={`add-product-input ${
                  errors.company ? "add-product-input-error" : ""
                }`}
                type="text"
                placeholder="e.g., Apple"
                value={company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.company && (
                  <motion.span
                    className="add-product-error-text"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {errors.company}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={collectdata}
              disabled={isLoading}
              className="add-product-submit-btn"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <span className="add-product-loading-content">
                  <svg className="add-product-spinner" viewBox="0 0 24 24">
                    <circle
                      className="add-product-spinner-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="3"
                    />
                  </svg>
                  Adding Product...
                </span>
              ) : (
                <span className="add-product-btn-content">
                  <svg
                    className="add-product-btn-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Product
                </span>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div className="add-product-footer" variants={itemVariants}>
          <svg
            className="add-product-footer-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="add-product-footer-text">
            All fields marked with{" "}
            <span className="add-product-required">*</span> are required
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div className="add-product-tips" variants={itemVariants}>
          <h3 className="add-product-tips-title">Quick Tips</h3>
          <ul className="add-product-tips-list">
            <li className="add-product-tip-item">
              <svg
                className="add-product-tip-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Use descriptive product names for better searchability
            </li>
            <li className="add-product-tip-item">
              <svg
                className="add-product-tip-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Enter accurate pricing to avoid confusion
            </li>
            <li className="add-product-tip-item">
              <svg
                className="add-product-tip-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Categorize products properly for easy management
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Product;
