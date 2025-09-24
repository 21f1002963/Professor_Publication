import React, { useState, useEffect } from 'react';
import Layout from './Layout';

function FacultyManagement() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    useEffect(() => {
        fetchFacultyList();
    }, []);

    const fetchFacultyList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/hod/faculty-list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFacultyList(data.faculty);
            } else {
                // Mock data for demonstration
                setFacultyList([
                    { _id: '1', name: 'Dr. John Smith', email: 'john@pu.edu', role: 'faculty', profileStatus: 'approved', joinedDate: '2023-01-15' },
                    { _id: '2', name: 'Dr. Sarah Johnson', email: 'sarah@pu.edu', role: 'faculty', profileStatus: 'pending', joinedDate: '2023-02-20' },
                    { _id: '3', name: 'Prof. Michael Brown', email: 'michael@pu.edu', role: 'faculty', profileStatus: 'approved', joinedDate: '2022-09-10' },
                    { _id: '4', name: 'Dr. Emily Davis', email: 'emily@pu.edu', role: 'faculty', profileStatus: 'denied', joinedDate: '2023-03-05' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching faculty list:', error);
            // Mock data for demonstration
            setFacultyList([
                { _id: '1', name: 'Dr. John Smith', email: 'john@pu.edu', role: 'faculty', profileStatus: 'approved', joinedDate: '2023-01-15' },
                { _id: '2', name: 'Dr. Sarah Johnson', email: 'sarah@pu.edu', role: 'faculty', profileStatus: 'pending', joinedDate: '2023-02-20' },
                { _id: '3', name: 'Prof. Michael Brown', email: 'michael@pu.edu', role: 'faculty', profileStatus: 'approved', joinedDate: '2022-09-10' },
                { _id: '4', name: 'Dr. Emily Davis', email: 'emily@pu.edu', role: 'faculty', profileStatus: 'denied', joinedDate: '2023-03-05' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'denied': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusBadge = (status) => {
        const color = getStatusColor(status);
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: `${color}20`,
                color: color,
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading faculty list...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>
                        Faculty Management
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        Manage and monitor all faculty members in your department
                    </p>

                    {/* Faculty Statistics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            padding: '30px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', opacity: 0.9 }}>Total Faculty</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{facultyList.length}</div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: '#fff',
                            padding: '30px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', opacity: 0.9 }}>Pending Approval</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                                {facultyList.filter(f => f.profileStatus === 'pending').length}
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: '#fff',
                            padding: '30px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', opacity: 0.9 }}>Approved</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                                {facultyList.filter(f => f.profileStatus === 'approved').length}
                            </div>
                        </div>
                    </div>

                    {/* Faculty List Table */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '30px 30px 0 30px',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                margin: '0 0 20px 0'
                            }}>
                                Faculty Directory
                            </h2>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb' }}>
                                        <th style={{
                                            padding: '15px 30px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Name</th>
                                        <th style={{
                                            padding: '15px 30px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Email</th>
                                        <th style={{
                                            padding: '15px 30px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Status</th>
                                        <th style={{
                                            padding: '15px 30px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Joined</th>
                                        <th style={{
                                            padding: '15px 30px',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facultyList.map((faculty, index) => (
                                        <tr key={faculty._id} style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            transition: 'background-color 0.2s'
                                        }}>
                                            <td style={{
                                                padding: '20px 30px',
                                                fontWeight: '500',
                                                color: '#1f2937'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#6366f1',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '600',
                                                        fontSize: '1rem'
                                                    }}>
                                                        {faculty.name.charAt(0)}
                                                    </div>
                                                    {faculty.name}
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '20px 30px',
                                                color: '#6b7280'
                                            }}>
                                                {faculty.email}
                                            </td>
                                            <td style={{
                                                padding: '20px 30px'
                                            }}>
                                                {getStatusBadge(faculty.profileStatus)}
                                            </td>
                                            <td style={{
                                                padding: '20px 30px',
                                                color: '#6b7280'
                                            }}>
                                                {new Date(faculty.joinedDate).toLocaleDateString()}
                                            </td>
                                            <td style={{
                                                padding: '20px 30px',
                                                textAlign: 'center'
                                            }}>
                                                <button
                                                    onClick={() => setSelectedFaculty(faculty)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#6366f1',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#5856eb'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Faculty Details Modal */}
                {selectedFaculty && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }} onClick={() => setSelectedFaculty(null)}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                        }} onClick={(e) => e.stopPropagation()}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                marginBottom: '20px'
                            }}>
                                Faculty Details
                            </h3>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>Name:</strong> {selectedFaculty.name}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Email:</strong> {selectedFaculty.email}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Role:</strong> {selectedFaculty.role}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Status:</strong> {getStatusBadge(selectedFaculty.profileStatus)}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <strong>Joined:</strong> {new Date(selectedFaculty.joinedDate).toLocaleDateString()}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setSelectedFaculty(null)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6b7280',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        alert('View Profile functionality would be implemented here');
                                        setSelectedFaculty(null);
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6366f1',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default FacultyManagement;