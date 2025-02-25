const express = require('express');
import { databaseInit, testDatabaseInit } from './src/database';
import routes from './src/routes/index';
const cors = require('cors');

const app = express();
const PORT = process.env.NODE_PORT;

databaseInit()
  .then(() => {
    app.use(
      cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
      })
    );

    app.use(express.json());
    app.use('/api', routes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });
