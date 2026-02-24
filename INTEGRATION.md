# Frontend-Backend Integration Guide

## Setup Complete ✅

The frontend has been successfully integrated with the backend API. All major views now fetch real data from the REST API.

## What Was Updated

### 1. API Service Layer
- **File:** `src/services/api.js`
- Axios instance with automatic token injection
- Request/response interceptors for auth
- Organized API methods for all endpoints

### 2. Authentication
- **File:** `src/store/auth.js`
- Real API login with JWT tokens
- Token storage in localStorage
- Automatic logout on 401 errors

- **File:** `src/views/LoginView.vue`
- API-based authentication
- Error handling and loading states
- Test credentials displayed

### 3. Dashboard
- **File:** `src/views/DashboardView.vue`
- Real-time statistics from API
- Recent activities feed
- Dynamic data formatting

### 4. Products
- **File:** `src/views/ProductsView.vue`
- Product listing with pagination
- Search functionality (debounced)
- Warehouse filtering

### 5. Customers
- **File:** `src/views/CustomersView.vue`
- Customer listing from API
- Purchase history navigation

## Running the Application

### 1. Start Backend Server

```bash
cd d:/Proektlar/Shop_Searem_StartUp_Backend

# First time: Seed the database
npm run seed

# Start the server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 2. Start Frontend Server

```bash
cd d:/Proektlar/Shop_Searem_StartUp

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173` (or similar)

### 3. Login

Use these test credentials:
- **Username:** `admin`
- **Password:** `admin123`

## API Integration Features

✅ **JWT Authentication**
- Tokens automatically included in requests
- Auto-logout on expiration

✅ **Error Handling**
- User-friendly error messages
- Network error recovery

✅ **Loading States**
- Spinners during data fetch
- Disabled buttons during submission

✅ **Search & Filtering**
- Debounced search (500ms)
- Real-time filtering

✅ **Pagination**
- Server-side pagination
- Total count tracking

## Environment Variables

Frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Backend `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop_searem
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Next Steps

### Additional Views to Update
- [ ] TradesView.vue - Integrate with trades API
- [ ] WorkersView.vue - Integrate with workers API
- [ ] ExpensesView.vue - Integrate with expenses API
- [ ] StoresView.vue - Integrate with stores API
- [ ] WarehouseView.vue - Integrate with warehouses API
- [ ] CustomerDetailView.vue - Fetch customer trade history

### Features to Add
- [ ] Create/Edit dialogs for all entities
- [ ] Delete confirmations
- [ ] Toast notifications for success/error
- [ ] Form validation
- [ ] Image upload for products
- [ ] Export to Excel/PDF
- [ ] Advanced filtering

## Troubleshooting

### CORS Errors
Backend already has CORS enabled. If issues persist, check firewall settings.

### 401 Unauthorized
- Check if MongoDB is running
- Verify seed data was created
- Check token in localStorage

### Network Errors
- Ensure backend server is running on port 5000
- Check `.env` file has correct API URL
- Verify MongoDB connection

## API Endpoints Reference

All endpoints are documented in the backend README:
`d:/Proektlar/Shop_Searem_StartUp_Backend/README.md`

Quick reference:
- `POST /api/auth/login` - Login
- `GET /api/dashboard/stats` - Dashboard stats
- `GET /api/products` - Get products
- `GET /api/customers` - Get customers
- `GET /api/trades` - Get trades
