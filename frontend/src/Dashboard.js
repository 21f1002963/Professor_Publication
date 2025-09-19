import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Professor');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // You'll need to modify your backend to include user info in the token
        // For now, we'll use a placeholder
        setUserName(decoded.name || 'Professor');
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
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
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
        </div>

        {/* Dashboard Cards */}
        {/* <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          flex: 1
        }}>
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '200px',
                justifyContent: 'center'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.02)';
                e.target.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '16px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                {item.label}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#718096',
                margin: 0,
                opacity: 0.8
              }}>
                {item.label === 'Profile' && 'Manage your personal information'}
                {item.label === 'Publications' && 'View and edit your research papers'}
                {item.label === 'Patents' && 'Track your patent applications'}
                {item.label === 'Project Students' && 'Supervise student projects'}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;