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

// Register Professor/HOD
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    try {
        console.log('Signup request received:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Role:', role);
        console.log('Role type:', typeof role);

        const existingProfessor = await Professor.findOne({ email });
        if (existingProfessor) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Validate role
        const validRoles = ['faculty', 'hod', 'dean'];
        const userRole = role || 'faculty'; // Default to faculty if role is undefined
        if (!validRoles.includes(userRole)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newProfessor = new Professor({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        console.log('About to save professor with role:', userRole);
        const savedProfessor = await newProfessor.save();
        console.log('Saved professor:', savedProfessor.role);

        res.status(201).json({
            message: `${userRole === 'hod' ? 'HOD' : userRole === 'dean' ? 'Dean' : 'Faculty member'} registered successfully`,
            role: savedProfessor.role
        });
    } catch (error) {
        console.error('Registration error:', error);
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
            email: professor.email,
            role: professor.role
        }, TOKEN, { expiresIn: '24h' });
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

// Update profile directly (no approval needed)
app.put('/api/professor/profile', authenticateToken, async (req, res) => {
    try {
        const profileData = req.body;
        
        // Remove sensitive fields that shouldn't be updated via this endpoint
        delete profileData.password;
        delete profileData.role;
        delete profileData._id;
        delete profileData.__v;
        
        const updatedProfessor = await Professor.findByIdAndUpdate(
            req.user.id,
            {
                ...profileData,
                lastProfileUpdate: new Date()
            },
            { new: true, select: '-password' }
        );
        
        if (!updatedProfessor) {
            return res.status(404).json({ message: 'Professor not found' });
        }
        
        console.log('Profile updated successfully for user:', req.user.id);
        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedProfessor
        });
    } catch (error) {
        console.error('Error updating profile:', error);
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

// =============================================================================
// HOD MANAGEMENT API ENDPOINTS
// =============================================================================

// Get all faculty members (HOD only)
app.get('/api/hod/faculty-list', authenticateToken, async (req, res) => {
    try {
        // Check if user is HOD
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, TOKEN);

        if (decoded.role !== 'hod') {
            return res.status(403).json({ message: 'Access denied. HOD role required.' });
        }

        const faculty = await Professor.find({
            role: 'faculty'
        }).select('-password -__v').sort({ createdAt: -1 });

        res.status(200).json({
            faculty: faculty,
            count: faculty.length
        });
    } catch (error) {
        console.error('Error fetching faculty list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// =============================================================================
// END HOD MANAGEMENT API ENDPOINTS
// =============================================================================

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});