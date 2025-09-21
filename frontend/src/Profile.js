import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Layout from './Layout';

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
    
    // Complex Arrays (kept from original)
    education: [
        {
      degree: '',
      title: '',
      university: '',
      graduationYear: '',
    }],
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

  // Helper functions for array field management
  const handleArrayInputChange = (field, index, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

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
    <Layout>
      <div style={{
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#2d3748',
            margin: '0 0 10px 0',
            fontFamily: 'Segoe UI, Arial, sans-serif'
          }}>
            Professor Profile
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#718096',
            margin: 0
          }}>
            Manage your academic profile and information
          </p>
        </div>

        {/* Profile Form Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
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
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px' }}>👤</span>
              Personal Information
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Full Name *
                </label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Email Address *
                </label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="Enter your email"
                  type="email"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Phone Number
                </label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Address
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Enter your address"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Area of Expertise
                </label>
                <textarea
                  value={profile.area_of_expertise}
                  onChange={(e) => setProfile({...profile, area_of_expertise: e.target.value})}
                  placeholder="Describe your areas of expertise"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
          </div>

          {/* Faculty Information Section */}
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
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px' }}>🏛️</span>
              Faculty Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Department *
                </label>
                <input
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  placeholder="Enter department name"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Designation *
                </label>
                <select
                  value={profile.designation}
                  onChange={(e) => setProfile({...profile, designation: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Employee ID
                </label>
                <input
                  value={profile.employee_id}
                  onChange={(e) => setProfile({...profile, employee_id: e.target.value})}
                  placeholder="Enter employee ID"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Date of Joining
                </label>
                <input
                  value={profile.date_of_joining}
                  onChange={(e) => setProfile({...profile, date_of_joining: e.target.value})}
                  type="date"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Highest Qualification
                </label>
                <input
                  value={profile.qualification}
                  onChange={(e) => setProfile({...profile, qualification: e.target.value})}
                  placeholder="e.g., Ph.D. in Computer Science"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Years of Experience
                </label>
                <input
                  value={profile.experience_years}
                  onChange={(e) => setProfile({...profile, experience_years: e.target.value})}
                  placeholder="Enter years of experience"
                  type="number"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Office Location
                </label>
                <input
                  value={profile.office_location}
                  onChange={(e) => setProfile({...profile, office_location: e.target.value})}
                  placeholder="Enter office location"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Office Hours
                </label>
                <input
                  value={profile.office_hours}
                  onChange={(e) => setProfile({...profile, office_hours: e.target.value})}
                  placeholder="e.g., Mon-Fri 10:00-16:00"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    background: '#fff',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6093ecff'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Subjects Taught */}
            <div style={{ marginTop: '30px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <label style={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Subjects Taught
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('subjects_taught')}
                  style={{
                    background: '#48bb78',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add Subject
                </button>
              </div>
              {profile.subjects_taught.map((subject, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    value={subject}
                    onChange={(e) => handleArrayInputChange('subjects_taught', index, e.target.value)}
                    placeholder="Enter subject name"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      background: '#fff'
                    }}
                  />
                  {profile.subjects_taught.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('subjects_taught', index)}
                      style={{
                        background: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Research Interests */}
            <div style={{ marginTop: '30px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <label style={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Research Interests
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('research_interests')}
                  style={{
                    background: '#6093ecff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  + Add Interest
                </button>
              </div>
              {profile.research_interests.map((interest, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    value={interest}
                    onChange={(e) => handleArrayInputChange('research_interests', index, e.target.value)}
                    placeholder="Enter research interest"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      background: '#fff'
                    }}
                  />
                  {profile.research_interests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('research_interests', index)}
                      style={{
                        background: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
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
              💾 Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
  );
}

export default Profile;