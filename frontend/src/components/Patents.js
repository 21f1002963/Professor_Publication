import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { saveChanges, CHANGE_TYPES } from '../changeTracker';

function Patents() {
  const [patents, setPatents] = useState([
    {
      title: '',
      status: '',
      patent_number: '',
      year_of_award: '',
      type: '',
      commericialized_status: '',
      inventors: '',
      description: ''
    }
  ]);

  const handleAddPatent = () => {
    setPatents([...patents, {
      title: '',
      status: '',
      patent_number: '',
      year_of_award: '',
      type: '',
      commericialized_status: '',
      inventors: '',
      description: ''
    }]);
  };

  const handleRemovePatent = (index) => {
    const newPatents = patents.filter((_, i) => i !== index);
    setPatents(newPatents);
  };

  const handlePatentChange = (index, field, value) => {
    const newPatents = [...patents];
    newPatents[index][field] = value;
    setPatents(newPatents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save changes to local tracking system
      const changeId = saveChanges(
        CHANGE_TYPES.PATENTS,
        patents,
        `Updated ${patents.length} patent(s)`
      );

      alert('Patents saved! Go to Dashboard to review and submit all changes for approval.');

    } catch (error) {
      console.error('Error saving patents:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  return (
    <Layout>
      <div style={{
        minHeight: "100vh",
        padding: "40px",
      }}>
        {/* Page Header */}
        <div style={{
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            fontFamily: 'Segoe UI, Arial, sans-serif',
            margin: '0px'
          }}>
            Patents
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8         }}>
            Manage your patent portfolio and intellectual property
          </p>
        </div>

        {/* Patents Form Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Patents Section */}
            <div style={{
              padding: '40px'
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
                  <span style={{ marginRight: '10px' }}>🔬</span>
                  Patent Portfolio
                </h2>
                <button
                  type="button"
                  onClick={handleAddPatent}
                  style={{
                    background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
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
                    e.target.style.boxShadow = '0 4px 15px rgba(246, 173, 85, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ➕ Add Patent
                </button>
              </div>

              {patents.map((patent, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  padding: '30px',
                  marginBottom: '25px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  {/* Remove Button */}
                  {patents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePatent(index)}
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
                      title="Remove Patent"
                    >
                      ✕
                    </button>
                  )}

                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    marginBottom: '20px'
                  }}>
                    Patent #{index + 1}
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Title */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Patent Title *
                      </label>
                      <input
                        value={patent.title}
                        onChange={(e) => handlePatentChange(index, 'title', e.target.value)}
                        placeholder="Enter patent title"
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

                    {/* Inventors */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Inventors *
                      </label>
                      <input
                        value={patent.inventors}
                        onChange={(e) => handlePatentChange(index, 'inventors', e.target.value)}
                        placeholder="Enter inventors (comma separated)"
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

                    {/* Patent Status */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Status *
                      </label>
                      <select
                        value={patent.status}
                        onChange={(e) => handlePatentChange(index, 'status', e.target.value)}
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
                        <option value="">Select Status</option>
                        <option value="Filed">Filed</option>
                        <option value="Published">Published</option>
                        <option value="Granted">Granted</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Patent Number */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Patent Number
                      </label>
                      <input
                        value={patent.patent_number}
                        onChange={(e) => handlePatentChange(index, 'patent_number', e.target.value)}
                        placeholder="Enter patent number"
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

                    {/* Year of Award */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Year of Award
                      </label>
                      <input
                        value={patent.year_of_award}
                        onChange={(e) => handlePatentChange(index, 'year_of_award', e.target.value)}
                        placeholder="2024"
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
                      />
                    </div>

                    {/* Patent Type */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Patent Type
                      </label>
                      <select
                        value={patent.type}
                        onChange={(e) => handlePatentChange(index, 'type', e.target.value)}
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
                        <option value="">Select Type</option>
                        <option value="Utility">Utility Patent</option>
                        <option value="Design">Design Patent</option>
                        <option value="Plant">Plant Patent</option>
                        <option value="Provisional">Provisional Patent</option>
                      </select>
                    </div>

                    {/* Commercialized Status */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Commercialized Status
                      </label>
                      <select
                        value={patent.commericialized_status}
                        onChange={(e) => handlePatentChange(index, 'commericialized_status', e.target.value)}
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
                        <option value="">Select Status</option>
                        <option value="Yes">Commercialized</option>
                        <option value="No">Not Commercialized</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Licensed">Licensed</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Description
                      </label>
                      <textarea
                        value={patent.description}
                        onChange={(e) => handlePatentChange(index, 'description', e.target.value)}
                        placeholder="Brief description of the patent"
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
                💾 Save Patents
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Patents;