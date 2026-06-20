import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";

import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";

function Home() {
  /*
  |--------------------------------------------------------------------------
  | Interview Context
  |--------------------------------------------------------------------------
  | Getting required states and functions
  | from Interview Context
  */

  const { loading, generateReport, reports, getReports } = useInterview();

  /*
  |--------------------------------------------------------------------------
  | Component States
  |--------------------------------------------------------------------------
  */

  const [jobDescription, setJobDescription] = useState("");

  const [selfDescription, setSelfDescription] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Resume Input Reference
  |--------------------------------------------------------------------------
  */

  const resumeInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Navigation Hook
  |--------------------------------------------------------------------------
  */

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Fetch Previous Reports
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    getReports();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Generate Interview Report Handler
  |--------------------------------------------------------------------------
  */

  const handleGeneratedReport = async () => {
    try {
      const resumeFile = resumeInputRef.current?.files[0];

      // Check empty fields

      if (!jobDescription.trim() || !selfDescription.trim()) {
        alert("Please fill all fields");

        return;
      }

      // Check resume uploaded

      if (!resumeFile) {
        alert("Please upload resume");

        return;
      }

      // Allow only PDF files

      if (resumeFile.type !== "application/pdf") {
        alert("Only PDF allowed");

        return;
      }

      // Generate AI report

      const data = await generateReport({
        jobDescription,

        selfDescription,

        resumeFile,
      });

      // Navigate after success

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      } else {
        alert("Report generation failed");
      }
    } catch (error) {
      console.log("Generate Report Error:", error.message);

      alert("Something went wrong");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Screen
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <main className="home">
      {/* ================= HERO SECTION ================= */}

      <div className="hero">
        <h1>AI Interview Report Generator</h1>

        <p>
          Upload your resume and job description to generate a personalized
          interview preparation report
        </p>
      </div>

      {/* ================= INPUT SECTION ================= */}

      <div className="interview-input-group">
        <div className="left">
          <label>Target Job Description</label>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description here..."
          />
        </div>

        <div className="right">
          {/* Resume Upload */}

          <div className="input-group">
            <p>
              Resume
              <small className="highlight">
                {" "}
                (Use Resume and self description together)
              </small>
            </p>

            <label className="file-label" htmlFor="resume">
              Upload Resume
            </label>

            <input
              ref={resumeInputRef}
              hidden
              type="file"
              id="resume"
              accept=".pdf"
            />
          </div>

          {/* Self Description */}

          <div className="input-group">
            <label>Self Description</label>

            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Describe yourself in few sentences"
            />
          </div>

          <button
            className="button primary-button"
            onClick={handleGeneratedReport}
          >
            Generate Interview Report
          </button>
        </div>
      </div>

      {/* ================= REPORT HISTORY ================= */}

      <section className="reports-section">
        <h2>Your Previous Reports</h2>

        <div className="reports-grid">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <div
                className="report-box"
                key={report._id}
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Interview Report"}</h3>

                <div className="match-score">{report.matchScore || 0}%</div>

                <p>Match Score</p>
              </div>
            ))
          ) : (
            <p className="no-report">No reports generated yet</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
