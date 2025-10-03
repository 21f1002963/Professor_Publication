import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";

function Profile() {
  const [profile, setProfile] = useState({
    // Personal Information
    // Faculty Information
    department: "",
    designation: "",
    employee_id: "",
    date_of_joining: "",
    qualification: "",
    experience_years: "",
    subjects_taught: [""],
    research_interests: [""],
    office_location: "",
    office_hours: "",

    // Complex Arrays
    education: [
      {
        degree: "",
        title: "",
        university: "",
        graduationYear: "",
      },
    ],
    awards: [
      {
        title: "",
        type: "",
        agency: "",
        year: "",
        amount: "",
      },
    ],
    teaching_experience: [
      {
        designation: "",
        department: "",
        institution: "",
        from: "",
        to: "",
      },
    ],
    research_experience: [
      {
        position: "",
        organization: "",
        duration: "",
        research_area: "",
      },
    ],
    industry_experience: [
      {
        position: "",
        company: "",
        duration: "",
        role: "",
      },
    ],
    contribution_to_innovation: [
      {
        title: "",
        description: "",
        year: "",
        impact: "",
      },
    ],
    patents: [
      {
        title: "",
        patent_number: "",
        status: "",
        year: "",
        co_inventors: "",
      },
    ],
    publications: [
      {
        title: "",
        authors: "",
        journal: "",
        volume: "",
        issue: "",
        pages: "",
        year: "",
        doi: "",
        type: "",
      },
    ],
    books: [
      {
        title: "",
        authors: "",
        publisher: "",
        isbn: "",
        year: "",
      },
    ],
    chapters_in_books: [
      {
        chapter_title: "",
        book_title: "",
        editors: "",
        publisher: "",
        pages: "",
        year: "",
      },
    ],
    edited_books: [
      {
        title: "",
        editors: "",
        publisher: "",
        isbn: "",
        year: "",
      },
    ],
    projects: [
      {
        title: "",
        funding_agency: "",
        amount: "",
        duration: "",
        role: "",
        status: "",
      },
    ],
    consultancy_works: [
      {
        title: "",
        organization: "",
        amount: "",
        duration: "",
        status: "",
      },
    ],
    pg_student_guided: [
      {
        student_name: "",
        thesis_title: "",
        year_of_completion: "",
        current_status: "",
      },
    ],
    phd_student_guided: [
      {
        student_name: "",
        thesis_title: "",
        thesis_status: "",
        thesis_submission_date: "",
        viva_date: "",
        year_of_award: "",
      },
    ],
    postdoc_student_guided: [
      {
        student_name: "",
        designation: "",
        funding_agency: "",
        fellowship_title: "",
        joining_date: "",
        completion_date: "",
      },
    ],
    invited_talks: [
      {
        title: "",
        conference_seminar_workshop_trainingProgram: "",
        organization: "",
        level: "",
        from: "",
        to: "",
        year: "",
      },
    ],
    conferences_seminar_: [
      {
        title: "",
        sponsors: "",
        venue: "",
        duration: "",
        level: "",
        from: "",
        to: "",
        year: "",
      },
    ],
    administrative_responsibilities: [
      {
        position: "",
        organization: "",
        duration: "",
        nature_of_duty: "",
      },
    ],
    affliations: [
      {
        position: "",
        organization: "",
        duration: "",
        nature: "",
      },
    ],
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewingMode, setViewingMode] = useState('own'); // 'own' or 'viewing'
  const [viewedProfessorName, setViewedProfessorName] = useState('');

  // Additional data for comprehensive profile view (HOD viewing)
  const [experienceData, setExperienceData] = useState(null);
  const [publicationsData, setPublicationsData] = useState(null);
  const [patentsData, setPatentsData] = useState(null);
  const [booksData, setBooksData] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [conferenceData, setConferenceData] = useState(null);
  const [participationData, setParticipationData] = useState(null);
  const [programmeData, setProgrammeData] = useState(null);

  // React Router hooks
  const { professorId } = useParams();
  const navigate = useNavigate();

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImagePreview(e.target.result);
          // Update profile state with image
          setProfile(prev => ({
            ...prev,
            profileImage: e.target.result
          }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if HOD is viewing another professor's profile using URL parameter
    if (professorId) {
      setViewingMode('viewing');
      fetchViewingProfile(professorId);
      // Also fetch comprehensive data for HOD viewing
      fetchComprehensiveData(professorId);
    } else {
      setViewingMode('own');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setProfile((prev) => ({
            ...prev,
            name: decoded.name,
            email: decoded.email,
            department: prev.department || "Computer Science", // Default value
          }));
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      fetchProfile();
    }
  }, [professorId]); // Add professorId as dependency

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/professor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Function to fetch another professor's profile (HOD viewing mode)
  const fetchViewingProfile = async (professorId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log('Attempting to fetch profile for professor ID:', professorId);
      const response = await fetch(
        `http://localhost:5000/api/professor/profile/${professorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfile(data);
        setViewedProfessorName(data.name || 'Professor');
      } else {
        const errorData = await response.text();
        console.error("Failed to fetch professor profile. Status:", response.status, "Error:", errorData);
        alert(`Failed to load professor profile. Status: ${response.status}. Error: ${errorData}`);
      }
    } catch (error) {
      console.error("Error fetching professor profile:", error);
      alert(`Error loading professor profile: ${error.message}`);
    }
  };

  // Function to fetch all comprehensive data for HOD viewing
  const fetchComprehensiveData = async (professorId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch all data endpoints for comprehensive profile view
      const endpoints = [
        { name: 'experience', url: `http://localhost:5000/api/professor/experience/${professorId}`, setter: setExperienceData },
        { name: 'publications', url: `http://localhost:5000/api/professor/publications/${professorId}`, setter: setPublicationsData },
        { name: 'patents', url: `http://localhost:5000/api/professor/patents/${professorId}`, setter: setPatentsData },
        { name: 'books', url: `http://localhost:5000/api/professor/books/${professorId}`, setter: setBooksData },
        { name: 'research', url: `http://localhost:5000/api/professor/research-guidance/${professorId}`, setter: setResearchData },
        { name: 'projects', url: `http://localhost:5000/api/professor/project-consultancy/${professorId}`, setter: setProjectData },
        { name: 'education', url: `http://localhost:5000/api/professor/e-education/${professorId}`, setter: setEducationData },
        { name: 'conferences', url: `http://localhost:5000/api/professor/conference-seminar-workshop/${professorId}`, setter: setConferenceData },
        { name: 'participation', url: `http://localhost:5000/api/professor/participation-collaboration/${professorId}`, setter: setParticipationData },
        { name: 'programmes', url: `http://localhost:5000/api/professor/programme/${professorId}`, setter: setProgrammeData }
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            endpoint.setter(data);
          } else {
            console.log(`No ${endpoint.name} data available for this professor`);
            endpoint.setter(null);
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint.name}:`, error);
          endpoint.setter(null);
        }
      }
    } catch (error) {
      console.error("Error fetching comprehensive data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if in viewing mode
    if (viewingMode === 'viewing') {
      alert('Cannot edit profile in viewing mode.');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }

      // Send profile data directly to backend for immediate saving
      const response = await fetch("http://localhost:5000/api/professor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Profile updated successfully!");
        console.log("Profile saved:", data.profile);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
  };

  // Get input style with disabled state for viewing mode
  const getInputStyle = (isDisabled = false) => ({
    width: "100%",
    padding: "12px 16px",
    border: isDisabled ? "2px solid #e2e8f0" : "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: isDisabled ? "#f7fafc" : "#fff",
    color: isDisabled ? "#718096" : "#2d3748",
    cursor: isDisabled ? "not-allowed" : "text"
  });

  const isDisabled = viewingMode === 'viewing';

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName) => {
    const defaultItems = {
      education: { degree: "", title: "", university: "", graduationYear: "" },
      awards: { title: "", type: "", agency: "", year: "", amount: "" },
      teaching_experience: {
        designation: "",
        department: "",
        institution: "",
        from: "",
        to: "",
      },
      // Add other defaults as needed
    };

    setProfile((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItems[arrayName] || {}],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
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
              margin: "0 0 10px 0",
              fontFamily: "Segoe UI, Arial, sans-serif",
            }}
          >
            {viewingMode === 'viewing' ? `${viewedProfessorName}` : 'Faculty Profile'}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.8,
            }}
          >
          </p>

        </div>
        <div
          style={{
            maxWidth: "87vw",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div
              style={{
                padding: "5px 30px 30px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#2d3748",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: "Segoe UI, Arial, sans-serif",
                  letterSpacing: "0.5px",
                  marginBottom: "25px",
                }}
              >
                Profile Picture
              </h2>

              {/* Profile Picture Upload Section */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '40px',
                padding: '10px',
                borderRadius: '15px',
                background: '#f8fafc'
              }}>
                {/* Image Preview */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '3rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  border: '4px solid #fff',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  {imagePreview || profile.profileImage ? (
                    <img
                      src={imagePreview || profile.profileImage}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    <span>{profile.name?.charAt(0) || '👤'}</span>
                  )}
                </div>

                {/* Upload Button */}
                {!isDisabled && (
                  <label style={{
                    background: 'linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📷 {imagePreview ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}

                {!isDisabled && selectedImage && (
                  <p style={{
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>

              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#2d3748",
                  marginBottom: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: "Segoe UI, Arial, sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                Personal Information
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isDisabled}
                    style={getInputStyle(isDisabled)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isDisabled}
                    style={getInputStyle(isDisabled)}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    value={profile.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter your designation"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#4a5568",
                    }}
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter your department"
                  />
                </div>
              </div>

              {/* Educational Qualifications Section */}
              <div style={{ marginTop: "40px" }}>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Segoe UI, Arial, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Educational Qualifications
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "10px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th
                        style={{
                          width: "60px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          width: "180px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Degree
                      </th>
                      <th
                        style={{
                          width: "250px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Subject/Title of Thesis
                      </th>
                      <th
                        style={{
                          width: "200px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        University/Board
                      </th>
                      <th
                        style={{
                          width: "120px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Year of Passing
                      </th>
                      <th
                        style={{
                          width: "80px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.education.map((edu, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            width: "60px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            width: "180px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                idx,
                                "degree",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "210px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Degree"
                          />
                        </td>
                        <td
                          style={{
                            width: "220px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={edu.title}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                idx,
                                "title",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "350px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Subject/Title of Thesis"
                          />
                        </td>
                        <td
                          style={{
                            width: "200px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={edu.university}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                idx,
                                "university",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "220px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="University/Board"
                          />
                        </td>
                        <td
                          style={{
                            width: "120px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                idx,
                                "graduationYear",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "150px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Year of Passing"
                          />
                        </td>
                        <td
                          style={{
                            width: "80px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                          }}
                        >
                          {!isDisabled && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("education", idx)}
                              style={{
                                background: "#e53e3e",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isDisabled && (
                  <button
                    type="button"
                    onClick={() => addArrayItem("education")}
                    style={{
                      background: "#3182ce",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "1rem",
                      marginTop: "5px",
                    }}
                  >
                    Add Qualification
                  </button>
                )}
              </div>

              <div
                style={{
                  margin: "0",
                  background: "#fff",
                  borderRadius: "20px",
                  maxWidth: "87vw",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Segoe UI, Arial, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Area of Specialization
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {Array.isArray(profile.area_of_expertise) ? (
                    profile.area_of_expertise.map((spec, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => {
                            const newSpecs = [...profile.area_of_expertise];
                            newSpecs[idx] = e.target.value;
                            setProfile((prev) => ({
                              ...prev,
                              area_of_expertise: newSpecs,
                            }));
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            transition: "border-color 0.3s ease",
                            boxSizing: "border-box",
                            fontFamily: "Segoe UI, Arial, sans-serif",
                          }}
                          placeholder={`Specialization ${idx + 1}`}
                        />
                        {!isDisabled && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfile((prev) => ({
                                ...prev,
                                area_of_expertise: prev.area_of_expertise.filter(
                                  (_, i) => i !== idx
                                ),
                              }));
                            }}
                            style={{
                              background: "#e53e3e",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 10px",
                              cursor: "pointer",
                              fontSize: "0.95rem",
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="text"
                        value={profile.area_of_expertise}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            area_of_expertise: [e.target.value],
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          transition: "border-color 0.3s ease",
                          boxSizing: "border-box",
                          fontFamily: "Segoe UI, Arial, sans-serif",
                        }}
                        placeholder="Specialization 1"
                      />

                    </div>
                  )}
                </div>
                {!isDisabled && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        area_of_expertise: [
                          ...(Array.isArray(prev.area_of_expertise)
                            ? prev.area_of_expertise
                            : [prev.area_of_expertise]),
                          "",
                        ],
                      }))
                    }
                    style={{
                      background: "#3182ce",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "1rem",
                      marginTop: "15px",
                    }}
                  >
                    Add Specialization
                  </button>
                )}
              </div>

              {/* Awards / Prizes Conferred Section */}
              <div style={{ marginTop: "40px" }}>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Segoe UI, Arial, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Awards / Prizes Conferred
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "10px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th
                        style={{
                          width: "60px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          width: "220px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Name / Title of the Award
                      </th>
                      <th
                        style={{
                          width: "120px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Type
                      </th>
                      <th
                        style={{
                          width: "220px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Name of the Agency conferred the Award
                      </th>
                      <th
                        style={{
                          width: "120px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Year of the Award
                      </th>
                      <th
                        style={{
                          width: "120px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        Amount for Cash Award
                      </th>
                      <th
                        style={{
                          width: "80px",
                          padding: "10px",
                          border: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.awards.map((award, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            width: "60px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            width: "220px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={award.title}
                            onChange={(e) =>
                              handleArrayChange(
                                "awards",
                                idx,
                                "title",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "250px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Name / Title of the Award"
                          />
                        </td>
                        <td
                          style={{
                            width: "120px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={award.type}
                            onChange={(e) =>
                              handleArrayChange(
                                "awards",
                                idx,
                                "type",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "150px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Type"
                          />
                        </td>
                        <td
                          style={{
                            width: "220px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={award.agency}
                            onChange={(e) =>
                              handleArrayChange(
                                "awards",
                                idx,
                                "agency",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "250px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Name of the Agency"
                          />
                        </td>
                        <td
                          style={{
                            width: "120px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={award.year}
                            onChange={(e) =>
                              handleArrayChange(
                                "awards",
                                idx,
                                "year",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "100px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Year"
                          />
                        </td>
                        <td
                          style={{
                            width: "120px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center"
                          }}
                        >
                          <input
                            type="text"
                            value={award.amount}
                            onChange={(e) =>
                              handleArrayChange(
                                "awards",
                                idx,
                                "amount",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minWidth: "0",
                              maxWidth: "130px",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: "2px solid #e2e8f0",
                              boxSizing: "border-box",
                              fontSize: "1rem",
                              textAlign: "center"
                            }}
                            placeholder="Amount"
                          />
                        </td>
                        <td
                          style={{
                            width: "80px",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                          }}
                        >
                          {!isDisabled && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("awards", idx)}
                              style={{
                                background: "#e53e3e",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isDisabled && (
                  <button
                    type="button"
                    onClick={() => addArrayItem("awards")}
                    style={{
                      background: "#3182ce",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "1rem",
                      marginTop: "5px",
                    }}
                  >
                    Add Award / Prize
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button Section */}
            {/* Area of Specialization Section - aligned and styled */}

            {/* Comprehensive Profile Data for HOD Viewing */}
            {viewingMode === 'viewing' && (
              <>
                {/* Experience Section */}
                {experienceData && (
                  <div style={{ marginTop: "40px", padding: "30px", borderRadius: "15px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2d3748", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Professional Experience
                    </h2>

                    {/* Teaching Experience Table */}
                    {experienceData.teaching_experience?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Teaching Experience</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Designation</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Institution</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Department</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>From</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {experienceData.teaching_experience.map((exp, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.designation}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.institution}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.department}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.from}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.to}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Research Experience Table */}
                    {experienceData.research_experience?.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Research Experience</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Position</th>
                              <th style={{ width: "250px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Organization</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>From</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {experienceData.research_experience.map((exp, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.position}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.organization}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.from}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{exp.to}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Publications Section */}
                {publicationsData && (
                  <div style={{ marginTop: "40px", padding: "30px", borderRadius: "15px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2d3748", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Publications
                    </h2>

                    {/* SEIE Journals Table */}
                    {publicationsData.seie_journals?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>SEIE Journals</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                              <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.seie_journals.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.authors}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.journal_name}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.volume}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.issue}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.page_nos}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.impact_factor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* UGC Approved Journals Table */}
                    {publicationsData.ugc_approved_journals?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>UGC Approved Journals</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                              <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.ugc_approved_journals.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.authors}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.journal_name}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.volume}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.issue}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.page_nos}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.impact_factor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Non-UGC Journals Table */}
                    {publicationsData.non_ugc_journals?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Other Journals</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                              <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.non_ugc_journals.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.authors}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.journal_name}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.volume}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.issue}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.page_nos}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.impact_factor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Conference Proceedings Table */}
                    {publicationsData.conference_proceedings?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Conference Proceedings</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                              <th style={{ width: "250px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Conference Details</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.conference_proceedings.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.authors}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.conference_details}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.page_nos}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Journal Publications Table (Legacy) */}
                    {publicationsData.journal_publications?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Journal Publications (Legacy)</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "250px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Pages</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.journal_publications.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.journal}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.volume}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.pages}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Conference Publications Table */}
                    {publicationsData.conference_publications?.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>Conference Publications</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "250px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Conference</th>
                              <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Pages</th>
                              <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {publicationsData.conference_publications.map((pub, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.conference}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.pages}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{pub.year}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Patents Section */}
                {patentsData && (
                  <div style={{ marginTop: "40px", padding: "30px", borderRadius: "15px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2d3748", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Patents
                    </h2>

                    {patentsData.patents?.length > 0 && (
                      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9" }}>
                            <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                            <th style={{ width: "300px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                            <th style={{ width: "150px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Patent Number</th>
                            <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                            <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Status</th>
                            <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Scope</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patentsData.patents.map((patent, idx) => (
                            <tr key={idx}>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{patent.title}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{patent.patent_number}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{patent.year}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{patent.status}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{patent.scope}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Books Section */}
                {booksData && (
                  <div style={{ marginTop: "40px", padding: "30px", borderRadius: "15px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2d3748", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Books & Publications
                    </h2>

                    {booksData.books_authored?.length > 0 && (
                      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9" }}>
                            <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                            <th style={{ width: "300px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                            <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Publisher</th>
                            <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                            <th style={{ width: "150px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>ISBN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booksData.books_authored.map((book, idx) => (
                            <tr key={idx}>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{book.title}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{book.publisher}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{book.year}</td>
                              <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{book.isbn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Research Guidance Section */}
                {researchData && (
                  <div style={{ marginTop: "40px", padding: "30px", borderRadius: "15px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2d3748", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Research Guidance
                    </h2>

                    {/* PhD Students Table */}
                    {researchData.phd_students?.length > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>PhD Students</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Student Name</th>
                              <th style={{ width: "300px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Thesis Title</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year of Completion</th>
                            </tr>
                          </thead>
                          <tbody>
                            {researchData.phd_students.map((student, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.student_name}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.thesis_title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.year_of_completion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* PG Students Table */}
                    {researchData.pg_students?.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4a5568", marginBottom: "15px" }}>PG Students</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                          <thead>
                            <tr style={{ background: "#f1f5f9" }}>
                              <th style={{ width: "60px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                              <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Student Name</th>
                              <th style={{ width: "300px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Thesis Title</th>
                              <th style={{ width: "120px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year of Completion</th>
                            </tr>
                          </thead>
                          <tbody>
                            {researchData.pg_students.map((student, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.student_name}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.thesis_title}</td>
                                <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{student.year_of_completion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <div
              style={{
                padding: "20px 30px",
                textAlign: "end",
                background: 'white',
              }}
            >
              {viewingMode === 'viewing' ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center'
                }}>

                  <button
                    type="button"
                    onClick={() => {
                      // Navigate back to faculty directory
                      navigate('/faculty');
                    }}
                    style={{
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "15px",
                      padding: "16px 30px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 25px rgba(79, 172, 254, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 12px 35px rgba(79, 172, 254, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 8px 25px rgba(79, 172, 254, 0.3)";
                    }}
                  >
                    ← Back to Faculty Directory
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(135deg, #6093ecff 0%, #1a202c 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "15px",
                    padding: "16px 40px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 25px rgba(96, 147, 236, 0.3)",
                    minWidth: "100px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 12px 35px rgba(96, 147, 236, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(96, 147, 236, 0.3)";
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
