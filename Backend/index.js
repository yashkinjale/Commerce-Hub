const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
require("./db/config");
const users = require("./db/users");
const Product = require("./db/Product");
const Jwt = require("jsonwebtoken");
const secretKey = "Ecomm";

app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, secretKey, (err, valid) => {
      if (err) {
        res.status(401).send("invalid token");
      } else {
        req.userId = valid.user?._id || valid.result?._id;
        next();
      }
    });
  } else {
    res.status(401).send("no token found");
  }
};

app.post("/signup", async (req, res) => {
  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new users({
      ...req.body,
      password: hashedPassword
    });
    
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    
    Jwt.sign({ result }, secretKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        res.status(500).send("Something went wrong!!");
      } else {
        res.send({ result, auth: token });
      }
    });
  } catch (error) {
    res.status(500).send("Error during registration");
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      // Find user with password included
      let user = await users.findOne({ email: req.body.email });
      
      if (user) {
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (isPasswordValid) {
          // Remove password from response
          user = user.toObject();
          delete user.password;
          
          Jwt.sign({ user }, secretKey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
              return res.status(500).send({ error: "Token generation failed" });
            }
            res.send({ user, auth: token });
          });
        } else {
          res.status(401).send({ error: "Invalid credentials" });
        }
      } else {
        res.status(401).send({ error: "Invalid credentials" });
      }
    } else {
      res.status(400).send({ error: "Email and password required" });
    }
  } catch (error) {
    res.status(500).send({ error: "Login failed" });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await users.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const totalProducts = await Product.countDocuments({ user_id: userId });
    const recentProducts = await Product.find({ user_id: userId })
      .sort({ _id: -1 })
      .limit(3)
      .select("name");

    const profileData = {
      name: user.name,
      email: user.email,
      accountCreated: user._id.getTimestamp().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      totalProducts: totalProducts,
      recentProducts: recentProducts.map((p) => ({ id: p._id, name: p.name })),
    };

    res.send(profileData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).send("Error fetching profile data");
  }
});

app.put("/profile/username", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).send("Username cannot be empty");
    }

    const result = await users.updateOne(
      { _id: userId },
      { $set: { name: name.trim() } }
    );

    if (result.modifiedCount > 0) {
      const updatedUser = await users.findById(userId).select("-password");
      res.send({ success: true, user: updatedUser });
    } else {
      res.status(400).send("Failed to update username");
    }
  } catch (error) {
    res.status(500).send("Error updating username");
  }
});

app.post("/add-product", verifyToken, async (req, res) => {
  let productData = { ...req.body, user_id: req.userId };
  let product = new Product(productData);
  let result = await product.save();
  res.send(result);
});

app.get("/", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length == 0) {
    res.send("No products found");
  } else {
    res.send(products);
  }
});

app.delete("/product/:_id", verifyToken, async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params._id });
  res.send(result);
});

app.get("/product/:_id", verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params._id });
  res.send(result);
});

app.put("/product/:_id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params._id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", verifyToken, async (req, res) => {
  let products = await Product.find({
    $or: [
      { name: { $regex: req.params.key, $options: "i" } },
      { category: { $regex: req.params.key, $options: "i" } },
      { company: { $regex: req.params.key, $options: "i" } },
    ],
  });
  if (products.length == 0) {
    res.send("No products found");
  } else {
    res.send(products);
  }
});

app.listen(9000, () => {
  console.log("Server running on port 9000");
});