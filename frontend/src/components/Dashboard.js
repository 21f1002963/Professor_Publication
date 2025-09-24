import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  getPendingChanges,
  getChangeTypeDisplayName,
  getStatusDisplayInfo,
  submitAllChanges,
  CHANGE_TYPES
} from '../changeTracker';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDesignation, setuserDesignation] = useState('Assistant Professor');
  const [userName, setUserName] = useState('Professor');
  const [userRole, setUserRole] = useState('faculty'); // 'faculty' or 'hod'
  const [profileStatus, setProfileStatus] = useState('pending'); // 'pending', 'approved', 'denied'
  const [profileImage, setProfileImage] = useState('');
  const [pendingChanges, setPendingChanges] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState('none'); // 'none', 'submitted', 'approved', 'denied'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userInfo = JSON.parse(user);
        const decoded = jwtDecode(token);
        setUserName(userInfo.name || decoded.name || 'Professor');
        setUserRole(userInfo.role || decoded.role || 'faculty');
        setProfileStatus(decoded.profileStatus || 'pending');

        // Fetch profile data to get the latest profile image
        fetchProfileData();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Load pending changes
    loadPendingChanges();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/professor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        // Update profile image from the fetched profile data
        if (profileData.profileImage) {
          setProfileImage(profileData.profileImage);
        }
        if (profileData.designation) {
          setuserDesignation(profileData.designation);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const loadPendingChanges = () => {
    const changes = getPendingChanges();
    setPendingChanges(changes);
  };

  const handleSubmitAllChanges = async () => {
    if (pendingChanges.length === 0) {
      alert('No changes to submit');
      return;
    }

    try {
      const submittedChanges = submitAllChanges();
      setSubmissionStatus('submitted');
      setPendingChanges([]);

      // Mock API call
      await fetch('http://localhost:5000/submit-bulk-changes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ changes: submittedChanges })
      });

      alert(`Successfully submitted ${submittedChanges.length} changes for HOD approval!`);
    } catch (error) {
      console.error('Error submitting changes:', error);
      alert('Changes submitted successfully! (Demo mode)');
      setSubmissionStatus('submitted');
      setPendingChanges([]);
    }
  };

  const getChangeIcon = (type) => {
    const icons = {
      [CHANGE_TYPES.PROFILE]: '👤',
      [CHANGE_TYPES.PUBLICATIONS]: '📄',
      [CHANGE_TYPES.PATENTS]: '💡',
      [CHANGE_TYPES.PROJECT_STUDENTS]: '👨‍🎓'
    };
    return icons[type] || '📝';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Role-based menu items
  const baseMenuItems = [
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Experience', path: '/experience', icon: '💼' },
    { label: 'Faculty', path: '/faculty', icon: '👥' },
    { label: 'Publications', path: '/publications', icon: '📄' },
    { label: 'Patents', path: '/patents', icon: '💡' },
    { label: 'Project Students', path: '/project-students', icon: '👨‍🎓' }
  ];

  const hodMenuItems = [
    ...baseMenuItems,
    { label: 'HOD Verification', path: '/hod-verification', icon: '✅' },
    { label: 'Faculty Management', path: '/faculty-management', icon: '🏛️' }
  ];

  const menuItems = userRole === 'hod' ? hodMenuItems : baseMenuItems;

  return (
    <div style={{
      minHeight: '100vh', backgroundSize: 'cover',
      display: 'flex', position: 'relative'
    }}>
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(134, 133, 133, 0.3)',
            zIndex: 998
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '90px',
        background: 'linear-gradient(180deg, #6093ecff 0%, #1a202c 100%)',
        color: '#fff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 999,
        boxShadow: sidebarOpen ? '4px 0 20px rgba(0,0,0,0.15)' : '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center'
        }}>
          {sidebarOpen && (
            <h3 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'white',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dashboard
            </h3>
          )}

          {/* Enhanced Burger Menu */}
          <div
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              background: sidebarOpen ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div style={{
              width: '24px',
              height: '4px',
              background: '#fff',
              margin: '4px 0',
              borderRadius: '2px',
            }} />
            <div style={{
              width: '24px',
              height: '4px',
              background: '#fff',
              margin: '4px 0',
              borderRadius: '2px',
            }} />
            <div style={{
              width: '24px',
              height: '4px',
              background: '#fff',
              margin: '4px 0',
              borderRadius: '2px',
            }} />
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: sidebarOpen ? '16px 24px' : '16px',
                margin: '8px 16px',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                background: 'transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <span style={{
                fontSize: '1.5rem',
                marginRight: sidebarOpen ? '16px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  opacity: 0.9
                }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: sidebarOpen ? '12px 20px' : '12px',
              cursor: 'pointer',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s ease',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: sidebarOpen ? '12px' : '0' }}>➜]</span>
            {sidebarOpen && (
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ef4444' }}>
                Logout
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '70px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header with Profile Picture */}
        <div style={{
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#2d3748',
              marginBottom: '8px',
              marginTop: 0,
              marginLeft: 20,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              textShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}>
              Welcome back, {userName}!
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              marginLeft: 20,
              margin: '0 0 0 20px'
            }}>
              {userRole === 'hod' ? 'Head of Department Dashboard' : 'Faculty Dashboard'}
            </p>
          </div>

          {/* Profile Picture */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: !profileImage ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '3px solid #fff',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                userName.charAt(0) || '👨‍🏫'
              )}
            </div>
            <p style={{
              fontSize: '1.1rem',
              marginLeft: 20,
              margin: '0px 0 0 20px',
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>{userDesignation}</p>
          </div>
        </div>

        {/* Profile Status Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between'}}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Profile Update Status
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}>
              <div style={{
                padding: '12px 20px',
                borderRadius: '25px',
                fontWeight: 600,
                fontSize: '1rem',
                background: profileStatus === 'approved' ?
                  'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' :
                  profileStatus === 'denied' ?
                    'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)' :
                    'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                {profileStatus === 'approved' && 'Approved'}
                {profileStatus === 'denied' && ' Denied'}
                {profileStatus === 'pending' && ' Pending Verification'}
              </div>
            </div>
          </div>

          <p style={{
            color: '#4a5568',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            {profileStatus === 'approved' &&
              'Your profile updates has been verified and approved by the Head of Department. '}
            {profileStatus === 'denied' &&
              'Your profile updates have been denied. Please review and update your information before resubmitting for verification.'}
            {profileStatus === 'pending' &&
              'Your profile updates is currently under review by the Head of Department. You will be notified once the verification is complete.'}
          </p>
        </div>

        {/* HOD Verification Panel (only show for HOD) */}
        {userRole === 'hod' && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px' }}>👑</span>
              Faculty Verification Panel
            </h2>

            <p style={{
              color: '#4a5568',
              fontSize: '1rem',
              marginBottom: '20px'
            }}>
              Review and approve faculty profile updates. Click below to access the verification dashboard.
            </p>

            <button
              onClick={() => navigate('/hod-verification')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔍 Open Verification Dashboard
            </button>
          </div>
        )}

        {/* Pending Changes Review Section (only show for faculty) */}
        {userRole === 'faculty' && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#2d3748',
                margin: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                Pending Changes Review
              </h2>

              {pendingChanges.length > 0 && (
                <button
                  onClick={handleSubmitAllChanges}
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
                  📤 Submit All Changes ({pendingChanges.length})
                </button>
              )}
            </div>

            {pendingChanges.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#718096'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#4a5568' }}>
                  No pending changes
                </h3>
                <p style={{ fontSize: '1rem' }}>
                  Make updates to your profile, publications, patents, or project students to see them here for review.
                </p>
              </div>
            ) : (
              <div>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1rem',
                  marginBottom: '20px'
                }}>
                  Review your changes before submitting them to the HOD for approval. Click on any section to review and edit.
                </p>

                {/* Changes Table */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <th style={{
                          padding: '15px 20px',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2d3748'
                        }}>
                          Section
                        </th>
                        <th style={{
                          padding: '15px 20px',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2d3748'
                        }}>
                          Description
                        </th>
                        <th style={{
                          padding: '15px 20px',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2d3748'
                        }}>
                          Last Modified
                        </th>
                        <th style={{
                          padding: '15px 20px',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2d3748'
                        }}>
                          Status
                        </th>
                        <th style={{
                          padding: '15px 20px',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2d3748'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingChanges.map((change, index) => {
                        const statusInfo = getStatusDisplayInfo(change.status);
                        return (
                          <tr key={change.id} style={{
                            borderBottom: index < pendingChanges.length - 1 ? '1px solid #e2e8f0' : 'none',
                            backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc'
                          }}>
                            <td style={{
                              padding: '15px 20px',
                              verticalAlign: 'top'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}>
                                <span style={{ fontSize: '1.3rem' }}>
                                  {getChangeIcon(change.type)}
                                </span>
                                <span style={{
                                  fontWeight: 600,
                                  color: '#2d3748',
                                  fontSize: '0.95rem'
                                }}>
                                  {getChangeTypeDisplayName(change.type)}
                                </span>
                              </div>
                            </td>
                            <td style={{
                              padding: '15px 20px',
                              color: '#4a5568',
                              fontSize: '0.9rem',
                              maxWidth: '200px'
                            }}>
                              {change.description || 'Updates made to this section'}
                            </td>
                            <td style={{
                              padding: '15px 20px',
                              color: '#718096',
                              fontSize: '0.85rem'
                            }}>
                              {new Date(change.timestamp).toLocaleDateString()} <br />
                              {new Date(change.timestamp).toLocaleTimeString()}
                            </td>
                            <td style={{
                              padding: '15px 20px'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: statusInfo.color,
                                backgroundColor: statusInfo.bgColor
                              }}>
                                {statusInfo.icon} {statusInfo.label}
                              </span>
                            </td>
                            <td style={{
                              padding: '15px 20px',
                              textAlign: 'center'
                            }}>
                              <button
                                onClick={() => {
                                  const paths = {
                                    [CHANGE_TYPES.PROFILE]: '/profile',
                                    [CHANGE_TYPES.PUBLICATIONS]: '/publications',
                                    [CHANGE_TYPES.PATENTS]: '/patents',
                                    [CHANGE_TYPES.PROJECT_STUDENTS]: '/project-students'
                                  };
                                  navigate(paths[change.type]);
                                }}
                                style={{
                                  background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                }}
                              >
                                🔍 Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submission Status Display */}
        {submissionStatus !== 'none' && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                fontSize: '2rem'
              }}>
                {submissionStatus === 'submitted' && '📤'}
                {submissionStatus === 'approved' && '✅'}
                {submissionStatus === 'denied' && '❌'}
              </div>
              <div>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#2d3748'
                }}>
                  {submissionStatus === 'submitted' && 'Changes Submitted for Review'}
                  {submissionStatus === 'approved' && 'Changes Approved'}
                  {submissionStatus === 'denied' && 'Changes Denied'}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#4a5568',
                  fontSize: '0.95rem'
                }}>
                  {submissionStatus === 'submitted' && 'Your changes have been sent to the HOD for approval. You will be notified once reviewed.'}
                  {submissionStatus === 'approved' && 'All your submitted changes have been approved and are now live.'}
                  {submissionStatus === 'denied' && 'Your submission was denied. Please review feedback and resubmit.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;