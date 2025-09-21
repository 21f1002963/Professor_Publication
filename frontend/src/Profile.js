import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Layout from './Layout';
import { saveChanges, CHANGE_TYPES } from './changeTracker';

function Profile() {
  const [profile, setProfile] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    address: '',
    area_of_expertise: '',

    // Faculty Information
    department: '',
    designation: '',
    employee_id: '',
    date_of_joining: '',
    qualification: '',
    experience_years: '',
    subjects_taught: [''],
    research_interests: [''],
    office_location: '',
    office_hours: '',

    // Complex Arrays
    education: [{
      degree: '',
      title: '',
      university: '',
      graduationYear: '',
    }],
    awards: [{
      title: '',
      type: '',
      agency: '',
      year: '',
      amount: ''
    }],
    teaching_experience: [{
      designation: '',
      department: '',
      institution: '',
      from: '',
      to: ''
    }],
    research_experience: [{
      position: '',
      organization: '',
      duration: '',
      research_area: ''
    }],
    industry_experience: [{
      position: '',
      company: '',
      duration: '',
      role: ''
    }],
    contribution_to_innovation: [{
      title: '',
      description: '',
      year: '',
      impact: ''
    }],
    patents: [{
      title: '',
      patent_number: '',
      status: '',
      year: '',
      co_inventors: ''
    }],
    publications: [{
      title: '',
      authors: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      year: '',
      doi: '',
      type: ''
    }],
    books: [{
      title: '',
      authors: '',
      publisher: '',
      isbn: '',
      year: ''
    }],
    chapters_in_books: [{
      chapter_title: '',
      book_title: '',
      editors: '',
      publisher: '',
      pages: '',
      year: ''
    }],
    edited_books: [{
      title: '',
      editors: '',
      publisher: '',
      isbn: '',
      year: ''
    }],
    projects: [{
      title: '',
      funding_agency: '',
      amount: '',
      duration: '',
      role: '',
      status: ''
    }],
    consultancy_works: [{
      title: '',
      organization: '',
      amount: '',
      duration: '',
      status: ''
    }],
    pg_student_guided: [{
      student_name: '',
      thesis_title: '',
      year_of_completion: '',
      current_status: ''
    }],
    phd_student_guided: [{
      student_name: '',
      thesis_title: '',
      thesis_status: '',
      thesis_submission_date: '',
      viva_date: '',
      year_of_award: ''
    }],
    postdoc_student_guided: [{
      student_name: '',
      designation: '',
      funding_agency: '',
      fellowship_title: '',
      joining_date: '',
      completion_date: ''
    }],
    invited_talks: [{
      title: '',
      conference_seminar_workshop_trainingProgram: '',
      organization: '',
      level: '',
      from: '',
      to: '',
      year: ''
    }],
    conferences_seminar_: [{
      title: '',
      sponsors: '',
      venue: '',
      duration: '',
      level: '',
      from: '',
      to: '',
      year: ''
    }],
    administrative_responsibilities: [{
      position: '',
      organization: '',
      duration: '',
      nature_of_duty: ''
    }],
    affliations: [{
      position: '',
      organization: '',
      duration: '',
      nature: ''
    }]
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setProfile(prev => ({
          ...prev,
          email: decoded.email
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/professor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save changes to local tracking system instead of submitting directly
      const changeId = saveChanges(
        CHANGE_TYPES.PROFILE, 
        profile, 
        'Updated personal and faculty information'
      );
      
      alert('Profile changes saved! Go to Dashboard to review and submit all changes for approval.');
      
    } catch (error) {
      console.error('Error saving profile changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setProfile(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName) => {
    const defaultItems = {
      education: { degree: '', title: '', university: '', graduationYear: '' },
      awards: { title: '', type: '', agency: '', year: '', amount: '' },
      teaching_experience: { designation: '', department: '', institution: '', from: '', to: '' },
      // Add other defaults as needed
    };
    
    setProfile(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItems[arrayName] || {}]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setProfile(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
            color: '#fff',
            padding: '30px 40px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              margin: '0 0 10px 0',
              fontFamily: 'Segoe UI, Arial, sans-serif'
            }}>
              👤 Faculty Profile
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              margin: 0
            }}>
              Manage your personal and academic information
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div style={{
              padding: '40px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                📝 Personal Information
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    color: '#4a5568'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    color: '#4a5568'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    color: '#4a5568'
                  }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    color: '#4a5568'
                  }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your department"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div style={{ padding: '30px 40px', textAlign: 'center', background: '#f8fafc' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '16px 40px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(96, 147, 236, 0.3)',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(96, 147, 236, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(96, 147, 236, 0.3)';
                }}
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;