// UserProfile.jsx - Fixed to work with existing Login
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    accountCreated: "",
    lastLogin: "",
    recentProducts: [],
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setDataLoading(true);
    try {
      // Get token - matching how Login stores it with JSON.stringify
      const token = JSON.parse(localStorage.getItem("token"));

      console.log("Token found:", token ? "Yes" : "No");

      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      // Fetch profile data from API
      const response = await fetch("http://localhost:9000/profile", {
        headers: {
          authorization: `bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();

        console.log("Profile data received:", data);

        setUsername(data.name || "");
        setEmail(data.email || "");

        // Get last login from localStorage
        const lastLogin =
          localStorage.getItem("lastLogin") ||
          new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

        setStats({
          totalProducts: data.totalProducts || 0,
          accountCreated: data.accountCreated || "",
          lastLogin: lastLogin,
          recentProducts: data.recentProducts || [],
        });
      } else {
        const errorText = await response.text();
        console.error("Profile API error:", errorText);
        setErrorMessage(`Failed to load profile: ${errorText}`);
        setTimeout(() => {
          setErrorMessage("");
          if (response.status === 401) {
            navigate("/login");
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setErrorMessage("Error connecting to server");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setLoading(true);

    try {
      // Get token - matching how Login stores it
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await fetch("http://localhost:9000/profile/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ name: username }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update localStorage with new user data
        const user = JSON.parse(localStorage.getItem("user"));
        user.name = data.user.name;
        localStorage.setItem("user", JSON.stringify(user));

        setLoading(false);
        setIsEditing(false);
        setSuccessMessage("Username updated successfully!");

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorText = await response.text();
        setLoading(false);
        setErrorMessage(errorText || "Failed to update username");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setLoading(false);
      setErrorMessage("Error connecting to server");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (dataLoading) {
    return (
      <div className="profile-page-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="profile-container"
          style={{ textAlign: "center", padding: "100px 20px" }}
        >
          <div
            className="loading-spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#666", fontSize: "18px" }}>Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="profile-container"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="profile-header"
        >
          <div className="profile-avatar">
            <motion.div whileHover={{ scale: 1.05 }} className="avatar-circle">
              {username.charAt(0).toUpperCase() || "U"}
            </motion.div>
          </div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="success-message"
            >
              <span className="success-icon">✓</span>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-message"
              style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "12px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid #fcc",
              }}
            >
              <span style={{ marginRight: "8px" }}>⚠</span>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Cards Grid */}
        <div className="profile-grid">
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="profile-card"
          >
            <div className="card-header">
              <h2 className="card-title">Personal Information</h2>
              <span className="card-icon">👤</span>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`form-input ${isEditing ? "editing" : ""}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                  />
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="edit-icon-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input readonly"
                  value={email}
                  readOnly
                />
                <span className="input-hint">Email cannot be changed</span>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="edit-actions"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      loadUserData();
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary"
                    onClick={handleUpdateUsername}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Account Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="profile-card"
          >
            <div className="card-header">
              <h2 className="card-title">Account Activity</h2>
              <span className="card-icon">📊</span>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">Account Created</span>
                <span className="info-value">{stats.accountCreated}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Login</span>
                <span className="info-value">{stats.lastLogin}</span>
              </div>
            </div>
          </motion.div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="profile-card stat-card"
          >
            <div className="card-header">
              <h2 className="card-title">Statistics</h2>
              <span className="card-icon">📈</span>
            </div>
            <div className="card-content">
              <motion.div whileHover={{ scale: 1.02 }} className="stat-box">
                <div className="stat-number">{stats.totalProducts}</div>
                <div className="stat-label">Total Products Added</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Recent Products Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="profile-card"
          >
            <div className="card-header">
              <h2 className="card-title">Recently Added Products</h2>
              <span className="card-icon">🛍️</span>
            </div>
            <div className="card-content">
              {stats.recentProducts.length > 0 ? (
                <div className="recent-products-list">
                  {stats.recentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="recent-product-item"
                    >
                      <span className="product-number">{index + 1}</span>
                      <span className="product-name">{product.name}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: "20px 0",
                  }}
                >
                  No products added yet
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="profile-actions"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-outline"
            onClick={() => navigate("/")}
          >
            <span className="btn-icon">📦</span>
            View Products
          </motion.button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
