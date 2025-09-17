const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Professor = require('./Professor');
require('dotenv').config();
const { TOKEN } = process.env;
const { MONGO_URI } = process.env;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Register Professor
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        console.log(name, email, password, confirmPassword);
        const existingProfessor = await Professor.findOne({ email });
        if (existingProfessor) {
            return res.status(400).json({ message: 'Professor already exists' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newProfessor = new Professor({ name, email, password: hashedPassword });
        await newProfessor.save();
        res.status(201).json({ message: 'Professor registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Professor
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email, password);
        const professor = await Professor.findOne({ email });
        if (!professor) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, professor.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: professor }, TOKEN, { expiresIn: '3m' });
        res.status(200).json({ result: professor, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});