import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: [
        {
      degree: '',
      title: '',
      university: '',
      graduationYear: '',
    }],
    area_of_expertise: '',
    awards: [
        {
        title: '',
        type: '',
        agency: '',
        year: '',
        amount: ''
    }],
    teaching_experience: [
        {
        designation: '',
        department: '',
        institution: '',
        from: '',
        to: ''
    }],
    research_experience: [{
        designation: '',
        department: '',
        institution: '',
        area_of_expertise: '',
        from: '',
        to: ''
    }],
    industry_experience: [
        {
        designation: '',
        organization: '',
        profile: '',
        from: '',
        to: ''
    }],
    contribution_to_innovation:[
        {
        nature_of_innovation: '',
        specific_contribution: '',
        outcome: ''
    }],
    patents: [
        {
        title: '',
        status: '',
        patent_number: '',
        year_of_award: '',
        type: '',
        commericialized_status: ''
    }],
    publications: [
        {
        title: '',
        authors: '',
        journal_conference: '',
        ugc_approved_journal: '',
        conference_details: '',
        volume: '',
        issue: '',
        pages: '',
        year: '',
        impact_factor: '',
    }],
    books: [{
        title: '',
        authors: '',
        publisher: '',
        year: '',
        isbn: ''
    }],
    chapters_in_books: [{
        title: '',
        book_title: '',
        authors: '',
        publisher: '',
        year: '',
        isbn: ''
    }],
    edited_books: [{
        title: '',
        authors: '',
        publisher: '',
        year: '',
        isbn: ''
    }],
    projects: [
        {
        title: '',
        sponosor: '',
        from: '',
        to: '',
        sanctioned_amount: '',
        year_of_award: '',
        ongoing_completed: ''
    }],
    consultancy_works: [
        {
        title: '',
        sponosor: '',
        from: '',
        to: '',
        sanctioned_amount: '',
        year_of_award: '',
        ongoing_completed: ''
    }],
    pg_student_guided: [
        {
            student_name: '',
            registration_number: '',
            program: '',
            project_title: '',
            year_of_completion: '',
        }
    ],
    phd_student_guided: [
        {
            student_name: '',
            registration_number: '',
            thesis_title: '',
            thesis_status: '',
            thesis_submission_date: '',
            viva_date: '',
            year_of_award: ''
        }
    ],
    postdoc_student_guided: [
        {
            student_name: '',
            designation: '',
            funding_agency: '',
            fellowship_title: '',
            joining_date: '',
            completion_date: ''
        }
    ],
    invited_talks: [
        {
            title: '',
            conference_seminar_workshop_trainingProgram: '',
            organization: '',
            level: '',
            from: '',
            to: '',
            year: ''
        }
    ],
    conferences_seminar_: [
        {
            title: '',
            sponsors: '',
            venue: '',
            duration: '',
            level: '',
            from: '',
            to: '',
            year: ''
        }
    ],
    administrative_responsibilities: [
        {
            position: '',
            organization: '',
            duration: '',
            nature_of_duty: ''
        }
    ],
    affliations: [
        {
            position: '',
            organization: '',
            from: '',
            to: ''
        }
    ],
    participation_extension_activities: [
        {
            position: '',
            from: '',
            to: '',
            nature_of_duty: ''
        }
    ],
    collaborations: [
        {
            collaborator_name: '',
            designation: '',
            institution: '',
            type_of_collaboration: '',
            nature_of_collaboration: '',
            from: '',
            to: '',
            visit_from: '',
            visit_to: '',
            details: ''
        }
    ],
    faculty_developmental_programme_attended: [
        {
            title: '',
            organiser: '',
            venue: '',
            duration: '',
            from: '',
            to: '',
            year: ''
        }
    ]


  });

  useEffect(() => {
    // Fetch profile data from backend
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setProfile(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0 0 10px 0',
            fontFamily: 'Segoe UI, Arial, sans-serif'
          }}>
            Professor Profile
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            margin: 0
          }}>
            Manage your academic profile and information
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          {/* Personal Information Section */}
          <div style={{
            marginBottom: '40px',
            padding: '30px',
            background: '#f8fafc',
            borderRadius: '15px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: '25px',
              borderBottom: '3px solid #667eea',
              paddingBottom: '10px'
            }}>
              Personal Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Full Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Email Address
                </label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="Enter your email"
                  type="email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Phone Number
                </label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Address
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Enter your address"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Area of Expertise
                </label>
                <textarea
                  value={profile.area_of_expertise}
                  onChange={(e) => setProfile({...profile, area_of_expertise: e.target.value})}
                  placeholder="Describe your areas of expertise"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: '16px 40px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;