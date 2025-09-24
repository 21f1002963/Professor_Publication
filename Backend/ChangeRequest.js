const mongoose = require('mongoose');

const ChangeRequestSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: true
    },

    // The actual profile changes submitted
    changes: {
        type: Object,
        required: true
    },

    // Change metadata
    changeType: {
        type: String,
        enum: ['profile', 'publications', 'patents', 'project_students', 'bulk'],
        default: 'bulk'
    },

    description: {
        type: String,
        default: 'Profile updates submitted for approval'
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },

    // HOD Review Information
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor' // HOD who reviewed it
    },

    reviewedAt: {
        type: Date
    },

    feedback: {
        type: String,
        default: ''
    },

    // Timestamps
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ChangeRequest', ChangeRequestSchema, 'ChangeRequests');