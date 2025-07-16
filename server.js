import app from './src/app.js';
import { sequelize } from './src/models/index.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📖 API Documentation:`);
      console.log(`   - GET    /health                    - Health check`);
      console.log(`   - GET    /api/items                 - Get all items (with pagination, search, sort)`);
      console.log(`   - GET    /api/items/:id             - Get item by ID`);
      console.log(`   - POST   /api/items                 - Create new item`);
      console.log(`   - PUT    /api/items/:id             - Update item`);
      console.log(`   - DELETE /api/items/:id             - Delete item`);
      console.log(`   - DELETE /api/items                 - Bulk delete items`);
      console.log(`   - GET    /api/items/stats/summary   - Get items statistics`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  await sequelize.close();
  process.exit(0);
});
