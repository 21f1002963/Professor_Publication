import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getApiUrl } from '../config/api';

const FacultyImporter = () => {
  const [nodeId, setNodeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // State for managing table visibility
  const [tableVisibility, setTableVisibility] = useState({
    education: true,
    teachingExperience: true,
    researchExperience: true,
    industryExperience: true,
    phdGuidance: true,
    awards: true,
    innovationContributions: true,
    patentDetails: true,
    ugcPapers: true,
    nonUgcPapers: true,
    conferencePapers: true,
    authoredBooks: true,
    bookChapters: true,
    editedBooks: true,
    ongoingProjects: true,
    ongoingConsultancy: true,
    completedProjects: true,
    completedConsultancy: true
  });

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

  // Function to toggle table visibility
  const toggleTableVisibility = (tableName) => {
    setTableVisibility(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  // Helper function to create table header with hide button
  const createTableHeader = (title, tableName, color) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
      <h5 style={{ color: color, fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
        {title}
      </h5>
      <button
        onClick={() => toggleTableVisibility(tableName)}
        style={{
          backgroundColor: 'transparent',
          border: `1px solid ${color}`,
          borderRadius: '4px',
          color: color,
          padding: '4px 8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = color;
          e.target.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = color;
        }}
      >
        {tableVisibility[tableName] ? '👁️ Hide' : '👁️‍🗨️ Show'}
      </button>
    </div>
  );

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
                              {createTableHeader('🎓 Education Details', 'education', '#007bff')}
                              {tableVisibility.education && (
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
                              )}
                            </div>
                          )}

                          {/* Teaching Experience Table */}
                          {result.data.experience?.teaching && result.data.experience.teaching.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('👨‍🏫 Teaching Experience', 'teachingExperience', '#28a745')}
                              {tableVisibility.teachingExperience && (
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
                              )}
                            </div>
                          )}

                          {/* Research Experience Table */}
                          {result.data.experience?.research && result.data.experience.research.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🧪 Research Experience', 'researchExperience', '#6f42c1')}
                              {tableVisibility.researchExperience && (
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
                              )}
                            </div>
                          )}

                          {/* Industry Experience Table */}
                          {result.data.experience?.industry && result.data.experience.industry.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🏭 Industry Experience', 'industryExperience', '#e83e8c')}
                              {tableVisibility.industryExperience && (
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
                              )}
                            </div>
                          )}

                          {/* Research Guidance Table */}
                          {result.data.research_guidance?.phd_guidance && result.data.research_guidance.phd_guidance.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🔬 PhD Research Guidance', 'phdGuidance', '#dc3545')}
                              {tableVisibility.phdGuidance && (
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
                              )}
                            </div>
                          )}

                          {/* Awards Table */}
                          {result.data.home?.awards && result.data.home.awards.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🏆 Awards & Recognition', 'awards', '#fd7e14')}
                              {tableVisibility.awards && (
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
                              )}
                            </div>
                          )}



                          {/* Innovation Contributions Table */}
                          {result.data.innovation?.contributions && result.data.innovation.contributions.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🔬 Contribution towards Innovation', 'innovationContributions', '#6610f2')}
                              {tableVisibility.innovationContributions && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#6610f2', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #520dc2', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #520dc2' }}>Name of the Work/Contribution</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #520dc2' }}>Specialization</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #520dc2' }}>Remarks</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.innovation.contributions.map((contrib, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#6610f2' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500' }}>{contrib.workName || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{contrib.specialization || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{contrib.remarks || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Patent Details Table */}
                          {result.data.innovation?.patents && result.data.innovation.patents.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📜 Patent Details', 'patentDetails', '#20c997')}
                              {tableVisibility.patentDetails && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#20c997', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #1aa179', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Status</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Patent Number</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Year of Award</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Type</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1aa179' }}>Commercialized Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.innovation.patents.map((patent, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#20c997' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '250px', wordWrap: 'break-word' }}>{patent.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                                          <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: patent.status?.toLowerCase() === 'granted' ? '#d4edda' : '#fff3cd',
                                            color: patent.status?.toLowerCase() === 'granted' ? '#155724' : '#856404',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                          }}>
                                            {patent.status || 'N/A'}
                                          </span>
                                        </td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{patent.patentNumber || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{patent.yearOfAward || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{patent.type || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                                          <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: patent.commercializedStatus?.toLowerCase() === 'yes' ? '#d1ecf1' : '#f8d7da',
                                            color: patent.commercializedStatus?.toLowerCase() === 'yes' ? '#0c5460' : '#721c24',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                          }}>
                                            {patent.commercializedStatus || 'N/A'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* UGC Approved Papers Table */}
                          {result.data.innovation?.ugc_papers && result.data.innovation.ugc_papers.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📚 Papers Published in UGC Approved Journals', 'ugcPapers', '#0d6efd')}
                              {tableVisibility.ugcPapers && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #0a58ca', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Authors</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Journal Name</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Volume, Issue & Page Nos.</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Year</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0a58ca' }}>Impact Factor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.innovation.ugc_papers.map((paper, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#0d6efd' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{paper.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{paper.authors || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.journalName || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.volumeIssuePages || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.year || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', color: '#198754' }}>{paper.impactFactor || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Non-UGC Papers Table */}
                          {result.data.innovation?.non_ugc_papers && result.data.innovation.non_ugc_papers.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📄 Papers Published in Non UGC Approved Peer Reviewed Journals', 'nonUgcPapers', '#6f42c1')}
                              {tableVisibility.nonUgcPapers && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #5a2d91', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Authors</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Journal Name</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Volume, Issue & Page Nos.</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Year</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Impact Factor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.innovation.non_ugc_papers.map((paper, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#6f42c1' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{paper.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{paper.authors || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.journalName || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.volumeIssuePages || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.year || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', color: '#198754' }}>{paper.impactFactor || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Conference Papers Table */}
                          {result.data.innovation?.conference_papers && result.data.innovation.conference_papers.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('🎤 Papers Published in Conference Proceedings', 'conferencePapers', '#fd7e14')}
                              {tableVisibility.conferencePapers && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dc6900', width: '60px' }}>S.No</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Title</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Authors</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Details of Conference Publication</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Page Nos.</th>
                                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc6900' }}>Year</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.data.innovation.conference_papers.map((paper, index) => (
                                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#fd7e14' }}>{index + 1}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{paper.title || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{paper.authors || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '250px', wordWrap: 'break-word' }}>{paper.conferenceDetails || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.pageNos || 'N/A'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{paper.year || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Books Table */}
                          {result.data.books?.authored_books && result.data.books.authored_books.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📚 Books', 'authoredBooks', '#17a2b8')}
                              {tableVisibility.authoredBooks && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #138496', width: '60px' }}>S.No</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #138496' }}>Title of the Book</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #138496' }}>Name of the Authors as per the order in Book</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #138496' }}>Publisher</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #138496' }}>Year</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #138496' }}>ISBN No.</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {result.data.books.authored_books.map((book, index) => (
                                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#17a2b8' }}>{index + 1}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{book.title || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '250px', wordWrap: 'break-word' }}>{book.authors || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.publisher || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.year || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.isbn || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Chapters in Books Table */}
                          {result.data.books?.book_chapters && result.data.books.book_chapters.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📖 Chapters in Books', 'bookChapters', '#e83e8c')}
                              {tableVisibility.bookChapters && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#e83e8c', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dc1a6b', width: '60px' }}>S.No</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Title of the Chapters</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Name of the Authors</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Title of the Book</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Publisher</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>Year</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dc1a6b' }}>ISBN No.</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {result.data.books.book_chapters.map((chapter, index) => (
                                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#e83e8c' }}>{index + 1}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '280px', wordWrap: 'break-word' }}>{chapter.chapterTitle || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{chapter.authors || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '250px', wordWrap: 'break-word' }}>{chapter.bookTitle || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{chapter.publisher || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{chapter.year || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{chapter.isbn || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Edited Books Table */}
                          {result.data.books?.edited_books && result.data.books.edited_books.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                              {createTableHeader('📝 Edited Books', 'editedBooks', '#6f42c1')}
                              {tableVisibility.editedBooks && (
                                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #5a2d91', width: '60px' }}>S.No</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Title of the Book</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Name of the Authors as per the order in Book</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Publisher</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>Year</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #5a2d91' }}>ISBN No.</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {result.data.books.edited_books.map((book, index) => (
                                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#6f42c1' }}>{index + 1}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{book.title || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '250px', wordWrap: 'break-word' }}>{book.authors || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.publisher || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.year || 'N/A'}</td>
                                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{book.isbn || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Projects/Consultancy Tables */}
                          {result.data.projects && (
                            <div style={{ marginTop: '40px' }}>
                              <h3 style={{ color: '#007bff', fontSize: '24px', marginBottom: '20px', fontWeight: '600', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                                📊 Projects & Consultancy
                              </h3>
                              
                              {/* Table 1 - Ongoing Projects */}
                              <div style={{ marginBottom: '30px' }}>
                                {createTableHeader('🚀 Ongoing Projects', 'ongoingProjects', '#28a745')}
                                {tableVisibility.ongoingProjects && (
                                  <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #1e7e34', width: '60px' }}>S.No</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Title of the Project</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Sponsored By</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Period</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Sanctioned Amount(Rs. Lakh)</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #1e7e34' }}>Year</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {result.data.projects.ongoing_projects.map((project, index) => (
                                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#28a745' }}>{index + 1}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{project.title || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{project.sponsoredBy || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.period || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.sanctionedAmount || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.year || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Table 2 - Ongoing Consultancy Works */}
                              <div style={{ marginBottom: '30px' }}>
                                {createTableHeader('💼 Ongoing Consultancy Works', 'ongoingConsultancy', '#fd7e14')}
                                {tableVisibility.ongoingConsultancy && (
                                  <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#fd7e14', color: 'white' }}>
                                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e55a00', width: '60px' }}>S.No</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e55a00' }}>Title of the Consultancy Work</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e55a00' }}>Sponsored By</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e55a00' }}>Period</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e55a00' }}>Sanctioned Amount(Rs. Lakh)</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e55a00' }}>Year</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {result.data.projects.ongoing_consultancy.map((consultancy, index) => (
                                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#fd7e14' }}>{index + 1}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{consultancy.title || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{consultancy.sponsoredBy || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.period || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.sanctionedAmount || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.year || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Table 3 - Completed Projects */}
                              <div style={{ marginBottom: '30px' }}>
                                {createTableHeader('✅ Completed Projects', 'completedProjects', '#17a2b8')}
                                {tableVisibility.completedProjects && (
                                  <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #117a8b', width: '60px' }}>S.No</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #117a8b' }}>Title of the Project</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #117a8b' }}>Sponsored By</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #117a8b' }}>Period</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #117a8b' }}>Sanctioned Amount(Rs. Lakh)</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #117a8b' }}>Year</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {result.data.projects.completed_projects.map((project, index) => (
                                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#17a2b8' }}>{index + 1}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{project.title || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{project.sponsoredBy || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.period || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.sanctionedAmount || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{project.year || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Table 4 - Completed Consultancy Works */}
                              <div style={{ marginBottom: '30px' }}>
                                {createTableHeader('🏆 Completed Consultancy Works', 'completedConsultancy', '#dc3545')}
                                {tableVisibility.completedConsultancy && (
                                  <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                          <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #c82333', width: '60px' }}>S.No</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Title of the Consultancy Work</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Sponsored By</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Period</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Sanctioned Amount(Rs. Lakh)</th>
                                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #c82333' }}>Year</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {result.data.projects.completed_consultancy.map((consultancy, index) => (
                                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: '600', color: '#dc3545' }}>{index + 1}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: '500', maxWidth: '300px', wordWrap: 'break-word' }}>{consultancy.title || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', maxWidth: '200px', wordWrap: 'break-word' }}>{consultancy.sponsoredBy || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.period || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.sanctionedAmount || 'N/A'}</td>
                                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{consultancy.year || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
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