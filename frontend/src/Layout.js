import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Profile', path: '/profile', icon: '👤' },
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
              color: 'white'
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
                background: window.location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.background = 'transparent';
                }
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <span 
                style={{
                  fontSize: '1.5rem',
                  marginRight: sidebarOpen ? '16px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double click
                  navigate(item.path);
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                title={item.label} // Add tooltip for better UX
              >
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
            <span style={{ fontSize: '1.2rem', marginRight: sidebarOpen ? '12px' : '0' }}>🚪</span>
            {sidebarOpen && (
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ef4444' }}>
                Logout
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '90px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        background: '#f8fafc',
        position: 'relative'
      }}>
        {/* Dashboard Icon - Top Right Corner */}
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(96, 147, 236, 0.3)',
            transition: 'all 0.3s ease',
            fontSize: '1.5rem'
          }}
          onClick={() => navigate('/dashboard')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 25px rgba(96, 147, 236, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(96, 147, 236, 0.3)';
          }}
          title="Go to Dashboard"
        >
          🏠
        </div>
        
        {children}
      </div>
    </div>
  );
}

export default Layout;