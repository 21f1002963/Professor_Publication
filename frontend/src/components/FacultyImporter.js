import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const FacultyImporter = () => {
  const [nodeId, setNodeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('/');
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
      console.log('Sending request to:', '/api/scraper/faculty');
      console.log('Request body:', { nodeId });
      
      const response = await fetch('/api/scraper/faculty', {
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
          
          {/* Backend Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: backendStatus === 'connected' ? '#4CAF50' : 
                            backendStatus === 'disconnected' ? '#f44336' : '#ff9800',
            color: 'white',
            fontWeight: 'bold'
          }}>
            <span style={{ marginRight: '10px' }}>
              {backendStatus === 'connected' ? '🟢' : 
               backendStatus === 'disconnected' ? '🔴' : '🟡'}
            </span>
            Backend Status: {
              backendStatus === 'connected' ? 'Connected' :
              backendStatus === 'disconnected' ? 'Disconnected - Make sure backend is running on port 5000' :
              'Checking...'
            }
          </div>
          
          <p style={{ margin: '0 0 30px 0', color: '#7f8c8d', fontSize: '1.3rem' }}>
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
            padding: '35px',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
            border: '1px solid #e9ecef',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)'
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
                    <p style={{ margin: '5px 0' }}>Faculty data imported and saved successfully!</p>
                    {result.data && (
                      <div style={{ marginTop: '20px' }}>
                        <h5 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.2rem' }}>
                          Faculty Data Preview
                        </h5>
                        
                        {/* Basic Information */}
                        <div style={{ 
                          marginBottom: '20px', 
                          padding: '15px', 
                          backgroundColor: 'white', 
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        }}>
                          <h6 style={{ color: '#2c3e50', marginBottom: '10px' }}>Basic Information</h6>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
                            <div><strong>Name:</strong> {result.data.name || 'N/A'}</div>
                            <div><strong>Department:</strong> {result.data.department || 'N/A'}</div>
                            <div><strong>Designation:</strong> {result.data.designation || 'N/A'}</div>
                            <div><strong>Email:</strong> {result.data.email || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Data Sections Grid */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                          gap: '15px' 
                        }}>
                          {result.data.education && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#007bff', marginBottom: '8px' }}>Education</h6>
                              <div style={{ fontSize: '14px' }}>
                                {result.data.education.length} qualification(s)
                              </div>
                            </div>
                          )}

                          {result.data.experience && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#28a745', marginBottom: '8px' }}>Experience</h6>
                              <div style={{ fontSize: '14px' }}>
                                {result.data.experience.length} position(s)
                              </div>
                            </div>
                          )}

                          {result.data.research_guidance && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#dc3545', marginBottom: '8px' }}>Research Guidance</h6>
                              <div style={{ fontSize: '14px' }}>
                                <div>PhD: {result.data.research_guidance.phd_completed?.length || 0} completed</div>
                                <div>MPhil: {result.data.research_guidance.mphil_completed?.length || 0} completed</div>
                              </div>
                            </div>
                          )}

                          {result.data.awards && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#fd7e14', marginBottom: '8px' }}>Awards</h6>
                              <div style={{ fontSize: '14px' }}>
                                {result.data.awards.length} award(s)
                              </div>
                            </div>
                          )}

                          {result.data.publications && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#20c997', marginBottom: '8px' }}>Publications</h6>
                              <div style={{ fontSize: '14px' }}>
                                <div>Journal Articles: {result.data.publications.journal_articles?.length || 0} entries</div>
                                <div>Conference Papers: {result.data.publications.conference_papers?.length || 0} entries</div>
                              </div>
                            </div>
                          )}

                          {result.data.innovation && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#ffc107', marginBottom: '8px' }}>Innovation</h6>
                              <div style={{ fontSize: '14px' }}>
                                <div>UGC Papers: {result.data.innovation.ugc_papers?.length || 0} entries</div>
                                <div>Patents: {result.data.innovation.patents?.length || 0} entries</div>
                                <div>Contributions: {result.data.innovation.contributions?.length || 0} entries</div>
                              </div>
                            </div>
                          )}

                          {result.data.books && (
                            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 style={{ color: '#6f42c1', marginBottom: '8px' }}>Books</h6>
                              <div style={{ fontSize: '14px' }}>
                                <div>Authored Books: {result.data.books.authored_books?.length || 0} entries</div>
                                <div>Book Chapters: {result.data.books.book_chapters?.length || 0} entries</div>
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