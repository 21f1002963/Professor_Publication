import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { saveChanges, CHANGE_TYPES } from '../changeTracker';

function Publications() {
  const [publications, setPublications] = useState([
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
      type: 'journal' // journal, conference, book, chapter
    }
  ]);

  const handleAddPublication = () => {
    setPublications([...publications, {
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
      type: 'journal'
    }]);
  };

  const handleRemovePublication = (index) => {
    const newPublications = publications.filter((_, i) => i !== index);
    setPublications(newPublications);
  };

  const handlePublicationChange = (index, field, value) => {
    const newPublications = [...publications];
    newPublications[index][field] = value;
    setPublications(newPublications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save changes to local tracking system
      const changeId = saveChanges(
        CHANGE_TYPES.PUBLICATIONS,
        publications,
        `Updated ${publications.length} publication(s)`
      );

      alert('Publications saved! Go to Dashboard to review and submit all changes for approval.');

    } catch (error) {
      console.error('Error saving publications:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        padding: '40px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{
          marginBottom: '30px',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0 0 10px 0',
            fontFamily: 'Segoe UI, Arial, sans-serif'
          }}>
            Publications
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: 0,
            opacity: 0.8,
          }}>
            Manage your academic publications and research papers
          </p>
        </div>

        {/* Publications Form Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Publications Section */}
            <div style={{
              padding: '30px 30px 30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Academic Publications
                </h2>
                <button
                  type="button"
                  onClick={handleAddPublication}
                  style={{
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ➕ Add Publication
                </button>
              </div>

              {publications.map((publication, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '25px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  {/* Remove Button */}
                  {publications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePublication(index)}
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove Publication"
                    >
                      ✕
                    </button>
                  )}

                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    margin: '10px',
                    marginLeft: '0px'
                  }}>
                    Publication #{index + 1}
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Publication Type */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Publication Type *
                      </label>
                      <select
                        value={publication.type}
                        onChange={(e) => handlePublicationChange(index, 'type', e.target.value)}
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
                      >
                        <option value="journal">Journal Article</option>
                        <option value="conference">Conference Paper</option>
                        <option value="book">Book</option>
                        <option value="chapter">Book Chapter</option>
                      </select>
                    </div>

                    {/* Title */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Title *
                      </label>
                      <input
                        value={publication.title}
                        onChange={(e) => handlePublicationChange(index, 'title', e.target.value)}
                        placeholder="Enter publication title"
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
                      />
                    </div>

                    {/* Authors */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Authors *
                      </label>
                      <input
                        value={publication.authors}
                        onChange={(e) => handlePublicationChange(index, 'authors', e.target.value)}
                        placeholder="Enter authors (comma separated)"
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
                      />
                    </div>

                    {/* Journal/Conference */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Journal/Conference Name
                      </label>
                      <input
                        value={publication.journal_conference}
                        onChange={(e) => handlePublicationChange(index, 'journal_conference', e.target.value)}
                        placeholder="Enter journal or conference name"
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
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Year *
                      </label>
                      <input
                        value={publication.year}
                        onChange={(e) => handlePublicationChange(index, 'year', e.target.value)}
                        placeholder="2024"
                        type="number"
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
                      />
                    </div>

                    {/* Volume */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Volume
                      </label>
                      <input
                        value={publication.volume}
                        onChange={(e) => handlePublicationChange(index, 'volume', e.target.value)}
                        placeholder="Volume number"
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
                      />
                    </div>

                    {/* Issue */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Issue
                      </label>
                      <input
                        value={publication.issue}
                        onChange={(e) => handlePublicationChange(index, 'issue', e.target.value)}
                        placeholder="Issue number"
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
                      />
                    </div>

                    {/* Pages */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Pages
                      </label>
                      <input
                        value={publication.pages}
                        onChange={(e) => handlePublicationChange(index, 'pages', e.target.value)}
                        placeholder="e.g., 123-145"
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
                      />
                    </div>

                    {/* Impact Factor */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Impact Factor
                      </label>
                      <input
                        value={publication.impact_factor}
                        onChange={(e) => handlePublicationChange(index, 'impact_factor', e.target.value)}
                        placeholder="e.g., 2.5"
                        type="number"
                        step="0.01"
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
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button Section */}
            <div style={{ padding: '30px 40px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
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
                💾 Save Publications
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Publications;