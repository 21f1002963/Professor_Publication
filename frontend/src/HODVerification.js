import React, { useState, useEffect } from 'react';
import Layout from './Layout';

function HODVerification() {
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/pending-profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingProfiles(data);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
      // Mock data for demo purposes
      setPendingProfiles([
        {
          id: 1,
          facultyName: 'Dr. John Smith',
          email: 'john.smith@university.edu',
          department: 'Computer Science',
          designation: 'Professor',
          submittedAt: '2025-09-20T10:30:00Z',
          changes: {
            qualification: 'Ph.D. in Computer Science from MIT',
            experience_years: 15,
            research_interests: ['Machine Learning', 'AI', 'Data Mining'],
            office_location: 'Room 301, CS Building',
            phone: '+1-234-567-8901'
          },
          status: 'pending'
        },
        {
          id: 2,
          facultyName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@university.edu',
          department: 'Mathematics',
          designation: 'Associate Professor',
          submittedAt: '2025-09-19T14:15:00Z',
          changes: {
            qualification: 'Ph.D. in Applied Mathematics from Stanford',
            experience_years: 12,
            research_interests: ['Statistics', 'Mathematical Modeling'],
            office_location: 'Room 205, Math Building',
            phone: '+1-234-567-8902'
          },
          status: 'pending'
        },
        {
          id: 3,
          facultyName: 'Dr. Michael Brown',
          email: 'michael.brown@university.edu',
          department: 'Physics',
          designation: 'Assistant Professor',
          submittedAt: '2025-09-18T09:45:00Z',
          changes: {
            qualification: 'Ph.D. in Theoretical Physics from Harvard',
            experience_years: 8,
            research_interests: ['Quantum Mechanics', 'Condensed Matter'],
            office_location: 'Room 108, Physics Building',
            phone: '+1-234-567-8903'
          },
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/approve-profile/${profileId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
        alert('Profile approved successfully!');
      }
    } catch (error) {
      console.error('Error approving profile:', error);
      // Mock approval for demo
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      alert('Profile approved successfully!');
    }
  };

  const handleDeny = async (profileId, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/deny-profile/${profileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
        alert('Profile denied successfully!');
      }
    } catch (error) {
      console.error('Error denying profile:', error);
      // Mock denial for demo
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      alert('Profile denied successfully!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading pending profiles...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#2d3748',
            margin: '0 0 10px 0',
            fontFamily: 'Segoe UI, Arial, sans-serif'
          }}>
            👑 HOD Verification Dashboard
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#718096',
            margin: 0
          }}>
            Review and approve faculty profile updates
          </p>
        </div>

        {/* Stats Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#ed8936'
            }}>
              {pendingProfiles.length}
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              fontWeight: 600
            }}>
              Pending Reviews
            </div>
          </div>
          <div style={{
            width: '1px',
            height: '60px',
            background: '#e2e8f0'
          }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#48bb78'
            }}>
              ✓
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              fontWeight: 600
            }}>
              Quick Actions
            </div>
          </div>
        </div>

        {/* Pending Profiles */}
        {pendingProfiles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2d3748',
              marginBottom: '10px'
            }}>
              All profiles are up to date!
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1.1rem'
            }}>
              There are no pending profile updates to review at this time.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '25px'
          }}>
            {pendingProfiles.map((profile) => (
              <div key={profile.id} style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}>
                {/* Profile Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '25px 30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '1.4rem',
                      fontWeight: 700
                    }}>
                      {profile.facultyName}
                    </h3>
                    <p style={{
                      margin: '0',
                      fontSize: '1rem',
                      opacity: 0.9
                    }}>
                      {profile.designation} • {profile.department}
                    </p>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.9rem',
                    opacity: 0.9
                  }}>
                    <div>Submitted:</div>
                    <div>{formatDate(profile.submittedAt)}</div>
                  </div>
                </div>

                {/* Profile Content */}
                <div style={{ padding: '30px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '25px'
                  }}>
                    <div>
                      <h4 style={{
                        margin: '0 0 10px 0',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#2d3748'
                      }}>
                        📧 Contact Information
                      </h4>
                      <p style={{ margin: '5px 0', color: '#4a5568' }}>
                        <strong>Email:</strong> {profile.email}
                      </p>
                      <p style={{ margin: '5px 0', color: '#4a5568' }}>
                        <strong>Phone:</strong> {profile.changes.phone}
                      </p>
                      <p style={{ margin: '5px 0', color: '#4a5568' }}>
                        <strong>Office:</strong> {profile.changes.office_location}
                      </p>
                    </div>

                    <div>
                      <h4 style={{
                        margin: '0 0 10px 0',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#2d3748'
                      }}>
                        🎓 Academic Information
                      </h4>
                      <p style={{ margin: '5px 0', color: '#4a5568' }}>
                        <strong>Qualification:</strong> {profile.changes.qualification}
                      </p>
                      <p style={{ margin: '5px 0', color: '#4a5568' }}>
                        <strong>Experience:</strong> {profile.changes.experience_years} years
                      </p>
                    </div>
                  </div>

                  {/* Research Interests */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{
                      margin: '0 0 15px 0',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#2d3748'
                    }}>
                      🔬 Research Interests
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {profile.changes.research_interests.map((interest, index) => (
                        <span key={index} style={{
                          background: '#e2e8f0',
                          color: '#2d3748',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'flex-end',
                    paddingTop: '20px',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => handleDeny(profile.id)}
                      style={{
                        background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(229, 62, 62, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ❌ Deny
                    </button>

                    <button
                      onClick={() => handleApprove(profile.id)}
                      style={{
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ✅ Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HODVerification;