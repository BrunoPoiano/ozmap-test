import dotenv from 'dotenv';
dotenv.config();
const mongoose = require('mongoose');
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let isConnected = false;

const databaseInit = async () => {
  if (process.env.NODE_ENV !== 'dev') {
    return;
  }

  if (isConnected) {
    console.log('Already connected to the main database.');
    return;
  }
  const MONGO_URI = `mongodb://${process.env.MONGO_PASSWORD}:${process.env.MONGO_USERNAME}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}?authSource=admin`;
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to main database');
  } catch (error) {
    console.error('Main database connection error:', error);
    process.exit(1);
  }
};

const testDatabaseInit = async () => {
  if (isConnected) {
    console.log('Already connected to the test database.');
    return;
  }

  mongoServer = await MongoMemoryServer.create({
    instance: { port: 0 },
  });
  const MONGO_URI_TEST = mongoServer.getUri();

  try {
    await mongoose.connect(MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to in-memory test database');
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
};

const databaseDrop = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    isConnected = false;
    if (mongoServer) await mongoServer.stop();
    console.log('Test database stopped.');
  }
};

export { testDatabaseInit, databaseInit, databaseDrop };
