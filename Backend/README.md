# E-commerce Backend API

A complete e-commerce backend built with Node.js, Express, and PostgreSQL with local file storage.

## Features

- **User Authentication**: JWT-based auth with refresh tokens
- **Role-based Access**: Customer, Seller, Admin roles
- **Product Management**: CRUD operations with image upload
- **Shopping Cart**: Add, update, remove items
- **Order Management**: Complete order processing
- **Local File Storage**: Images stored in uploads folder
- **Security**: Rate limiting, input validation, password hashing

## Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup Environment**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database credentials
   \`\`\`

3. **Setup Database**
   - Create PostgreSQL database
   - Run the SQL scripts in the scripts folder

4. **Start Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)
- `POST /api/products/:id/images` - Upload product images

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (seller)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Sellers
- `GET /api/sellers/dashboard` - Seller dashboard data
- `GET /api/sellers/products` - Seller's products
- `GET /api/sellers/orders` - Orders for seller's products

## File Upload

Images are stored locally in the `uploads/products/` directory and served statically at `/uploads/` endpoint.

## Security Features

- Password hashing with bcrypt
- JWT tokens with refresh mechanism
- Rate limiting
- Input validation with Joi
- File upload restrictions
- SQL injection prevention

## Default Test Accounts

- **Admin**: admin@example.com / password
- **Seller**: seller@example.com / password  
- **Customer**: customer@example.com / password
