<<<<<<< HEAD
# Commerce Hub

A full-stack web application with authentication and CRUD operations, built as part of a Frontend Developer Intern assignment.

## 🚀 Tech Stack

**Frontend:**
- React.js
- Framer Motion (animations)
- Axios (API calls)
- React Router (protected routes)

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- bcrypt (Password hashing)

## ✨ Features

### Authentication
- User registration with name, email, and password
- Secure login with JWT token-based authentication
- Password hashing using bcrypt (10 salt rounds)
- Protected routes requiring authentication
- JWT tokens stored in localStorage
- Token expiration (2 hours)
- Logout functionality

### Product Management (CRUD Operations)
- **Create:** Add new products with details (name, price, quantity, category, company)
- **Read:** View all products in the system
- **Update:** Edit existing product information
- **Delete:** Remove products from the database with confirmation modal
- **Search:** Real-time search and filter products by name, category, or company

### User Profile
- View user profile information
- Update username
- Display account statistics:
  - Account creation date (extracted from MongoDB ObjectId)
  - Last login timestamp (managed via frontend state)
  - Total products added by the user
  - Recent 3 products added by the user

### UI/UX Features
- Smooth animations using Framer Motion
- Responsive design
- Loading states and error handling
- Delete confirmation modals
- Empty state illustrations
- Search with clear functionality
- Real-time form validation

## 📋 Database Schema

### Product Schema
```javascript
{
  name: String,
  price: String,
  quantity: Number,
  category: String,
  company: String,
  user_id: String  // Links product to the user who created it
}
```

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String  // Hashed with bcrypt
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install express cors mongoose jsonwebtoken bcrypt

# Create db/config.js with MongoDB connection
# Example:
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ecommerce");

