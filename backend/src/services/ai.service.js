require("dotenv").config();
const {resume, jobDescription,selfDescription}=require("./temp")
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE GENAI API KEY missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// for testing the api of gemini

// async function invokeGeminiAi(){
//     const response=await ai.models.generateContent({
//         model:"gemini-2.5-flash-lite",
//         contents:"Hello gemini!  Explain what is interview ? "
//     })
//     console.log(response.text);
// }

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("the technical question can be asked in the interview "),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this questions that can be asked in the interview along with their intention and how to anser then  ",
          ),
      }),
    )
    .describe(
      "technical question that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preperationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate an interview report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}


IMPORTANT:
Return ONLY JSON.
Do NOT return arrays of strings.
Arrays MUST contain objects.


Required structure:


{
 "matchScore":80,

 "technicalQuestion":[
  {
   "question":"",
   "intention":"",
   "answer":""
  }
 ],

 "behavioralQuestion":[
  {
   "question":"",
   "intention":"",
   "answer":""
  }
 ],

 "skillGaps":[
  {
   "skill":"",
   "severity":"low"
  }
 ],

 "preperationPlan":[
  {
   "day":1,
   "focus":"",
   "tasks":[
     ""
   ]
  }
 ],

 "title":""
}


Rules:
- technicalQuestion must contain 5 OBJECTS.
- behavioralQuestion must contain 5 OBJECTS.
- skillGaps must contain OBJECTS only.
- preperationPlan must contain OBJECTS only.
- Never use string arrays.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // responseSchema:zodToJsonSchema(interviewReportSchema)
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }
    const data = JSON.parse(response.text);
    // console.log("==============AI DATA=============");
    // console.log(data);

    if (process.env.NODE_ENV !== "production") {
      console.log(data);
    }
    return data;

    //  console.log(response.text);
  } catch (error) {
    console.log("Gemini Error:", error.message);

    throw new Error("AI service temporarily unavailable");
  }
}

async function generatePdfFromHtml(htmlContent) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,

      margin: {
        top: "12mm",
        bottom: "12mm",
        left: "12mm",
        right: "12mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF error:", error.message);
    throw new Error("PDF generation failed");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const resumePdfSchema = z.object({
  html: z
    .string()
    .describe(
      "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
    ),
});

const prompt = `
You are an expert ATS Resume Writer and Technical Recruiter.

Your task is to rewrite and optimize the candidate's resume according to the target job description.

INPUT DATA:

====================
CURRENT RESUME:
${resume}
====================


====================
CANDIDATE SELF DESCRIPTION:
${selfDescription}
====================


====================
TARGET JOB DESCRIPTION:
${jobDescription}
====================



GOAL:

Create a professional, ATS-friendly resume that increases the candidate's chances of getting shortlisted for this specific job.



IMPORTANT CONTENT RULES:

1. Preserve all real candidate information:
   - Name
   - Email
   - Phone number
   - Education
   - Certifications
   - Real projects

2. Do NOT create fake:
   - Companies
   - Work experience
   - Degrees
   - Certifications
   - Achievements

3. Improve existing content:
   - Rewrite weak bullet points
   - Use strong action verbs
   - Make project descriptions professional
   - Add measurable impact where reasonable
   - Improve technical wording

4. Optimize according to Job Description:
   - Add relevant keywords naturally
   - Highlight matching skills
   - Reorder skills based on job priority
   - Emphasize relevant projects

5. Make resume suitable for:
   - Software Engineer roles
   - Internship applications
   - ATS systems



RESUME STRUCTURE:

Use these sections:

- Header
  Name
  Contact Details
  LinkedIn/GitHub if available

- Professional Summary

- Technical Skills

- Projects

- Education

- Certifications

- Additional relevant sections only if useful



DESIGN REQUIREMENTS:

Return clean HTML.

The HTML must:

- Include internal CSS inside <style>
- Use professional fonts
- Use black/dark gray text
- Use minimal accent colors only
- Avoid images/icons
- Avoid tables
- Avoid columns that break ATS parsing
- Avoid unnecessary graphics
- Fit within 1-2 PDF pages
- Be printable on A4 size

CSS requirements:

- max-width around 800px
- readable spacing
- clean headings
- professional resume appearance


OUTPUT FORMAT:

Return ONLY valid JSON.

No markdown.
No explanation.

Example:

{
 "html":"<!DOCTYPE html><html>...</html>"
}

`;

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  try {
    return pdfBuffer;
  } catch (error) {
    console.error("Resume Generate Error:", error.message);

    throw new Error("Resume generation failed");
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
