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
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/professors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched professors:', data);
        setProfessors(data);
      } else {
        console.error('Failed to fetch professors:', response.status);
        setProfessors([]); // Set empty array instead of mock data
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
      setProfessors([]); // Set empty array instead of mock data
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessors = professors.filter(prof => {
    const expertiseText = Array.isArray(prof.area_of_expertise)
      ? prof.area_of_expertise.join(', ')
      : (prof.area_of_expertise || '');

    const matchesSearch = (prof.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      expertiseText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || prof.department === filterDepartment;
    const matchesDesignation = !filterDesignation || prof.designation === filterDesignation;

    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const departments = [...new Set(professors.map(prof => prof.department).filter(Boolean))];
  const designations = [...new Set(professors.map(prof => prof.designation).filter(Boolean))];

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
    <div>
      <Layout>
        <div style={{
          padding: '40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Page Header */}
          <div style={{
            marginBottom: '40px',
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              margin: '0 0 10px 0',
              fontFamily: 'Segoe UI, Arial, sans-serif'
            }}>
              Faculty Directory
            </h1>
            <p style={{
              fontSize: '1.2rem',
              margin: 0,
              opacity: 0.8
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
                    width: '90%',
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
                  👔 Designation
                </label>
                <select
                  value={filterDesignation}
                  onChange={(e) => setFilterDesignation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
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
                    Name
                  </th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: 'none'
                  }}>
                    Department
                  </th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: 'none'
                  }}>
                    Designation
                  </th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: 'none'
                  }}>
                    Qualification
                  </th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: 'none'
                  }}>
                    Contact
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
                  <tr key={professor._id} style={{
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: !professor.profileImage
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {professor.profileImage ? (
                            <img
                              src={professor.profileImage}
                              alt="Profile"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%'
                              }}
                            />
                          ) : (
                            (professor.name || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 600,
                            color: '#2d3748',
                            fontSize: '1rem',
                            marginBottom: '4px'
                          }}>
                            {professor.name || 'N/A'}
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#718096'
                          }}>
                            {professor.experience_years ? `${professor.experience_years} years exp.` : 'Experience not specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '20px',
                      verticalAlign: 'top',
                      color: '#4a5568',
                      fontSize: '0.95rem'
                    }}>
                      {professor.department || 'Not specified'}
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
                        {professor.designation || 'Not specified'}
                      </span>
                    </td>
                    <td style={{
                      padding: '20px',
                      verticalAlign: 'top',
                      color: '#4a5568',
                      fontSize: '0.9rem',
                      lineHeight: '1.4'
                    }}>
                      {professor.qualification || 'Not specified'}
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
                          {professor.email || 'N/A'}
                        </a>
                      </div>
                      <div style={{
                        color: '#718096',
                        fontSize: '0.85rem'
                      }}>
                        {professor.phone || 'Not provided'}
                      </div>
                    </td>
                    <td style={{
                      padding: '20px',
                      verticalAlign: 'top',
                      color: '#4a5568',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      maxWidth: '250px'
                    }}>
                      {Array.isArray(professor.area_of_expertise)
                        ? professor.area_of_expertise.filter(Boolean).join(', ') || 'Not specified'
                        : professor.area_of_expertise || 'Not specified'
                      }
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
    </div>
  );
}

export default Faculty;