import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { saveChanges, CHANGE_TYPES } from '../changeTracker';

function ProjectStudents() {
  const [students, setStudents] = useState({
    pgStudents: [{
      student_name: '',
      registration_number: '',
      program: '',
      project_title: '',
      year_of_completion: '',
      supervisor: '',
      status: 'ongoing'
    }],
    phdStudents: [{
      student_name: '',
      registration_number: '',
      thesis_title: '',
      thesis_status: '',
      thesis_submission_date: '',
      viva_date: '',
      year_of_award: '',
      supervisor: ''
    }],
    postdocStudents: [{
      student_name: '',
      designation: '',
      funding_agency: '',
      fellowship_title: '',
      joining_date: '',
      completion_date: '',
      research_area: ''
    }]
  });

  const handleAddStudent = (category) => {
    const newStudents = { ...students };
    if (category === 'pg') {
      newStudents.pgStudents.push({
        student_name: '',
        registration_number: '',
        program: '',
        project_title: '',
        year_of_completion: '',
        supervisor: '',
        status: 'ongoing'
      });
    } else if (category === 'phd') {
      newStudents.phdStudents.push({
        student_name: '',
        registration_number: '',
        thesis_title: '',
        thesis_status: '',
        thesis_submission_date: '',
        viva_date: '',
        year_of_award: '',
        supervisor: ''
      });
    } else if (category === 'postdoc') {
      newStudents.postdocStudents.push({
        student_name: '',
        designation: '',
        funding_agency: '',
        fellowship_title: '',
        joining_date: '',
        completion_date: '',
        research_area: ''
      });
    }
    setStudents(newStudents);
  };

  const handleRemoveStudent = (category, index) => {
    const newStudents = { ...students };
    if (category === 'pg') {
      newStudents.pgStudents = newStudents.pgStudents.filter((_, i) => i !== index);
    } else if (category === 'phd') {
      newStudents.phdStudents = newStudents.phdStudents.filter((_, i) => i !== index);
    } else if (category === 'postdoc') {
      newStudents.postdocStudents = newStudents.postdocStudents.filter((_, i) => i !== index);
    }
    setStudents(newStudents);
  };

  const handleStudentChange = (category, index, field, value) => {
    const newStudents = { ...students };
    if (category === 'pg') {
      newStudents.pgStudents[index][field] = value;
    } else if (category === 'phd') {
      newStudents.phdStudents[index][field] = value;
    } else if (category === 'postdoc') {
      newStudents.postdocStudents[index][field] = value;
    }
    setStudents(newStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      saveChanges(CHANGE_TYPES.PROJECT_STUDENTS, students);
      alert('Project students changes saved successfully! Go to Dashboard to review and submit.');
    } catch (error) {
      console.error('Error saving project students changes:', error);
      alert('Error saving student information');
    }
  };

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        padding: '40px',
      }}>
        {/* Page Header */}
        <div style={{

        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0px',
            fontFamily: 'Segoe UI, Arial, sans-serif'
          }}>
            Project Students
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8
          }}>
            Manage your guided students and their academic progress
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PG Students Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '30px 40px 20px',
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              color: '#fff'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '10px' }}>🎓</span>
                  Postgraduate Students
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddStudent('pg')}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                >
                  ➕ Add PG Student
                </button>
              </div>
            </div>

            <div style={{ padding: '30px 40px' }}>
              {students.pgStudents.map((student, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '20px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  {students.pgStudents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent('pg', index)}
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
                      title="Remove Student"
                    >
                      ✕
                    </button>
                  )}

                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    marginBottom: '20px'
                  }}>
                    PG Student #{index + 1}
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Student Name *
                      </label>
                      <input
                        value={student.student_name}
                        onChange={(e) => handleStudentChange('pg', index, 'student_name', e.target.value)}
                        placeholder="Enter student name"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Registration Number
                      </label>
                      <input
                        value={student.registration_number}
                        onChange={(e) => handleStudentChange('pg', index, 'registration_number', e.target.value)}
                        placeholder="Enter registration number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Program
                      </label>
                      <select
                        value={student.program}
                        onChange={(e) => handleStudentChange('pg', index, 'program', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="">Select Program</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="M.Phil">M.Phil</option>
                        <option value="MBA">MBA</option>
                        <option value="MCA">MCA</option>
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
                        Year of Completion
                      </label>
                      <input
                        value={student.year_of_completion}
                        onChange={(e) => handleStudentChange('pg', index, 'year_of_completion', e.target.value)}
                        placeholder="2024"
                        type="number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Project Title
                      </label>
                      <input
                        value={student.project_title}
                        onChange={(e) => handleStudentChange('pg', index, 'project_title', e.target.value)}
                        placeholder="Enter project title"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
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
          </div>

          {/* PhD Students Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '30px 40px 20px',
              background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
              color: '#fff'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '10px' }}>🔬</span>
                  PhD Students
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddStudent('phd')}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                >
                  ➕ Add PhD Student
                </button>
              </div>
            </div>

            <div style={{ padding: '30px 40px' }}>
              {students.phdStudents.map((student, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '20px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  {students.phdStudents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent('phd', index)}
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
                      title="Remove Student"
                    >
                      ✕
                    </button>
                  )}

                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    marginBottom: '20px'
                  }}>
                    PhD Student #{index + 1}
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Student Name *
                      </label>
                      <input
                        value={student.student_name}
                        onChange={(e) => handleStudentChange('phd', index, 'student_name', e.target.value)}
                        placeholder="Enter student name"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Registration Number
                      </label>
                      <input
                        value={student.registration_number}
                        onChange={(e) => handleStudentChange('phd', index, 'registration_number', e.target.value)}
                        placeholder="Enter registration number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Thesis Status
                      </label>
                      <select
                        value={student.thesis_status}
                        onChange={(e) => handleStudentChange('phd', index, 'thesis_status', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Defended">Defended</option>
                        <option value="Completed">Completed</option>
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
                        Year of Award
                      </label>
                      <input
                        value={student.year_of_award}
                        onChange={(e) => handleStudentChange('phd', index, 'year_of_award', e.target.value)}
                        placeholder="2024"
                        type="number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Thesis Title
                      </label>
                      <input
                        value={student.thesis_title}
                        onChange={(e) => handleStudentChange('phd', index, 'thesis_title', e.target.value)}
                        placeholder="Enter thesis title"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
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
          </div>

          {/* Postdoc Students Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '30px 40px 20px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: '#fff'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '10px' }}>👨‍💼</span>
                  Postdoc Students
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddStudent('postdoc')}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                >
                  ➕ Add Postdoc Student
                </button>
              </div>
            </div>

            <div style={{ padding: '30px 40px' }}>
              {students.postdocStudents.map((student, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '20px',
                  background: '#f8fafc',
                  position: 'relative'
                }}>
                  {students.postdocStudents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent('postdoc', index)}
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
                      title="Remove Student"
                    >
                      ✕
                    </button>
                  )}

                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    marginBottom: '20px'
                  }}>
                    Postdoc Student #{index + 1}
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Student Name *
                      </label>
                      <input
                        value={student.student_name}
                        onChange={(e) => handleStudentChange('postdoc', index, 'student_name', e.target.value)}
                        placeholder="Enter student name"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Designation
                      </label>
                      <input
                        value={student.designation}
                        onChange={(e) => handleStudentChange('postdoc', index, 'designation', e.target.value)}
                        placeholder="Enter designation"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Funding Agency
                      </label>
                      <input
                        value={student.funding_agency}
                        onChange={(e) => handleStudentChange('postdoc', index, 'funding_agency', e.target.value)}
                        placeholder="Enter funding agency"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Fellowship Title
                      </label>
                      <input
                        value={student.fellowship_title}
                        onChange={(e) => handleStudentChange('postdoc', index, 'fellowship_title', e.target.value)}
                        placeholder="Enter fellowship title"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Joining Date
                      </label>
                      <input
                        value={student.joining_date}
                        onChange={(e) => handleStudentChange('postdoc', index, 'joining_date', e.target.value)}
                        type="date"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
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
                        Completion Date
                      </label>
                      <input
                        value={student.completion_date}
                        onChange={(e) => handleStudentChange('postdoc', index, 'completion_date', e.target.value)}
                        type="date"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        color: '#374151',
                        fontSize: '0.95rem'
                      }}>
                        Research Area
                      </label>
                      <textarea
                        value={student.research_area}
                        onChange={(e) => handleStudentChange('postdoc', index, 'research_area', e.target.value)}
                        placeholder="Describe research area"
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
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
          </div>

          {/* Submit Button Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '30px 40px',
            textAlign: 'center'
          }}>
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
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ProjectStudents;