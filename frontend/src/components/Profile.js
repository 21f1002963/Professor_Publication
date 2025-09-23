import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";
import { saveChanges, CHANGE_TYPES } from "../changeTracker";

function Profile() {
  const [profile, setProfile] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    address: "",
    area_of_expertise: "",

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setProfile((prev) => ({
          ...prev,
          email: decoded.email,
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchProfile();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save changes to local tracking system instead of submitting directly
      const changeId = saveChanges(
        CHANGE_TYPES.PROFILE,
        profile,
        "Updated personal and faculty information"
      );

      alert(
        "Profile changes saved! Go to Dashboard to review and submit all changes for approval."
      );
    } catch (error) {
      console.error("Error saving profile changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

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
            Faculty Profile
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.8,
              margin: 0,
            }}
          >
            Manage your personal and academic information
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                    }}
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
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                    }}
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
                          width: "220px",
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
                              maxWidth: "160px",
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
                              maxWidth: "200px",
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
                              maxWidth: "180px",
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
                              maxWidth: "100px",
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                              maxWidth: "200px",
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
                              maxWidth: "100px",
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
                              maxWidth: "200px",
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
                              maxWidth: "100px",
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              </div>
            </div>

            {/* Submit Button Section */}
            {/* Area of Specialization Section - aligned and styled */}
            <div
              style={{
                margin: "0",
                padding: "5px 30px 30px",
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(96, 147, 236, 0.08)",
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
                    <button
                      type="button"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          area_of_expertise: [profile.area_of_expertise, ""],
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
                      }}
                    >
                      Add Specialization
                    </button>
                  </div>
                )}
              </div>
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
            </div>
            <div
              style={{
                padding: "10px 10px",
                textAlign: "center",
                background: "#f8fafc",
              }}
            >
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
                  minWidth: "200px",
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
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
