import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getApiUrl } from '../config/api';

const FacultyImporter = () => {
  const [nodeId, setNodeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(getApiUrl('/'));
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('Backend connection failed:', error);
      }
    };

    checkBackendStatus();
  }, []);

  const handleSingleImport = async () => {
    if (!nodeId) return;

    setLoading(true);
    setResult(null);

    try {
      const apiUrl = getApiUrl('/api/scraper/faculty');
      console.log('Sending request to:', apiUrl);
      console.log('Request body:', { nodeId });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeId }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setResult({
          success: true,
          nodeId,
          data: data.data
        });
      } else {
        setResult({
          success: false,
          nodeId,
          error: data.message || 'Failed to import faculty data'
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        success: false,
        nodeId,
        error: 'Network error: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            padding: "10px 30px 30px",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "10px",
              marginTop: "0px",
            }}
          >
            Faculty Data Importer
          </h1>



          <p style={{ margin: '0 0 30px 0', color: 'black', fontSize: '1.2rem', opacity: 0.8 }}>
            Import faculty profile data from Pondicherry University
          </p>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
          {/* Faculty Import */}
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            paddingTop: '0px'
          }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '25px',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Import Faculty Data
            </h3>
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                placeholder="Enter Faculty Node ID (e.g., 941)"
                style={{
                  padding: '18px 24px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '16px',
                  width: '320px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              />
              <button
                onClick={handleSingleImport}
                disabled={loading || !nodeId}
                style={{
                  padding: '18px 36px',
                  backgroundColor: loading || !nodeId ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading || !nodeId ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Importing...' : 'Import Faculty'}
              </button>
            </div>
          </div>

          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '50px',
              backgroundColor: '#f8f9fa',
              borderRadius: '16px',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div style={{ marginBottom: '40px' }}>
              {/* Single Import Result */}
              <div style={{
                padding: '20px',
                backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                border: result.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                borderRadius: '12px',
                color: result.success ? '#155724' : '#721c24',
                marginBottom: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                  {result.success ? 'Import Successful' : 'Import Failed'}
                </h4>
                <p style={{ margin: '5px 0' }}><strong>Node ID:</strong> {result.nodeId}</p>
                {result.success ? (
                  <div>
                    {result.data && (
                      <div style={{ marginTop: '20px' }}>
                        {/* Faculty Name, Designation, Department, and Email */}
                        {(result.data.name || result.data.designation || result.data.department || result.data.email) && (
                          <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '12px', borderLeft: '4px solid #007bff' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#2c3e50' }}>
                              {result.data.name}
                            </div>
                            {result.data.designation && (
                              <div style={{ fontSize: '1.2rem', color: '#555', marginTop: '8px', fontStyle: 'italic' }}>
                                {result.data.designation}
                              </div>
                            )}
                            {result.data.department && (
                              <div style={{ fontSize: '1.1rem', color: '#6c757d', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>🏢</span>
                                <span>{result.data.department}</span>
                              </div>
                            )}
                            {result.data.email && (
                              <div style={{ fontSize: '1.1rem', color: '#007bff', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>📧</span>
                                <a
                                  href={`mailto:${result.data.email}`}
                                  style={{
                                    color: '#007bff',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid transparent',
                                    transition: 'border-bottom 0.2s ease'
                                  }}
                                  onMouseOver={(e) => e.target.style.borderBottom = '1px solid #007bff'}
                                  onMouseOut={(e) => e.target.style.borderBottom = '1px solid transparent'}
                                >
                                  {result.data.email}
                                </a>
                              </div>
                            )}
                            {result.data.home?.specialization && result.data.home.specialization.length > 0 && (
                              <div style={{ fontSize: '1.1rem', color: '#28a745', marginTop: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ marginRight: '8px' }}>🎯</span>
                                  <span style={{ fontWeight: 'bold' }}>Areas of Specialization:</span>
                                </div>
                                <div style={{ marginLeft: '24px' }}>
                                  {result.data.home.specialization.map((area, index) => (
                                    <span
                                      key={index}
                                      style={{
                                        display: 'inline-block',
                                        backgroundColor: '#d4edda',
                                        color: '#155724',
                                        padding: '6px 12px',
                                        margin: '4px 8px 4px 0',
                                        borderRadius: '20px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        border: '1px solid #c3e6cb'
                                      }}
                                    >
                                      {area}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Detailed Tables Section */}
                        <div style={{ marginTop: '30px' }}>

                          {/* Education Table */}
                          {result.data.home?.education && result.data.home.education.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#007bff', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                🎓 Education Details
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Degree</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>University</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Year</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.home.education.map((edu, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{edu.degree || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{edu.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{edu.university || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{edu.graduationYear || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Teaching Experience Table */}
                          {result.data.experience?.teaching && result.data.experience.teaching.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#28a745', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                👨‍🏫 Teaching Experience
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #1e7e34', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Designation</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Department</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Institution</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Duration/Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.experience.teaching.map((exp, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#28a745' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{exp.designation || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.department || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.institution || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.duration || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Research Experience Table */}
                          {result.data.experience?.research && result.data.experience.research.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#6f42c1', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                🧪 Research Experience
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #5a2d91', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Designation</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Department</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Institution</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Duration/Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.experience.research.map((exp, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#6f42c1' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{exp.designation || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.department || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.institution || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.duration || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Industry Experience Table */}
                          {result.data.experience?.industry && result.data.experience.industry.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#e83e8c', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                🏭 Industry Experience
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#e83e8c', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dc1a6b', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Designation</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Company/Corporate</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Nature of Work</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.experience.industry.map((exp, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#e83e8c' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{exp.designation || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.company || exp.institution || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{exp.natureOfWork || exp.duration || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Research Guidance Table */}
                          {result.data.research_guidance?.phd_guidance && result.data.research_guidance.phd_guidance.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                🔬 PhD Research Guidance
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #c82333', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Student Name</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Registration No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Registration Date</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Thesis Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.research_guidance.phd_guidance.map((guidance, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#dc3545' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{guidance.studentName || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{guidance.registrationNo || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{guidance.registrationDate || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '300px', wordWrap: 'break-word' }}>{guidance.thesisTitle || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                                          <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: guidance.status === 'YES' ? '#d4edda' : '#f8d7da',
                                            color: guidance.status === 'YES' ? '#155724' : '#721c24',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                          }}>
                                            {guidance.status === 'YES' ? 'Completed' : 'In Progress'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Awards Table */}
                          {result.data.home?.awards && result.data.home.awards.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              <h5 style={{ color: '#fd7e14', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '600' }}>
                                🏆 Awards & Recognition
                              </h5>
                              <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dc6900', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Type</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Agency</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Year</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.home.awards.map((award, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#fd7e14' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{award.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{award.type || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{award.agency || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{award.year || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', color: '#28a745' }}>{award.amount || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ margin: '5px 0' }}><strong>Error:</strong> {result.error}</p>
                )}
              </div>
            </div>
          )}
          </div>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyImporter;