# AQTAR Products Management System

A modern product management application built with Next.js, TypeScript, and MySQL.

## Features

- Browse and search products
- Filter products by category
- Add new products with image upload
- Edit existing products
- Delete products
- Database integration with MySQL
- API fallback for data retrieval

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MySQL Server
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LatexW/aqtar-products.git
   cd aqtar-products
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the MySQL database:
   - Create a database named `aqtar_products_db`
   - The default connection settings are:
     - Host: localhost
     - User: root
     - Password: (empty)
     - Database: aqtar_products_db

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Database Initialization

The application will automatically create the necessary tables on first run. 
If you want to pre-populate the database with sample products, use the "Reset Data" button on the homepage.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Image Storage**: Local file system

## Project Structure

- `/app`: Next.js 13+ App Router
- `/components`: Reusable React components
- `/public`: Static assets
- `/utils`: Utility functions
- `/types`: TypeScript type definitions
- `/api`: API routes
- `/services`: Database and external API services

## License

This project is licensed under the MIT License.
