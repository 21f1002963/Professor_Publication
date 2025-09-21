import React, { useState, useEffect } from 'react';
import Layout from './Layout';

function Faculty() {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/professors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProfessors(data);
    } catch (error) {
      console.error('Error fetching professors:', error);
      // Mock data for demo purposes
      setProfessors([
        {
          id: 1,
          name: 'Dr. John Smith',
          email: 'john.smith@university.edu',
          phone: '+1-234-567-8901',
          department: 'Computer Science',
          designation: 'Professor',
          qualification: 'Ph.D. in Computer Science',
          experience_years: 15,
          area_of_expertise: 'Machine Learning, Artificial Intelligence, Data Mining',
          office_location: 'Room 301, CS Building'
        },
        {
          id: 2,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@university.edu',
          phone: '+1-234-567-8902',
          department: 'Mathematics',
          designation: 'Associate Professor',
          qualification: 'Ph.D. in Applied Mathematics',
          experience_years: 12,
          area_of_expertise: 'Statistical Analysis, Mathematical Modeling, Operations Research',
          office_location: 'Room 205, Math Building'
        },
        {
          id: 3,
          name: 'Dr. Michael Brown',
          email: 'michael.brown@university.edu',
          phone: '+1-234-567-8903',
          department: 'Physics',
          designation: 'Assistant Professor',
          qualification: 'Ph.D. in Theoretical Physics',
          experience_years: 8,
          area_of_expertise: 'Quantum Mechanics, Condensed Matter Physics, Computational Physics',
          office_location: 'Room 108, Physics Building'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessors = professors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.area_of_expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || prof.department === filterDepartment;
    const matchesDesignation = !filterDesignation || prof.designation === filterDesignation;
    
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const departments = [...new Set(professors.map(prof => prof.department))];
  const designations = [...new Set(professors.map(prof => prof.designation))];

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
          Loading faculty directory...
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
            👥 Faculty Directory
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#718096',
            margin: 0
          }}>
            Discover our distinguished faculty members and their expertise
          </p>
        </div>

        {/* Search and Filter Section */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                🔍 Search Faculty
              </label>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or expertise..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  background: '#fff'
                }}
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
                🏛️ Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#fff'
                }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
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
                👔 Designation
              </label>
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#fff'
                }}
              >
                <option value="">All Designations</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterDesignation('');
              }}
              style={{
                padding: '14px 20px',
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#374151',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#cbd5e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e2e8f0';
              }}
            >
              🔄 Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{
          marginBottom: '20px',
          fontSize: '1.1rem',
          color: '#4a5568',
          fontWeight: 500
        }}>
          {filteredProfessors.length} faculty member{filteredProfessors.length !== 1 ? 's' : ''} found
        </div>

        {/* Faculty Table */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  👨‍🏫 Name
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  �️ Department
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  👔 Designation
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  🎓 Qualification
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  📧 Contact
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  📍 Office
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderBottom: 'none'
                }}>
                  🔬 Expertise
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProfessors.map((professor, index) => (
                <tr key={professor.id} style={{
                  borderBottom: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8fafc' : '#fff';
                }}
                >
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top'
                  }}>
                    <div style={{
                      fontWeight: 600,
                      color: '#2d3748',
                      fontSize: '1rem',
                      marginBottom: '4px'
                    }}>
                      {professor.name}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#718096'
                    }}>
                      {professor.experience_years} years exp.
                    </div>
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top',
                    color: '#4a5568',
                    fontSize: '0.95rem'
                  }}>
                    {professor.department}
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top'
                  }}>
                    <span style={{
                      background: professor.designation === 'Professor' ? 
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                        professor.designation === 'Associate Professor' ?
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-block'
                    }}>
                      {professor.designation}
                    </span>
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top',
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {professor.qualification}
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ marginBottom: '6px' }}>
                      <a href={`mailto:${professor.email}`} style={{
                        color: '#6093ecff',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'block'
                      }}>
                        {professor.email}
                      </a>
                    </div>
                    <div style={{
                      color: '#718096',
                      fontSize: '0.85rem'
                    }}>
                      {professor.phone}
                    </div>
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top',
                    color: '#4a5568',
                    fontSize: '0.9rem'
                  }}>
                    {professor.office_location}
                  </td>
                  <td style={{
                    padding: '20px',
                    verticalAlign: 'top',
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    maxWidth: '250px'
                  }}>
                    {professor.area_of_expertise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results Message */}
        {filteredProfessors.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2d3748',
              marginBottom: '10px'
            }}>
              No faculty members found
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1.1rem'
            }}>
              Try adjusting your search criteria or clearing the filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Faculty;