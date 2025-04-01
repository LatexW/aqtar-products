# AQTAR Product Management

A modern web application for managing AQTAR's premium products. Built with Next.js, TypeScript, and a MySQL database.

![AQTAR Products](public/images/logo.png)

## Features

- Browse and filter products by category
- Add, edit, and delete products
- Image upload functionality
- Integration with external product API
- Responsive design for all devices

## Technology Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** MySQL
- **Language:** TypeScript

## Prerequisites

- Node.js (v16 or higher)
- MySQL server
- npm or yarn

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/aqtar-products.git
   cd aqtar-products
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up the database**

   - Create a MySQL database named `aqtar_products_db`
   - Create a table named `products` with the following schema:

   ```sql
   CREATE TABLE products (
     id INT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     description TEXT,
     category VARCHAR(100),
     image VARCHAR(255),
     rating_rate DECIMAL(3, 2),
     rating_count INT
   );
   ```

4. **Environment Variables**

   Create a `.env.local` file in the root directory with the following content:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=aqtar_products_db
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`.

6. **Seed the database (optional)**

   Visit `http://localhost:3000/api/seed` in your browser to populate the database with initial products.

## Deployment

1. **Build the application**

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the production server**

   ```bash
   npm start
   # or
   yarn start
   ```

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

© 2023 AQTAR. All rights reserved.
