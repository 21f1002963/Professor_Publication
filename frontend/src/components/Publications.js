import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";

function Publications() {
  const [publications, setPublications] = useState({
    // Papers Published in SEIE Journals
    seie_journals: [
      {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
    ],
    // Papers Published in UGC Approved Journals
    ugc_approved_journals: [
      {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
    ],
    // Papers Published in Non UGC Approved Peer Reviewed Journals
    non_ugc_journals: [
      {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
    ],
    // Papers Published in Conference Proceedings
    conference_proceedings: [
      {
        title: "",
        authors: "",
        conference_details: "",
        page_nos: "",
        year: "",
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPublications((prev) => ({
          ...prev,
          name: decoded.name || "",
          email: decoded.email || "",
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/professor/publications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPublications(prevState => ({
          ...prevState,
          ...data,
          // Ensure all required arrays exist with defaults
          seie_journals: data.seie_journals || prevState.seie_journals || [],
          ugc_approved_journals: data.ugc_approved_journals || prevState.ugc_approved_journals || [],
          non_ugc_journals: data.non_ugc_journals || prevState.non_ugc_journals || [],
          conference_proceedings: data.conference_proceedings || prevState.conference_proceedings || []
        }));
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }

      // Send publications data directly to backend for immediate saving
      const response = await fetch("http://localhost:5000/api/professor/publications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(publications)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Publications updated successfully!");
        console.log("Publications saved:", data.publications);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error updating publications");
      }
    } catch (error) {
      console.error("Error saving publications:", error);
      alert("Error saving publications. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setPublications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setPublications((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName) => {
    const defaultItems = {
      seie_journals: {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
      ugc_approved_journals: {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
      non_ugc_journals: {
        title: "",
        authors: "",
        journal_name: "",
        volume: "",
        issue: "",
        page_nos: "",
        year: "",
        impact_factor: "",
      },
      conference_proceedings: {
        title: "",
        authors: "",
        conference_details: "",
        page_nos: "",
        year: "",
      },
    };

    setPublications((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItems[arrayName] || {}],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setPublications((prev) => ({
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
              marginBottom: "10px",
              marginTop: "0px",
            }}
          >
            Publications
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "40px",
              opacity: 0.8,
              marginTop: "0px",
            }}
          >
            Update your academic publications and research papers
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                marginBottom: "30px",
              }}
            >
              <div style={{ marginTop: "0px" }}>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: "25px",
                    marginTop: "0px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Segoe UI, Arial, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Papers Published in SEIE Journals
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
                      <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                      <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                      <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                      <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(publications.seie_journals || []).map((pub, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "title", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Paper Title"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.authors}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "authors", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Authors"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.journal_name}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "journal_name", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Journal Name"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.volume}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "volume", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Vol"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.issue}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "issue", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Issue"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.page_nos}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "page_nos", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Pages"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "year", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Year"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.impact_factor}
                            onChange={(e) => handleArrayChange("seie_journals", idx, "impact_factor", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="IF"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("seie_journals", idx)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
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
                  onClick={() => addArrayItem("seie_journals")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  + Add SEIE Journal Paper
                </button>
              </div>

              {/* UGC Approved Journals Section */}
              <div style={{ marginTop: "40px" }}>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#2d3748",
                    marginBottom: "25px",
                    marginTop: "0px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Segoe UI, Arial, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  Papers Published in UGC Approved Journals
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
                      <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                      <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                      <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                      <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(publications.ugc_approved_journals || []).map((pub, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "title", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Paper Title"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.authors}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "authors", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Authors"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.journal_name}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "journal_name", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Journal Name"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.volume}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "volume", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Vol"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.issue}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "issue", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Issue"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.page_nos}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "page_nos", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Pages"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "year", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Year"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.impact_factor}
                            onChange={(e) => handleArrayChange("ugc_approved_journals", idx, "impact_factor", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="IF"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("ugc_approved_journals", idx)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
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
                  onClick={() => addArrayItem("ugc_approved_journals")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  + Add UGC Approved Journal Paper
                </button>
              </div>

              {/* Non UGC Approved Journals Section */}
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
                  Papers Published in Scopus Journals
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
                      <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                      <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                      <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                      <th style={{ width: "160px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Journal Name</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Volume</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Issue</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Impact Factor</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(publications.non_ugc_journals || []).map((pub, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "title", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Paper Title"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.authors}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "authors", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Authors"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.journal_name}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "journal_name", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Journal Name"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.volume}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "volume", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Vol"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.issue}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "issue", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Issue"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.page_nos}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "page_nos", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Pages"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "year", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Year"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.impact_factor}
                            onChange={(e) => handleArrayChange("non_ugc_journals", idx, "impact_factor", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="IF"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("non_ugc_journals", idx)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
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
                  onClick={() => addArrayItem("non_ugc_journals")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  + Add Non UGC Journal Paper
                </button>
              </div>

              {/* Conference Proceedings Section */}
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
                  Papers Published in Conference
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
                      <th style={{ width: "40px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>S.No</th>
                      <th style={{ width: "200px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Title</th>
                      <th style={{ width: "180px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Authors</th>
                      <th style={{ width: "250px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Conference Details</th>
                      <th style={{ width: "100px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Page Nos.</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}>Year</th>
                      <th style={{ width: "80px", padding: "10px", border: "1px solid #e2e8f0", fontWeight: 600 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(publications.conference_proceedings || []).map((pub, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>{idx + 1}</td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => handleArrayChange("conference_proceedings", idx, "title", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Paper Title"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.authors}
                            onChange={(e) => handleArrayChange("conference_proceedings", idx, "authors", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Authors"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.conference_details}
                            onChange={(e) => handleArrayChange("conference_proceedings", idx, "conference_details", e.target.value)}
                            style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Conference Details"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.page_nos}
                            onChange={(e) => handleArrayChange("conference_proceedings", idx, "page_nos", e.target.value)}
                            style={{ width: "85%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Pages"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => handleArrayChange("conference_proceedings", idx, "year", e.target.value)}
                            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                            placeholder="Year"
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("conference_proceedings", idx)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
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
                  onClick={() => addArrayItem("conference_proceedings")}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  + Add Conference Paper
                </button>
              </div>

              {/* Submit Button */}
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px 40px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 12px 35px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}


export default Publications;