import 'dotenv/config';
import express from 'express';
import dogRoutes from './routes/dog.routes.js';
import authRoutes from './routes/auth.routes.js'; // <-- NEW: Import the auth routes

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Environment-specific middleware
if (NODE_ENV === 'development') {
  // Development: Verbose logging for all requests
  app.use((req, res, next) => {
    // SECURITY PATCH: Never log plain-text passwords to the terminal
    const safeBody = { ...req.body };
    if (safeBody.password) {
      safeBody.password = '[HIDDEN FOR SECURITY]';
    }
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Body: ${JSON.stringify(safeBody)}`);
    next();
  });
  console.log('🚀 Running in DEVELOPMENT mode');
  console.log('   - Verbose request logging enabled');
  console.log('   - Full error details visible');
} else if (NODE_ENV === 'qa') {
  // QA/Staging: Moderate logging with error context
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
  console.log('🧪 Running in QA mode');
  console.log('   - Request logging enabled');
  console.log('   - Error context visible (for debugging)');
} else if (NODE_ENV === 'production') {
  // Production: Minimal logging, only errors
  console.log('📦 Running in PRODUCTION mode');
  console.log('   - Minimal logging (errors only)');
  console.log('   - Generic error messages (security)');
}

// Routes
app.use('/api/auth', authRoutes); // <-- NEW: Public authentication routes
app.use('/api/dogs', dogRoutes);  // <-- Existing dog routes (Protected inside dog.routes.ts)

// Error handling middleware (differs by environment)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  if (NODE_ENV === 'production') {
    // Production: Hide internal error details
    console.error(`[ERROR] ${req.method} ${req.path} - ${statusCode}`);
    res.status(statusCode).json({
      error: 'Internal Server Error'
    });
  } else if (NODE_ENV === 'qa') {
    // QA: Show context but not full details
    console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);
    res.status(statusCode).json({
      error: err.message,
      path: req.path,
      timestamp: new Date().toISOString()
    });
  } else {
    // Development: Show everything for debugging
    console.error(`[ERROR] ${req.method} ${req.path}`, err);
    res.status(statusCode).json({
      error: err.message,
      stack: err.stack,
      details: err.details,
      path: req.path,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV.toUpperCase()}`);
  console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
});