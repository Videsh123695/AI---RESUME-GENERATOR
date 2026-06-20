import { useContext, useEffect } from "react";

import { useParams } from "react-router";

import {
  getAllInterviewReports,
  generateInterviewReport,
  generateInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";

import { InterviewContext } from "../interview.context";

/**
 * Custom Hook
 *
 * Handles:
 * - Generate AI interview report
 * - Fetch single report
 * - Fetch report history
 * - Download optimized resume PDF
 */

export const useInterview = () => {
  // Access context
  const context = useContext(InterviewContext);

  // Prevent hook usage outside provider
  if (!context) {
    throw new Error("useInterview must be used within InterviewProvider");
  }

  const {
    loading,
    setLoading,

    report,
    setReport,

    reports,
    setReports,
  } = context;

  // Get id from route
  const { interviewId } = useParams();

  /*
  |--------------------------------------------------------------------------
  | Generate New Interview Report
  |--------------------------------------------------------------------------
  */

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,

        selfDescription,

        resumeFile,
      });

      if (!response?.interviewReport) {
        console.log("Invalid AI report response");

        return null;
      }

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error(
        "Generate Report Error:",
        error?.response?.data?.message || error.message,
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Single Report By Id
  |--------------------------------------------------------------------------
  */

  const getReportById = async (interviewId) => {
    if (!interviewId) {
      console.log("Interview id missing");

      return null;
    }

    setLoading(true);

    try {
      const response = await generateInterviewReportById(interviewId);

      if (!response?.interviewReport) {
        console.log("Report not found");

        return null;
      }

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error(
        "Get Report Error:",

        error?.response?.data?.message || error.message,
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get All Previous Reports
  |--------------------------------------------------------------------------
  */

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      if (!response?.interviewReports) {
        setReports([]);

        return [];
      }

      setReports(response.interviewReports);

      return response.interviewReports;
    } catch (error) {
      console.error(
        "Fetch Reports Error:",

        error?.response?.data?.message || error.message,
      );

      setReports([]);

      return [];
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Generate & Download Optimized Resume PDF
  |--------------------------------------------------------------------------
  */

  const getResumePdf = async (interviewReportId) => {
    if (!interviewReportId) {
      console.log("Report id missing");

      return;
    }

    setLoading(true);

    try {
      const response = await generateResumePdf({
        interviewReportId,
      });

      if (!response) {
        console.log("PDF generation failed");

        return;
      }

      const pdfBlob = new Blob(
        [response],

        {
          type: "application/pdf",
        },
      );

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `resume_${interviewReportId}.pdf`;

      document.body.appendChild(link);

      link.click();

      // cleanup

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Resume Download Error:",

        error?.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Auto Fetch Reports
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,

    report,

    reports,

    generateReport,

    getReportById,

    getReports,

    getResumePdf,
  };
};