# Start the server
node index.js
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will run on:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:9000`

## 🔐 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt with 10 salt rounds before storage
- **JWT Authentication:** Secure token-based authentication system with 2-hour expiration
- **Protected Routes:** All product and profile endpoints require valid JWT token
- **Authorization Header:** Token sent via Bearer authentication
- **Password Exclusion:** Passwords never sent in API responses (`.select("-password")`)
- **Error Handling:** Comprehensive try-catch blocks with appropriate status codes
- **Input Validation:** Server-side validation on all endpoints

## 📡 API Endpoints

### Authentication
- `POST /signup` - User registration with hashed password
- `POST /login` - User login with password verification

### Products (All Protected)
- `GET /` - Get all products
- `POST /add-product` - Add new product (auto-assigns user_id)
- `GET /product/:_id` - Get single product by ID
- `PUT /product/:_id` - Update product
- `DELETE /product/:_id` - Delete product
- `GET /search/:key` - Search products by name, category, or company (case-insensitive regex)

### User Profile (All Protected)
- `GET /profile` - Get user profile with stats (name, email, account creation date, total products, recent 3 products)
- `PUT /profile/username` - Update username

### Protected Route Implementation
All protected endpoints use `verifyToken` middleware:
```javascript
Authorization: Bearer <JWT_TOKEN>
```

## 🎯 Assignment Requirements Met

✅ **Frontend Development**
- Built with React.js
- Responsive design with smooth animations
- Form validation (client + server side)
- Protected routes implementation
- Modern UI with Framer Motion

✅ **Backend Development**
- Node.js/Express backend
- JWT-based authentication
- CRUD operations on products entity
- MongoDB database integration
- RESTful API design

✅ **Dashboard Features**
- User profile display with statistics
- CRUD operations on products
- Search and filter UI with real-time results
- Logout flow
- Delete confirmation modals

✅ **Security & Scalability**
- Password hashing with bcrypt (10 salt rounds)
- JWT authentication middleware
- Comprehensive error handling and validation
- Modular code structure with separate route handlers
- Token expiration management

## 📈 Scalability Considerations

### Current Implementation
- Modular backend with middleware architecture
- JWT-based stateless authentication
- MongoDB for flexible schema management
- Component-based React architecture with reusable components
- Framer Motion for performant animations

### Production-Ready Improvements

**Backend Scaling:**
1. **Authentication Enhancement:**
   - Implement refresh token mechanism for better security
   - Move JWT secret to environment variables
   - Add token blacklisting for logout
   - Implement rate limiting (express-rate-limit)

2. **Database Optimization:**
   - Add indexes on frequently queried fields (email, user_id)
   - Implement database connection pooling
   - Add pagination for product listings
   - Consider MongoDB Atlas for cloud hosting

3. **API Improvements:**
   - Add API versioning (/api/v1/)
   - Implement request validation middleware (Joi/express-validator)
   - Add comprehensive logging (Winston/Morgan)
   - Implement proper error middleware

4. **Security Enhancements:**
   - Use environment variables (.env) for secrets
   - Implement helmet.js for security headers
   - Add input sanitization (express-mongo-sanitize)
   - Configure CORS properly for production domains
   - Move to httpOnly cookies instead of localStorage

**Frontend Scaling:**
1. **State Management:**
   - Implement Redux or Context API for global state
   - Use React Query for server state management
   - Add optimistic updates for better UX

2. **Performance:**
   - Implement code splitting and lazy loading
   - Add React.memo for expensive components
   - Optimize bundle size with tree shaking
   - Add service workers for offline functionality

3. **UI/UX:**
   - Add proper loading skeletons
   - Implement error boundaries
   - Add toast notifications (react-toastify)
   - Improve accessibility (ARIA labels)

**DevOps:**
1. Dockerize the application (separate containers for frontend, backend, MongoDB)
2. Set up CI/CD pipeline (GitHub Actions)
3. Implement automated testing (Jest, React Testing Library, Supertest)
4. Add monitoring and logging (PM2, Sentry)
5. Use reverse proxy (Nginx) for production

**Horizontal Scaling:**
- Load balancing across multiple backend instances
- Redis for session management and caching
- CDN for static assets
- Database sharding for large datasets

## 🤝 Contributing

This project was built as an assignment for a Frontend Developer Intern position. The codebase demonstrates:
- Clean, maintainable code structure
- Security best practices (bcrypt, JWT, input validation)
- Full-stack integration capabilities
- Modern UI/UX with animations
- Scalability potential

## 📝 Development Notes

### Key Implementation Details:
- **Account Creation Date:** Extracted from MongoDB ObjectId timestamp (no separate field needed)
- **Last Login:** Managed via frontend localStorage/state
- **Token Storage:** JWT stored in localStorage (consider httpOnly cookies for production)
- **Password Security:** bcrypt with 10 salt rounds (industry standard)
- **Search:** Case-insensitive regex matching on name, category, and company fields

### Project Structure:
```
project/
├── backend/
│   ├── db/
│   │   ├── config.js      # MongoDB connection
│   │   ├── users.js       # User model
│   │   └── Product.js     # Product model
│   ├── index.js           # Main server file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── ProductsList.jsx
    │   └── ...
    └── package.json
```

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure MongoDB is running
- Check if port 9000 is available
- Verify all dependencies are installed (`npm install`)

**Frontend can't connect:**
- Ensure backend is running on port 9000
- Check CORS configuration
- Verify token is being sent in Authorization header

**Authentication errors:**
- Check if JWT secret matches between signup/login
- Verify token hasn't expired (2-hour limit)
- Ensure token is stored in localStorage

## 📧 Contact

For questions or feedback regarding this assignment:
- GitHub: [http://github.com/yashkinjale]
- Email: [kinjaleyash@gmail.com]

## 📄 License

This project is part of an internship assignment submission for Frontend Developer position at Bajarangs/PrimeTrade.

---

**Built with ❤️ demonstrating full-stack development skills**
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> b878fd9c03d790e789a82765d3c16dc82d0773ac
