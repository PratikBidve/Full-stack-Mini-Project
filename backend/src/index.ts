import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import { auth, AuthRequest } from './middleware/auth';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const app = express();

// CORS configuration (move to very top)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://studio.apollographql.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight

app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => console.error('MongoDB connection error:', error));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: { req: AuthRequest }) => {
    console.log('Apollo Server context - Full request:', {
      headers: JSON.stringify(req.headers, null, 2),
      method: req.method,
      url: req.url,
      body: req.body
    });
    console.log('Apollo Server context - Authorization header:', req.headers.authorization);
    const user = await auth(req);
    console.log('Apollo Server context - User:', user ? { id: user._id, email: user.email, role: user.role } : null);
    return { req, user };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', {
      message: error.message,
      path: error.path,
      extensions: error.extensions,
      originalError: error.originalError
    });
    return error;
  }
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ 
    app: app as any,
    path: '/graphql',
    cors: false // Use only Express CORS middleware
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((error: Error) => {
  console.error('Error starting server:', error);
});