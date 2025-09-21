import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Professor');
  const [userRole, setUserRole] = useState('faculty'); // 'faculty' or 'hod'
  const [profileStatus, setProfileStatus] = useState('pending'); // 'pending', 'approved', 'denied'
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || 'Professor');
        setUserRole(decoded.role || 'faculty');
        // Mock status - in real app, fetch from backend
        setProfileStatus(decoded.profileStatus || 'pending');
        setProfileImage(decoded.profileImage || '');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Profile', path: '/profile', icon: '👤' },
    {label: 'Faculty', path: '/faculty', icon: '👥' },
    { label: 'Publications', path: '/publications', icon: '📄' },
    { label: 'Patents', path: '/patents', icon: '💡' },
    { label: 'Project Students', path: '/project-students', icon: '👨‍🎓' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', position: 'relative' }}>
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
            gap: '15px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '3px solid #fff'
            }}>
              {!profileImage && (userName.charAt(0) || '👨‍🏫')}
            </div>
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
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '10px' }}>📋</span>
            Profile Verification Status
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
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
              {profileStatus === 'approved' && '✅ Verified & Approved'}
              {profileStatus === 'denied' && '❌ Denied - Requires Updates'}
              {profileStatus === 'pending' && '⏳ Pending Verification'}
            </div>
          </div>
          
          <p style={{
            color: '#4a5568',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            {profileStatus === 'approved' && 
              'Your profile has been verified and approved by the Head of Department. All information is now visible in the faculty directory.'}
            {profileStatus === 'denied' && 
              'Your profile updates have been denied. Please review and update your information before resubmitting for verification.'}
            {profileStatus === 'pending' && 
              'Your profile is currently under review by the Head of Department. You will be notified once the verification is complete.'}
          </p>
          
          {profileStatus !== 'approved' && (
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
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
                  e.target.style.boxShadow = '0 8px 25px rgba(96, 147, 236, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {profileStatus === 'denied' ? '🔄 Update Profile' : '📝 Edit Profile'}
              </button>
            </div>
          )}
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
      </div>
    </div>
  );
}

export default Dashboard;