import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Layout from './Layout';

function RequestPublications() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [publications, setPublications] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    fetchFacultyPublications();
  }, [facultyId]);

  const fetchFacultyPublications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      
      // Fetch faculty profile
      const profileResponse = await fetch(
        `https://professorpublication-production.up.railway.app/api/professor/profile/${facultyId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (profileResponse.ok) {
        const facultyData = await profileResponse.json();
        setFaculty(facultyData);
        
        // Extract publications from faculty data
        const publicationsData = {
          seie_journals: facultyData.seie_journals || [],
          ugc_approved_journals: facultyData.ugc_approved_journals || [],
          non_ugc_journals: facultyData.non_ugc_journals || [],
          conference_papers: facultyData.conference_papers || [],
          book_chapters: facultyData.book_chapters || [],
          books_published: facultyData.books_published || []
        };
        
        setPublications(publicationsData);
      }
    } catch (error) {
      console.error('Error fetching faculty publications:', error);
      alert('Error fetching publications');
    } finally {
      setLoading(false);
    }
  };

  const handlePublicationSelect = (publicationType, publicationIndex, publication) => {
    const publicationKey = `${publicationType}_${publicationIndex}`;
    const isSelected = selectedPublications.some(p => p.key === publicationKey);

    if (isSelected) {
      setSelectedPublications(prev => prev.filter(p => p.key !== publicationKey));
    } else {
      setSelectedPublications(prev => [...prev, {
        key: publicationKey,
        type: publicationType,
        index: publicationIndex,
        title: publication.title,
        publication: publication
      }]);
    }
  };

  const handleSendRequests = async () => {
    if (selectedPublications.length === 0) {
      alert('Please select at least one publication to request access to.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const promises = selectedPublications.map(async (selectedPub) => {
        const response = await fetch(
          'https://professorpublication-production.up.railway.app/api/access-request',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              target_faculty_id: facultyId,
              publication_type: selectedPub.type,
              publication_index: selectedPub.index,
              publication_title: selectedPub.title,
              message: requestMessage || `Request access to view publication: ${selectedPub.title}`
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error sending request');
        }

        return response.json();
      });

      await Promise.all(promises);
      
      alert(`Successfully sent ${selectedPublications.length} access request(s) to ${faculty.name}!`);
      navigate('/faculty');
      
    } catch (error) {
      console.error('Error sending access requests:', error);
      alert(error.message || 'Error sending access requests');
    }
  };

  const renderPublicationTable = (publicationType, publicationArray, title) => {
    if (!publicationArray || publicationArray.length === 0) return null;

    // Filter out empty publications
    const validPublications = publicationArray.filter(pub => pub.title && pub.title.trim() !== '');
    if (validPublications.length === 0) return null;

    return (
      <div key={publicationType} style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: '#2d3748',
          marginBottom: '15px',
          padding: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h3>
        
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', width: '50px' }}>Select</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Authors</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Journal/Conference</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Year</th>
              </tr>
            </thead>
            <tbody>
              {validPublications.map((publication, index) => {
                const publicationKey = `${publicationType}_${index}`;
                const isSelected = selectedPublications.some(p => p.key === publicationKey);
                
                return (
                  <tr key={index} style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0f9ff' : (index % 2 === 0 ? '#f8fafc' : '#fff'),
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePublicationSelect(publicationType, index, publication)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td style={{ padding: '15px', fontWeight: 500, color: '#2d3748' }}>
                      {publication.title}
                    </td>
                    <td style={{ padding: '15px', color: '#4a5568' }}>
                      {publication.authors || 'N/A'}
                    </td>
                    <td style={{ padding: '15px', color: '#4a5568' }}>
                      {publication.journal_name || publication.conference_name || 'N/A'}
                    </td>
                    <td style={{ padding: '15px', color: '#4a5568' }}>
                      {publication.year || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
          color: '#667eea'
        }}>
          Loading publications...
        </div>
      </Layout>
    );
  }

  if (!faculty) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
          color: '#e53e3e'
        }}>
          Faculty not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => navigate('/faculty')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginBottom: '20px',
                color: '#667eea'
              }}
            >
              ← Back to Faculty Directory
            </button>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              Request Access to Publications
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: faculty.profileImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 600,
                overflow: 'hidden'
              }}>
                {faculty.profileImage ? (
                  <img
                    src={faculty.profileImage}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  (faculty.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#2d3748', margin: 0 }}>
                  {faculty.name}
                </h2>
                <p style={{ color: '#718096', fontSize: '1rem', margin: '5px 0' }}>
                  {faculty.designation} • {faculty.department}
                </p>
              </div>
            </div>

            <p style={{
              color: '#4a5568',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Select the publications you would like to request access to. The faculty member will be notified and can approve or deny your requests.
            </p>
          </div>

          {/* Publications */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            {renderPublicationTable('seie_journals', publications.seie_journals, '📄 Papers Published in SEIE Journals')}
            {renderPublicationTable('ugc_approved_journals', publications.ugc_approved_journals, '📋 Papers Published in UGC Approved Journals')}
            {renderPublicationTable('non_ugc_journals', publications.non_ugc_journals, '📝 Papers Published in Non UGC Approved Peer Reviewed Journals')}
            {renderPublicationTable('conference_papers', publications.conference_papers, '🎤 Conference Papers')}
            {renderPublicationTable('book_chapters', publications.book_chapters, '📖 Book Chapters')}
            {renderPublicationTable('books_published', publications.books_published, '📚 Books Published')}
            
            {Object.values(publications).every(arr => !arr || arr.length === 0 || arr.every(pub => !pub.title || pub.title.trim() === '')) && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#718096'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No Publications Available</h3>
                <p>This faculty member hasn't published any papers yet.</p>
              </div>
            )}
          </div>

          {/* Request Form */}
          {selectedPublications.length > 0 && (
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#2d3748',
                marginBottom: '20px'
              }}>
                Send Access Request ({selectedPublications.length} publication{selectedPublications.length !== 1 ? 's' : ''} selected)
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Request Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Please provide a reason for accessing these publications..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={handleSendRequests}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  📤 Send Request{selectedPublications.length > 1 ? 's' : ''}
                </button>
                
                <button
                  onClick={() => setSelectedPublications([])}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                  }}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default RequestPublications;