require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const skillRoutes = require('./routes/competenceroute');

const app = express();


app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json()); 

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skill';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  });

// Routes
app.use('/api/skill', skillRoutes);

// 404 route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
        message: 'Erreur serveur interne',
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});