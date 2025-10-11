# MongoDB Atlas Setup Guide

This guide will help you migrate from SQLite to MongoDB Atlas for permanent cloud storage.

## 🚀 Quick Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### 2. Get Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `coffee-shop-admin`

### 3. Set Environment Variables
Create a `.env.local` file in your project root:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coffee-shop-admin?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Initialize Database
Run the setup script to create collections and default data:

```bash
npm run setup-db
```

Or visit: `http://localhost:3002/api/init-db` (POST request)

## 📊 Database Collections

The following collections will be created:

- **users** - Admin users and authentication
- **home_content** - Homepage content management
- **coffee_facts** - Coffee facts and trivia
- **coffee_history** - Coffee history timeline
- **highlight_cards** - Featured products and offers
- **display_settings** - UI display preferences

## 🔧 Features

### ✅ What's Included
- **Cloud Storage**: Data stored permanently in MongoDB Atlas
- **Scalability**: Handles growth and multiple users
- **Backup**: Automatic backups with Atlas
- **Security**: Encrypted connections and authentication
- **Performance**: Optimized queries with indexes

### 🔄 Migration Benefits
- **No Data Loss**: All existing functionality preserved
- **Better Performance**: Faster queries and updates
- **Reliability**: 99.9% uptime with Atlas
- **Scalability**: Easy to scale as your business grows

## 🛠️ Development

### Local Development
1. Set up your `.env.local` file
2. Run `npm run dev`
3. Visit `http://localhost:3002`
4. Login with: `admin` / `admin123`

### Production Deployment
1. Set environment variables in your hosting platform
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 🔐 Security

- **Authentication**: JWT-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Connection Security**: TLS/SSL encrypted connections
- **Access Control**: Role-based permissions

## 📈 Monitoring

MongoDB Atlas provides:
- Real-time performance metrics
- Query performance insights
- Storage usage monitoring
- Alert notifications

## 🆘 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check your connection string
   - Verify network access in Atlas
   - Ensure IP whitelist includes your IP

2. **Authentication Error**
   - Verify username/password
   - Check database user permissions
   - Ensure JWT_SECRET is set

3. **Collection Not Found**
   - Run the database initialization
   - Check collection names match exactly

### Getting Help
- Check MongoDB Atlas documentation
- Review the console logs for errors
- Ensure all environment variables are set correctly

## 🎉 You're All Set!

Your coffee shop admin panel is now running on MongoDB Atlas with:
- ✅ Permanent cloud storage
- ✅ Scalable architecture
- ✅ Professional reliability
- ✅ Modern database technology

Happy coding! ☕
