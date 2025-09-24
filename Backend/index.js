const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Professor = require('./Professor');
const ChangeRequest = require('./ChangeRequest');
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

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

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
        const token = jwt.sign({
            id: professor._id,
            name: professor.name,
            email: professor.email
        }, TOKEN, { expiresIn: '3m' });
        res.status(200).json({ result: professor, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// =============================================================================
// PROFILE MANAGEMENT API ENDPOINTS
// =============================================================================

// Get professor profile
app.get('/api/professor/profile', authenticateToken, async (req, res) => {
    try {
        const professor = await Professor.findById(req.user.id).select('-password');
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }
        res.status(200).json(professor);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit profile changes for HOD approval
app.post('/api/professor/submit-changes', authenticateToken, async (req, res) => {
    try {
        const { changes, description = 'Profile updates submitted for approval' } = req.body;

        // Create change request
        const changeRequest = new ChangeRequest({
            facultyId: req.user.id,
            changes: changes,
            description: description,
            status: 'pending'
        });

        await changeRequest.save();

        res.status(201).json({
            message: 'Changes submitted successfully for HOD approval',
            changeRequestId: changeRequest._id
        });
    } catch (error) {
        console.error('Error submitting changes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get pending change requests (for HOD)
app.get('/api/hod/pending-changes', authenticateToken, async (req, res) => {
    try {
        // In a real app, check if user is HOD
        const pendingChanges = await ChangeRequest.find({ status: 'pending' })
            .populate('facultyId', 'name email department')
            .sort({ submittedAt: -1 });

        res.status(200).json(pendingChanges);
    } catch (error) {
        console.error('Error fetching pending changes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// HOD approve/deny changes
app.put('/api/hod/review-changes/:changeId', authenticateToken, async (req, res) => {
    try {
        const { changeId } = req.params;
        const { status, feedback = '' } = req.body; // status: 'approved' or 'denied'

        const changeRequest = await ChangeRequest.findById(changeId);
        if (!changeRequest) {
            return res.status(404).json({ message: 'Change request not found' });
        }

        // Update change request status
        changeRequest.status = status;
        changeRequest.reviewedBy = req.user.id;
        changeRequest.reviewedAt = new Date();
        changeRequest.feedback = feedback;
        await changeRequest.save();

        // If approved, update the professor's profile
        if (status === 'approved') {
            await Professor.findByIdAndUpdate(
                changeRequest.facultyId,
                {
                    ...changeRequest.changes,
                    profileStatus: 'approved',
                    lastProfileUpdate: new Date()
                }
            );
        } else {
            // If denied, update only the profile status
            await Professor.findByIdAndUpdate(
                changeRequest.facultyId,
                { profileStatus: 'denied' }
            );
        }

        res.status(200).json({
            message: `Changes ${status} successfully`,
            changeRequest: changeRequest
        });
    } catch (error) {
        console.error('Error reviewing changes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get faculty change request status
app.get('/api/professor/change-status', authenticateToken, async (req, res) => {
    try {
        const latestRequest = await ChangeRequest.findOne({
            facultyId: req.user.id
        }).sort({ submittedAt: -1 });

        const professor = await Professor.findById(req.user.id).select('profileStatus');

        res.status(200).json({
            profileStatus: professor.profileStatus,
            latestRequest: latestRequest
        });
    } catch (error) {
        console.error('Error fetching change status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all professors (for faculty directory)
app.get('/api/professors', authenticateToken, async (req, res) => {
    try {
        const professors = await Professor.find({
            profileStatus: 'approved'
        }).select('-password -__v');

        res.status(200).json(professors);
    } catch (error) {
        console.error('Error fetching professors:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// =============================================================================
// END PROFILE MANAGEMENT API ENDPOINTS
// =============================================================================

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});