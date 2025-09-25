import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";

function ConferenceSeminarWorkshop() {
  const [conferenceData, setConferenceData] = useState({
    invited_talks: [
      {
        title_of_paper: "",
        conferences_seminar_workshop_training: "",
        organized_by: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
    ],
    conferences_seminars_organized: [
      {
        title_of_programme: "",
        sponsors: "",
        venue_duration: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
    ],
    workshops_organized: [
      {
        title_of_programme: "",
        sponsors: "",
        venue_duration: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await fetch(`http://localhost:5000/api/professor/conference-seminar-workshop/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(conferenceData),
      });

      if (response.ok) {
        alert("Conference/Seminar/Workshop updated successfully!");
      } else {
        throw new Error("Failed to update conference/seminar/workshop");
      }
    } catch (error) {
      console.error("Error updating conference/seminar/workshop:", error);
      alert("Error updating conference/seminar/workshop");
    }
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setConferenceData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName) => {
    const defaultItems = {
      invited_talks: {
        title_of_paper: "",
        conferences_seminar_workshop_training: "",
        organized_by: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
      conferences_seminars_organized: {
        title_of_programme: "",
        sponsors: "",
        venue_duration: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
      workshops_organized: {
        title_of_programme: "",
        sponsors: "",
        venue_duration: "",
        level: "",
        from_date: "",
        to_date: "",
        year: "",
      },
    };

    setConferenceData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItems[arrayName]],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setConferenceData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:5000/api/professor/conference-seminar-workshop/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConferenceData({
            invited_talks: data.invited_talks || [
              {
                title_of_paper: "",
                conferences_seminar_workshop_training: "",
                organized_by: "",
                level: "",
                from_date: "",
                to_date: "",
                year: "",
              },
            ],
            conferences_seminars_organized: data.conferences_seminars_organized || [
              {
                title_of_programme: "",
                sponsors: "",
                venue_duration: "",
                level: "",
                from_date: "",
                to_date: "",
                year: "",
              },
            ],
            workshops_organized: data.workshops_organized || [
              {
                title_of_programme: "",
                sponsors: "",
                venue_duration: "",
                level: "",
                from_date: "",
                to_date: "",
                year: "",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching conference/seminar/workshop data:", error);
      }
    };

    fetchData();
  }, []);

  const levelOptions = [
    "International",
    "National",
    "State",
    "Regional",
    "College",
    "University"
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
        <div style={{ padding: "10px 30px 30px" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#1a202c",
            marginBottom: "10px",
            textAlign: "center",
          }}>
            Conference/Seminar/Workshop
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              marginBottom: "30px",
            }}>
              
              {/* Invited Talks Section */}
              <div style={{ marginTop: "40px" }}>
                <h2 style={{ color: "#2d3748", marginBottom: "20px", fontSize: "1.8rem" }}>
                  🎤 Invited Talks in Conference/Seminar/Workshop/Training Programme
                </h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1400px" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>S.No</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Title of the Paper</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Conferences/Seminar/Workshop/Training Programme</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Organized by</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Level</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>From</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>To</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Year</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conferenceData.invited_talks.map((talk, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={talk.title_of_paper}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "title_of_paper", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={talk.conferences_seminar_workshop_training}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "conferences_seminar_workshop_training", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={talk.organized_by}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "organized_by", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <select
                              value={talk.level}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "level", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            >
                              <option value="">Select Level</option>
                              {levelOptions.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={talk.from_date}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "from_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={talk.to_date}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "to_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="number"
                              value={talk.year}
                              onChange={(e) => handleArrayChange("invited_talks", idx, "year", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("invited_talks", idx)}
                              style={{ 
                                background: "#ef4444", 
                                color: "#fff", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("invited_talks")}
                  style={{ 
                    background: "#10b981", 
                    color: "#fff", 
                    border: "none", 
                    padding: "12px 24px", 
                    marginTop: "15px", 
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  + Add Invited Talk Entry
                </button>
              </div>

              {/* Conferences/Seminars Organized Section */}
              <div style={{ marginTop: "60px" }}>
                <h2 style={{ color: "#2d3748", marginBottom: "20px", fontSize: "1.8rem" }}>
                  🏛️ Conferences/Seminars Organized
                </h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>S.No</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Title of the Programme</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Sponsors</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Venue & Duration</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Level</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>From</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>To</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Year</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conferenceData.conferences_seminars_organized.map((conference, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={conference.title_of_programme}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "title_of_programme", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={conference.sponsors}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "sponsors", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={conference.venue_duration}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "venue_duration", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <select
                              value={conference.level}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "level", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            >
                              <option value="">Select Level</option>
                              {levelOptions.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={conference.from_date}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "from_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={conference.to_date}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "to_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="number"
                              value={conference.year}
                              onChange={(e) => handleArrayChange("conferences_seminars_organized", idx, "year", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("conferences_seminars_organized", idx)}
                              style={{ 
                                background: "#ef4444", 
                                color: "#fff", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("conferences_seminars_organized")}
                  style={{ 
                    background: "#3b82f6", 
                    color: "#fff", 
                    border: "none", 
                    padding: "12px 24px", 
                    marginTop: "15px", 
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  + Add Conference/Seminar Entry
                </button>
              </div>

              {/* Workshop Organized Section */}
              <div style={{ marginTop: "60px" }}>
                <h2 style={{ color: "#2d3748", marginBottom: "20px", fontSize: "1.8rem" }}>
                  🛠️ Workshop Organized
                </h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>S.No</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Title of the Programme</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Sponsors</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Venue & Duration</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Level</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>From</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>To</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Year</th>
                        <th style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conferenceData.workshops_organized.map((workshop, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={workshop.title_of_programme}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "title_of_programme", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={workshop.sponsors}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "sponsors", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="text"
                              value={workshop.venue_duration}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "venue_duration", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <select
                              value={workshop.level}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "level", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            >
                              <option value="">Select Level</option>
                              {levelOptions.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={workshop.from_date}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "from_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="date"
                              value={workshop.to_date}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "to_date", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                            <input
                              type="number"
                              value={workshop.year}
                              onChange={(e) => handleArrayChange("workshops_organized", idx, "year", e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "8px", 
                                border: "1px solid #d1d5db",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("workshops_organized", idx)}
                              style={{ 
                                background: "#ef4444", 
                                color: "#fff", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("workshops_organized")}
                  style={{ 
                    background: "#8b5cf6", 
                    color: "#fff", 
                    border: "none", 
                    padding: "12px 24px", 
                    marginTop: "15px", 
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  + Add Workshop Entry
                </button>
              </div>

              <div style={{ marginTop: "50px", textAlign: "center" }}>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px 40px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  💾 Update Conference/Seminar/Workshop
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ConferenceSeminarWorkshop;