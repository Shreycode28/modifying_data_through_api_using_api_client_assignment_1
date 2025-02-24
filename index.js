require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./models/menuItem'); // Import the MenuItem model

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(`Error connecting to database: ${err}`);
  });

// POST endpoint to create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Create a new menu item
    const newItem = new MenuItem({ name, description, price });

    // Save to the database
    await newItem.save();

    // Respond with the created menu item
    res.status(201).json({ message: 'Menu item created successfully', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating menu item' });
  }
});

// GET endpoint to fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
