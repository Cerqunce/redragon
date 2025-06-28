# MongoDB Atlas Migration Guide

This project has been migrated from PostgreSQL (Sequelize) to MongoDB Atlas (Mongoose).

## Setup MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Create a new cluster (M0 Sandbox is free)
   - Choose your preferred cloud provider and region

3. **Configure Database Access**
   - Go to "Database Access" in the sidebar
   - Add a new database user with username and password
   - Give the user "Read and write to any database" privileges

4. **Configure Network Access**
   - Go to "Network Access" in the sidebar
   - Add IP Address: `0.0.0.0/0` (for development) or your specific IP addresses
   - For production, restrict to your server's IP addresses only

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Environment Variables**
   - Copy `.env.example` to `.env`
   - Replace the `MONGODB_URI` with your connection string
   - Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values

## Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

## Migration from PostgreSQL (Optional)

If you have existing data in PostgreSQL that you want to migrate:

1. Keep your old database credentials temporarily
2. Install sequelize and pg packages: `npm install sequelize pg`
3. Update the `migrate.js` file with your old database connection
4. Uncomment the migration code in `migrate.js`
5. Run: `npm run migrate`
6. Remove the old packages: `npm uninstall sequelize pg`

## Key Changes Made

### Models
- **Sequelize → Mongoose**: Converted all models from Sequelize to Mongoose schemas
- **Soft Deletes**: Implemented soft delete functionality with `deletedAt` field
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields

### Database Operations
- **findAll()** → **find()**
- **findOne({ where: { id } })** → **findById(id)**
- **create()** → **new Model().save()**
- **update()** → **model.field = value; model.save()**
- **destroy()** → **model.softDelete()** (custom method)

### Error Handling
- Added proper error handling for MongoDB operations
- Handle unique constraint violations (error.code === 11000)

## Testing the Migration

1. Install dependencies: `npm install`
2. Set up your `.env` file with MongoDB Atlas credentials
3. Start the server: `npm start`
4. Test the endpoints to ensure they work correctly

## API Endpoints

All existing API endpoints remain the same:

- `GET /api/blogs/all` - Get all reviews
- `POST /api/blogs/all` - Get reviews by type
- `POST /api/blogs/getreview` - Get single review
- `POST /api/blogs/create` - Create new review (requires auth)
- `POST /api/blogs/delete` - Delete review (requires auth)
- `POST /api/admin/add` - Add admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify admin token
- `GET /api/admin/alladmins` - Get all admins
- `POST /api/admin/delete` - Delete admin
- `POST /api/admin/update` - Update admin password
