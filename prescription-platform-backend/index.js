const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); // Import auth routes
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

app.use(cors());
// Middleware (optional)
app.use(express.json());

app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
