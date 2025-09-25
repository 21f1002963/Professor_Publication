const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
    // Basic Authentication Fields
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['faculty', 'hod', 'dean'],
        default: 'faculty'
    },

    // Personal Information
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' }, // Base64 or file path

    // Faculty Information
    department: { type: String, default: '' },
    designation: { type: String, default: '' },
    employee_id: { type: String, default: '' },
    date_of_joining: { type: Date },
    experience_years: { type: Number, default: 0 },
    subjects_taught: [{ type: String }],
    research_interests: [{ type: String }],
    office_location: { type: String, default: '' },
    office_hours: { type: String, default: '' },
    area_of_expertise: [{ type: String, default: '' }],

    // Educational Qualifications
    education: [{
        degree: { type: String, default: '' },
        title: { type: String, default: '' },
        university: { type: String, default: '' },
        graduationYear: { type: String, default: '' }
    }],

    // Awards and Recognition
    awards: [{
        title: { type: String, default: '' },
        type: { type: String, default: '' },
        agency: { type: String, default: '' },
        year: { type: String, default: '' },
        amount: { type: String, default: '' }
    }],

    // Experience
    teaching_experience: [{
        designation: { type: String, default: '' },
        institution: { type: String, default: '' },
        department: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' }
    }],

    research_experience: [{
        position: { type: String, default: '' },
        organization: { type: String, default: '' },
        project: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' }
    }],

    industry_experience: [{
        designation: { type: String, default: '' },
        company: { type: String, default: '' },
        sector: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' }
    }],

    // Research and Innovation
    contribution_to_innovation: [{
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        year: { type: String, default: '' },
        impact: { type: String, default: '' }
    }],

    patents: [{
        title: { type: String, default: '' },
        patent_number: { type: String, default: '' },
        status: { type: String, default: '' },
        year: { type: String, default: '' },
        co_inventors: { type: String, default: '' }
    }],

    publications: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        journal: { type: String, default: '' },
        volume: { type: String, default: '' },
        issue: { type: String, default: '' },
        pages: { type: String, default: '' },
        year: { type: String, default: '' },
        doi: { type: String, default: '' },
        type: { type: String, default: '' }
    }],

    // New Publications Structure
    ugc_approved_journals: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        journal_name: { type: String, default: '' },
        volume: { type: String, default: '' },
        issue: { type: String, default: '' },
        page_nos: { type: String, default: '' },
        year: { type: String, default: '' },
        impact_factor: { type: String, default: '' }
    }],

    non_ugc_journals: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        journal_name: { type: String, default: '' },
        volume: { type: String, default: '' },
        issue: { type: String, default: '' },
        page_nos: { type: String, default: '' },
        year: { type: String, default: '' },
        impact_factor: { type: String, default: '' }
    }],

    conference_proceedings: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        conference_details: { type: String, default: '' },
        page_nos: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    // New Patents Structure
    innovation_contributions: [{
        work_name: { type: String, default: '' },
        specialization: { type: String, default: '' },
        remarks: { type: String, default: '' }
    }],

    patent_details: [{
        title: { type: String, default: '' },
        status: { type: String, default: '' },
        patent_number: { type: String, default: '' },
        year_of_award: { type: String, default: '' },
        type: { type: String, default: '' },
        commercialized_status: { type: String, default: '' }
    }],

    books: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        publisher: { type: String, default: '' },
        isbn: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    chapters_in_books: [{
        chapter_title: { type: String, default: '' },
        authors: { type: String, default: '' },
        book_title: { type: String, default: '' },
        publisher: { type: String, default: '' },
        year: { type: String, default: '' },
        isbn: { type: String, default: '' }
    }],

    edited_books: [{
        title: { type: String, default: '' },
        authors: { type: String, default: '' },
        publisher: { type: String, default: '' },
        year: { type: String, default: '' },
        isbn: { type: String, default: '' }
    }],

    // Projects and Students
    projects: [{
        title: { type: String, default: '' },
        funding_agency: { type: String, default: '' },
        amount: { type: String, default: '' },
        duration: { type: String, default: '' },
        role: { type: String, default: '' },
        status: { type: String, default: '' }
    }],

    consultancy_works: [{
        title: { type: String, default: '' },
        organization: { type: String, default: '' },
        amount: { type: String, default: '' },
        duration: { type: String, default: '' },
        status: { type: String, default: '' }
    }],

    // Research Guidance - New Structure
    pg_guidance: [{
        year: { type: String, default: '' },
        degree: { type: String, default: '' },
        students_awarded: { type: String, default: '' },
        department_centre: { type: String, default: '' }
    }],

    phd_guidance: [{
        student_name: { type: String, default: '' },
        registration_date: { type: String, default: '' },
        registration_no: { type: String, default: '' },
        thesis_title: { type: String, default: '' },
        thesis_submitted_status: { type: String, default: '' },
        thesis_submitted_date: { type: String, default: '' },
        vivavoce_completed_status: { type: String, default: '' },
        date_awarded: { type: String, default: '' }
    }],

    postdoc_guidance: [{
        scholar_name: { type: String, default: '' },
        designation: { type: String, default: '' },
        funding_agency: { type: String, default: '' },
        fellowship_title: { type: String, default: '' },
        year_of_joining: { type: String, default: '' },
        year_of_completion: { type: String, default: '' }
    }],

    // Legacy fields (keeping for backward compatibility)
    pg_student_guided: [{
        student_name: { type: String, default: '' },
        thesis_title: { type: String, default: '' },
        year_of_completion: { type: String, default: '' },
        current_status: { type: String, default: '' }
    }],

    phd_student_guided: [{
        student_name: { type: String, default: '' },
        thesis_title: { type: String, default: '' },
        thesis_status: { type: String, default: '' },
        thesis_submission_date: { type: String, default: '' },
        viva_date: { type: String, default: '' },
        year_of_award: { type: String, default: '' }
    }],

    postdoc_student_guided: [{
        student_name: { type: String, default: '' },
        designation: { type: String, default: '' },
        funding_agency: { type: String, default: '' },
        fellowship_title: { type: String, default: '' },
        joining_date: { type: String, default: '' },
        completion_date: { type: String, default: '' }
    }],

    // Project & Consultancy
    ongoing_projects: [{
        title_of_project: { type: String, default: '' },
        sponsored_by: { type: String, default: '' },
        period: { type: String, default: '' },
        sanctioned_amount: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    ongoing_consultancy_works: [{
        title_of_consultancy_work: { type: String, default: '' },
        sponsored_by: { type: String, default: '' },
        period: { type: String, default: '' },
        sanctioned_amount: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    completed_projects: [{
        title_of_project: { type: String, default: '' },
        sponsored_by: { type: String, default: '' },
        period: { type: String, default: '' },
        sanctioned_amount: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    completed_consultancy_works: [{
        title_of_consultancy_work: { type: String, default: '' },
        sponsored_by: { type: String, default: '' },
        period: { type: String, default: '' },
        sanctioned_amount: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    // Academic Activities
    invited_talks: [{
        title: { type: String, default: '' },
        conference_seminar_workshop_trainingProgram: { type: String, default: '' },
        organization: { type: String, default: '' },
        level: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    conferences_seminar_: [{
        title: { type: String, default: '' },
        sponsors: { type: String, default: '' },
        venue: { type: String, default: '' },
        duration: { type: String, default: '' },
        level: { type: String, default: '' },
        from: { type: String, default: '' },
        to: { type: String, default: '' },
        year: { type: String, default: '' }
    }],

    administrative_responsibilities: [{
        position: { type: String, default: '' },
        organization: { type: String, default: '' },
        duration: { type: String, default: '' },
        nature_of_duty: { type: String, default: '' }
    }],

    affliations: [{
        position: { type: String, default: '' },
        organization: { type: String, default: '' },
        duration: { type: String, default: '' },
        nature: { type: String, default: '' }
    }],

    // Verification Status
    profileStatus: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },

    lastProfileUpdate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Professor', ProfessorSchema, 'Professors');