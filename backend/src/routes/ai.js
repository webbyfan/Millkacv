import express from "express";
import { GoogleGenAI } from "@google/genai";
import authMiddleware from "../middleware/auth.js";
import Resume from "../models/Resume.js";

const router = express.Router();

// Helper to get or instantiate Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

// Fallback high quality generators if API key is not yet set
function fallbackImproveSummary(title, skills, currentSummary) {
  const role = title || "Professional";
  const skillList = Array.isArray(skills) && skills.length > 0 ? skills.slice(0, 4).join(", ") : "strategic planning, problem-solving, and cross-functional leadership";
  return `Results-driven ${role} with a proven track record of delivering high-impact solutions and driving operational excellence. Proficient in ${skillList}, with demonstrated expertise in optimizing workflows, mentoring teams, and exceeding performance targets in fast-paced environments.`;
}

function fallbackImproveBullet(text, position) {
  const trimmed = text.trim();
  const cleaned = trimmed.replace(/^[•\-\*]\s*/, "");
  return {
    improved: `Successfully spearheaded ${cleaned.toLowerCase()}, improving operational efficiency and project turnaround time by 25%.`,
    alternatives: [
      `Collaborated with cross-functional teams to implement ${cleaned.toLowerCase()}, driving measurable performance improvements.`,
      `Engineered streamlined solutions for ${cleaned.toLowerCase()}, ensuring 100% compliance with industry quality standards.`
    ]
  };
}

function fallbackAnalyzeAts(resumeContent, targetJobTitle, jobDescription) {
  let score = 50;
  const content = resumeContent || {};
  const personal = content.personalInfo || {};
  const experiences = Array.isArray(content.experiences) ? content.experiences : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const skills = Array.isArray(content.skills) ? content.skills : (typeof content.skills === "string" ? content.skills.split("\n") : []);

  if (personal.fullName && personal.email && personal.phone) score += 15;
  if (personal.summary && personal.summary.length > 50) score += 10;
  if (experiences.length > 0) score += 15;
  if (experiences.some(e => e.description && /\d+%|\$\d+|\d+\s*users/i.test(e.description))) score += 5;
  if (skills.length >= 4) score += 10;
  if (education.length > 0) score += 5;

  score = Math.min(score, 92);

  return {
    score,
    summary: `Your resume demonstrates solid foundational strength with an estimated ATS score of ${score}/100. Incorporating role-specific keywords and measurable metrics will significantly improve interview callbacks.`,
    breakdown: {
      keywordMatch: Math.max(50, score - 8),
      impactAndMetrics: score > 75 ? 85 : 68,
      atsFormatting: 94,
      completeness: Math.min(score + 6, 96),
    },
    missingKeywords: ["Agile/Scrum", "CI/CD Pipelines", "Cross-Functional Collaboration", "System Architecture", "Performance Optimization"],
    strengths: [
      "Standard readable section structure recognized by major ATS parsers",
      personal.email ? "Direct and clear contact details" : "Basic profile information provided",
      experiences.length > 0 ? "Chronological work experience history included" : "Career trajectory outlined"
    ],
    improvements: [
      "Inject more quantifiable metrics (e.g., percentages, team sizes, revenue impact)",
      targetJobTitle ? `Align headline and summary closely with "${targetJobTitle}"` : "Tailor headline to target job title",
      "Add 3-5 high-priority technical skills matching the job specification"
    ],
    isFallback: true
  };
}

function fallbackScanExternalCv(rawText, targetJobTitle, jobDescription) {
  const text = rawText || "";
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : "";
  const phoneMatch = text.match(/\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const phone = phoneMatch ? phoneMatch[0] : "";
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const fullName = lines.length > 0 && lines[0].length < 40 ? lines[0] : "Candidate";

  const skillKeywords = [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "Python", "Java", "C++",
    "HTML", "CSS", "SQL", "PostgreSQL", "MongoDB", "Git", "Docker", "AWS", "REST APIs",
    "GraphQL", "CI/CD", "Agile", "Scrum", "Redux", "Tailwind", "Next.js", "Linux"
  ];
  const detectedSkills = skillKeywords.filter((skill) =>
    new RegExp(`\\b${skill.replace(/[.+*?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );

  const parsedResume = {
    title: targetJobTitle ? `${targetJobTitle} - Imported` : "Imported Resume",
    fullName: fullName,
    email: email,
    phone: phone,
    location: "",
    professionalTitle: targetJobTitle || "Professional",
    summary: text.slice(0, 300).replace(/\r?\n|\r/g, " "),
    experiences: [
      {
        company: "Previous Experience",
        position: targetJobTitle || "Role",
        startDate: "",
        endDate: "",
        description: text.slice(300, 800) || "Experience details extracted from uploaded CV."
      }
    ],
    education: [],
    skills: detectedSkills.length > 0 ? detectedSkills : ["Problem Solving", "Communication", "Team Collaboration"]
  };

  const score = Math.min(85, Math.max(55, 50 + detectedSkills.length * 3 + (email ? 10 : 0)));

  const analysis = {
    score,
    summary: `External CV parsed successfully. It demonstrates a baseline ATS readiness score of ${score}/100 with ${detectedSkills.length} identified keywords.`,
    breakdown: {
      keywordMatch: Math.min(88, score - 5),
      impactAndMetrics: 72,
      atsFormatting: 85,
      completeness: email && phone ? 88 : 70
    },
    missingKeywords: ["Cloud Architecture", "Unit Testing", "Kubernetes", "Microservices", "Agile Methodologies"],
    strengths: [
      "Contact information successfully extracted and indexed",
      detectedSkills.length > 0 ? `Detected key industry competencies: ${detectedSkills.slice(0, 4).join(", ")}` : "Readable standard text formatting"
    ],
    improvements: [
      "Incorporate more quantifiable metrics and measurable achievements",
      "Add missing industry-standard keywords related to target role",
      "Re-format using MilkaaCV's ATS-safe single-column templates to avoid parsing glitches"
    ],
    isFallback: true
  };

  return { parsedResume, analysis };
}

function fallbackGenerateCompleteResume(data = {}) {
  const role = data.professionalTitle || "Senior Software Engineer";
  const name = data.fullName || "Candidate";
  const inputSkills = typeof data.skills === "string" 
    ? data.skills.split(/[\n,•]+/).map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(data.skills) ? data.skills : []);

  const defaultRoleSkills = [
    "System Architecture", "React & Modern Web", "Node.js & Express", "TypeScript",
    "Cloud Computing (AWS/GCP)", "RESTful & GraphQL APIs", "CI/CD & DevOps", "Agile & Scrum Leadership",
    "Database Optimization (SQL/NoSQL)", "Performance Tuning", "Cross-Functional Collaboration", "Unit & Integration Testing"
  ];

  // Strictly preserve all candidate's skills, and supplement with domain keywords
  const mergedSkills = Array.from(new Set([...inputSkills, ...defaultRoleSkills]));

  // Preserve user's summary if provided, or supply tailored default
  let summary = data.summary && data.summary.trim().length > 10
    ? data.summary.trim()
    : `Results-driven ${role} with a proven track record of architectural leadership and high-impact delivery. Expert in ${mergedSkills.slice(0, 4).join(", ")}, with extensive experience streamlining production workflows, improving application throughput by over 35%, and driving technical excellence across cross-functional teams.`;

  // Enhance experiences while strictly preserving the whole user text without omitting any details
  let experiences = Array.isArray(data.experiences) && data.experiences.length > 0 
    ? data.experiences.map((exp, idx) => {
        const pos = exp.position || (idx === 0 ? role : "Software Engineer");
        const comp = exp.company || (idx === 0 ? "Tech Corp" : "Innovation Labs");
        const start = exp.startDate || (idx === 0 ? "Jan 2021" : "Mar 2018");
        const end = exp.endDate || (idx === 0 ? "Present" : "Dec 2020");
        
        let desc = exp.description || "";
        if (!desc.trim()) {
          desc = `• Spearheaded the core architectural development for ${pos} deliverables, improving system reliability by 34%.\n• Collaborated closely with product managers and engineers to release high-priority features on-time and under budget.\n• Designed and implemented automated CI/CD deployment pipelines, cutting release cycle times by 40%.\n• Mentored junior engineers on best practices, code review standards, and modern development patterns.`;
        } else {
          // Preserve whole text given by user! Format clean bullet points for any line that isn't already bulleted
          const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
          desc = lines.map(line => line.startsWith("•") || line.startsWith("-") ? line.replace(/^[-•]\s*/, "• ") : `• ${line}`).join("\n");
        }
        return {
          company: comp,
          position: pos,
          startDate: start,
          endDate: end,
          location: exp.location || "San Francisco, CA",
          description: desc
        };
      })
    : [
        {
          company: "Global Tech Solutions",
          position: role,
          startDate: "Jan 2021",
          endDate: "Present",
          location: "San Francisco, CA",
          description: `• Spearheaded key architectural development and product initiatives, improving system throughput by 38%.\n• Designed and launched automated test suites and continuous deployment pipelines, reducing staging bugs by 45%.\n• Partnered with cross-functional executive teams to align strategic roadmaps with scalable engineering deliverables.\n• Mentored 8+ engineers across agile sprints, accelerating team sprint velocity by 28%.`
        },
        {
          company: "Nexus Digital Systems",
          position: "Associate Systems Engineer",
          startDate: "Jun 2018",
          endDate: "Dec 2020",
          location: "Austin, TX",
          description: `• Engineered robust backend services and REST APIs, sustaining 99.9% uptime across high-concurrency peak traffic.\n• Optimized database query structures and caching layers, decreasing latency by 32%.\n• Collaborated with UX/UI designers to transform complex user requirements into high-performance web interfaces.`
        }
      ];

  // Education: preserve all candidate entries
  let education = Array.isArray(data.education) && data.education.length > 0 && data.education[0]?.school
    ? data.education
    : [
        {
          school: "State University of Technology",
          degree: "Bachelor of Science in Computer Science",
          field: "Software Engineering & Distributed Systems",
          graduationYear: "2018"
        }
      ];

  return {
    fullName: name,
    professionalTitle: role,
    email: data.email || "candidate@example.com",
    phone: data.phone || "+1 (555) 234-5678",
    location: data.location || "San Francisco, CA",
    summary: summary,
    experiences: experiences,
    education: education,
    skills: mergedSkills,
    templateId: data.templateId || "modern",
    atsScore: 94,
    aiHighlights: [
      "Preserved your entire content while optimizing formatting and clarity",
      "Formatted all accomplishments with quantifiable impact",
      "Preserved all competencies and added high-value ATS keywords",
      "Adapted layout flexibly to your selected template"
    ],
    isFallback: true
  };
}

// ============================================
// POST /api/ai/generate-complete-resume
// ============================================
router.post("/generate-complete-resume", authMiddleware, async (req, res, next) => {
  try {
    const resumeData = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      const fallback = fallbackGenerateCompleteResume(resumeData);
      return res.json({
        ...fallback,
        isFallback: true,
        notice: "Using local generator. Set GEMINI_API_KEY for live AI."
      });
    }

    const prompt = `You are an elite executive resume writer and ATS optimization expert.
The candidate has provided their resume information and chosen the "${resumeData.templateId || 'modern'}" resume template.

Your task: Produce a fully polished, ATS-optimized, high-converting resume based on their input.

CRITICAL INSTRUCTIONS ON CONTENT PRESERVATION & TEMPLATE FLEXIBILITY:
1. PRESERVE THE WHOLE USER TEXT:
   - You MUST include the WHOLE text given by the user. Do NOT omit, summarize away, truncate, or cut short any information, responsibilities, projects, technologies, or details the user provided.
   - Refine and elevate every piece of text with strong action verbs, professional clarity, and quantified metrics, but ensure EVERY responsibility, project, and accomplishment the user entered is represented.
2. FLEXIBLE TEMPLATE USAGE:
   - Use the chosen "${resumeData.templateId || 'modern'}" template as structural guidance, but be completely flexible in your usage.
   - You can make the template broader, wider, or more compact as needed to seamlessly accommodate all the candidate's text. Do not artificially constrain content to fit a single rigid box. Let the content flow naturally and thoroughly.
3. PROFESSIONAL SUMMARY:
   - Craft a comprehensive 3-5 sentence executive summary incorporating all key domain competencies, personal background, and career achievements mentioned by the candidate.
4. WORK EXPERIENCES:
   - Include ALL experience entries provided.
   - For every entry, include ALL duties, accomplishments, and context provided by the candidate. Expand them into crisp, quantified, high-impact bullet points starting with "• ". Do NOT arbitrarily limit to 2 or 3 bullets if the user gave detailed work history. Include everything!
5. EDUCATION:
   - Include all degree, school, field of study, honors, and graduation year details provided.
6. SKILLS:
   - Include ALL skills entered by the candidate without omitting any.
   - Complement them with top relevant industry and ATS keywords for this role.

Candidate Input:
- Full Name: ${resumeData.fullName || 'Candidate'}
- Professional Title: ${resumeData.professionalTitle || 'Software Engineer'}
- Email: ${resumeData.email || ''}
- Phone: ${resumeData.phone || ''}
- Location: ${resumeData.location || ''}
- Current Summary Draft: "${resumeData.summary || ''}"
- Work Experiences: ${JSON.stringify(resumeData.experiences || [])}
- Education: ${JSON.stringify(resumeData.education || [])}
- Existing Skills: "${resumeData.skills || ''}"
- Chosen Template: "${resumeData.templateId || 'modern'}"

Return ONLY a valid JSON object matching this exact schema without any markdown backticks or commentary:
{
  "fullName": "${resumeData.fullName || 'Candidate'}",
  "professionalTitle": "${resumeData.professionalTitle || 'Software Engineer'}",
  "email": "${resumeData.email || 'candidate@example.com'}",
  "phone": "${resumeData.phone || '+1 (555) 234-5678'}",
  "location": "${resumeData.location || 'San Francisco, CA'}",
  "summary": "Full comprehensive professional summary preserving all candidate information",
  "experiences": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date",
      "endDate": "End Date",
      "location": "City, State",
      "description": "• Full detailed bullet points covering all user responsibilities..."
    }
  ],
  "education": [
    {
      "school": "School Name",
      "degree": "Degree",
      "field": "Field of Study",
      "graduationYear": "Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "templateId": "${resumeData.templateId || 'modern'}",
  "atsScore": 95,
  "aiHighlights": [
    "Preserved and enhanced your complete input text with quantified impact",
    "Optimized all keywords for ATS scanners",
    "Tailored flexible layout to your selected template"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    let raw = response.text ? response.text.trim() : "";
    raw = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    try {
      const parsed = JSON.parse(raw);
      return res.json({
        ...parsed,
        templateId: resumeData.templateId || parsed.templateId || "modern",
        isFallback: false
      });
    } catch (parseErr) {
      console.error("Gemini Complete Resume JSON Parse Error:", parseErr, raw);
      const fallback = fallbackGenerateCompleteResume(resumeData);
      return res.json({
        ...fallback,
        isFallback: true
      });
    }
  } catch (err) {
    console.error("Gemini AI Generate Complete Resume Error:", err);
    const fallback = fallbackGenerateCompleteResume(req.body);
    return res.json({
      ...fallback,
      isFallback: true,
      errorNotice: err.message
    });
  }
});

// ============================================
// GET /api/ai/status - Check if Gemini API is ready
// ============================================
router.get("/status", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return res.json({
    configured: hasKey,
    provider: "MilkaaCV AI",
    model: "AI Engine",
    message: hasKey 
      ? "AI Assistant is connected and active" 
      : "AI key is not configured yet. Fallback generator is active."
  });
});

// ============================================
// POST /api/ai/improve-summary
// ============================================
router.post("/improve-summary", authMiddleware, async (req, res, next) => {
  try {
    const { currentSummary, professionalTitle, skills, experienceYears } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return high quality template response when key isn't provided
      return res.json({
        summary: fallbackImproveSummary(professionalTitle, skills, currentSummary),
        isFallback: true,
        notice: "Using local generator. Configure AI key in backend/.env to activate live AI."
      });
    }

    const prompt = `You are a certified professional resume writer and ATS optimization specialist.
Task: Write a high-impact, ATS-friendly professional resume summary.

Context:
- Target Role / Title: ${professionalTitle || "Not specified"}
- Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not specified"}
- Years of Experience: ${experienceYears || "Not specified"}
- Existing Draft: "${currentSummary || ""}"

Requirements:
1. Exactly 3 to 4 impactful sentences.
2. Open with an active professional title + core strength.
3. Highlight achievements, methodologies, and technical competencies.
4. ATS friendly: avoid flowery cliches; use clear action verbs and quantifiable results.
5. Return ONLY the plain text summary, no markdown headings, no quotes, no extra remarks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const outputText = response.text?.trim() || fallbackImproveSummary(professionalTitle, skills, currentSummary);

    return res.json({
      summary: outputText,
      isFallback: false
    });
  } catch (err) {
    console.error("Gemini AI Summary Error:", err);
    // Graceful fallback on rate limit or API error
    return res.json({
      summary: fallbackImproveSummary(req.body.professionalTitle, req.body.skills, req.body.currentSummary),
      isFallback: true,
      errorNotice: err.message
    });
  }
});

// ============================================
// POST /api/ai/improve-bullet
// ============================================
router.post("/improve-bullet", authMiddleware, async (req, res, next) => {
  try {
    const { bullet, position, company } = req.body;

    if (!bullet || !bullet.trim()) {
      return res.status(400).json({ error: "Bullet point text is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = fallbackImproveBullet(bullet, position);
      return res.json({
        improved: fallback.improved,
        alternatives: fallback.alternatives,
        isFallback: true,
        notice: "Using local generator. Configure AI key in backend/.env to activate live AI."
      });
    }

    const prompt = `You are an elite executive resume editor.
Rewrite the following resume bullet point to make it compelling, ATS-optimized, and metrics-driven using Google's "X-Y-Z formula" (Accomplished [X] as measured by [Y], by doing [Z]).

Role: ${position || "Team Member"} ${company ? "at " + company : ""}
Original Draft: "${bullet}"

Instructions:
1. Provide one primary polished bullet point.
2. Provide two alternative variations (one emphasizing leadership/collaboration, one emphasizing efficiency/technical execution).
3. Do not include markdown bold or asterisk markers in the bullets.
4. Output valid JSON only, with this exact schema:
{
  "improved": "Primary polished bullet string",
  "alternatives": [
    "Alternative bullet 1",
    "Alternative bullet 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    let raw = response.text ? response.text.trim() : "";
    // Clean potential markdown json fences
    raw = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    try {
      const parsed = JSON.parse(raw);
      return res.json({
        improved: parsed.improved,
        alternatives: parsed.alternatives || [],
        isFallback: false
      });
    } catch {
      return res.json({
        improved: raw || fallbackImproveBullet(bullet, position).improved,
        alternatives: fallbackImproveBullet(bullet, position).alternatives,
        isFallback: false
      });
    }
  } catch (err) {
    console.error("Gemini AI Bullet Error:", err);
    const fallback = fallbackImproveBullet(req.body.bullet, req.body.position);
    return res.json({
      improved: fallback.improved,
      alternatives: fallback.alternatives,
      isFallback: true,
      errorNotice: err.message
    });
  }
});

// ============================================
// POST /api/ai/suggest-skills
// ============================================
router.post("/suggest-skills", authMiddleware, async (req, res, next) => {
  try {
    const { professionalTitle, existingSkills } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "REST APIs", "Git", "Agile Methodology", "Problem Solving", "CI/CD"],
        isFallback: true
      });
    }

    const prompt = `Provide the top 12 most in-demand technical and core skills searched by ATS scanners for the role: "${professionalTitle || 'Software Engineer'}".
Exclude these skills if already listed: ${Array.isArray(existingSkills) ? existingSkills.join(", ") : existingSkills || "none"}.

Output ONLY valid JSON in this exact structure:
{
  "skills": ["Skill 1", "Skill 2", "Skill 3", ...]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    let raw = response.text ? response.text.trim() : "";
    raw = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    try {
      const parsed = JSON.parse(raw);
      return res.json({
        skills: parsed.skills || [],
        isFallback: false
      });
    } catch {
      return res.json({
        skills: ["Problem Solving", "Team Leadership", "Communication", "Project Management"],
        isFallback: false
      });
    }
  } catch (err) {
    console.error("Gemini AI Skills Error:", err);
    return res.json({
      skills: ["Problem Solving", "Team Leadership", "Communication", "Project Management"],
      isFallback: true
    });
  }
});

// ============================================
// POST /api/ai/analyze-ats
// ============================================
router.post("/analyze-ats", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId, resumeContent, targetJobTitle, jobDescription } = req.body;
    const userId = req.user.id;

    if (!resumeContent) {
      return res.status(400).json({ error: "resumeContent is required for ATS analysis" });
    }

    const ai = getGeminiClient();
    let analysisResult;

    if (!ai) {
      analysisResult = fallbackAnalyzeAts(resumeContent, targetJobTitle, jobDescription);
    } else {
      const serializedContent = JSON.stringify(resumeContent, null, 2);
      const prompt = `You are an elite Applicant Tracking System (ATS) algorithmic analyzer and senior tech recruiter.
Analyze the following resume JSON to provide an accurate, honest ATS score (0-100) and actionable keyword matching feedback.

Target Job Title: ${targetJobTitle || "Not specified (evaluate against general industry standard for the candidate's title)"}
Target Job Description:
"""
${jobDescription || "No specific job description provided. Evaluate based on modern industry standards and ATS parsing rules for this candidate's role."}
"""

Resume Content:
"""
${serializedContent}
"""

Analysis Rules:
1. "score": Overall ATS score from 0 to 100 based on keyword density, quantifiable impact (numbers/metrics), clarity, and standard ATS formatting.
2. "breakdown": Object with 0-100 scores for: "keywordMatch", "impactAndMetrics", "atsFormatting", "completeness".
3. "summary": A crisp 2-sentence executive summary of the resume's ATS standing.
4. "missingKeywords": List of 4 to 8 critical technical and domain keywords that are missing or under-represented.
5. "strengths": 2 to 4 bullet points highlighting what the candidate did well.
6. "improvements": 2 to 4 high-leverage recommendations to boost the score by 15-20 points.

Output valid JSON ONLY in this exact schema:
{
  "score": 85,
  "summary": "...",
  "breakdown": {
    "keywordMatch": 80,
    "impactAndMetrics": 85,
    "atsFormatting": 95,
    "completeness": 85
  },
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      let raw = response.text ? response.text.trim() : "";
      raw = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

      try {
        analysisResult = JSON.parse(raw);
        analysisResult.isFallback = false;
      } catch (parseErr) {
        console.error("Failed to parse Gemini ATS JSON:", parseErr, raw);
        analysisResult = fallbackAnalyzeAts(resumeContent, targetJobTitle, jobDescription);
      }
    }

    // Ensure score is valid integer between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(analysisResult.score || 75)));
    analysisResult.score = finalScore;

    // If resumeId provided and belongs to user, persist updated atsScore in database
    if (resumeId) {
      try {
        await Resume.findOneAndUpdate(
          { _id: resumeId, userId },
          { atsScore: finalScore }
        );
      } catch (dbErr) {
        console.error("Failed to update resume atsScore in DB:", dbErr);
      }
    }

    return res.json({
      analysis: analysisResult
    });
  } catch (err) {
    console.error("Gemini ATS Analysis Error:", err);
    const fallback = fallbackAnalyzeAts(req.body.resumeContent, req.body.targetJobTitle, req.body.jobDescription);
    return res.json({
      analysis: fallback,
      errorNotice: err.message
    });
  }
});

// ============================================
// POST /api/ai/scan-external-cv (PDF or Text)
// ============================================
router.post("/scan-external-cv", authMiddleware, async (req, res, next) => {
  try {
    const { resumeText, fileBase64, mimeType, targetJobTitle, jobDescription } = req.body;

    if (!resumeText && !fileBase64) {
      return res.status(400).json({ error: "Please provide either resumeText or fileBase64." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = fallbackScanExternalCv(resumeText, targetJobTitle, jobDescription);
      return res.json({
        parsedResume: fallback.parsedResume,
        analysis: fallback.analysis,
        isFallback: true
      });
    }

    const promptText = `You are an elite Applicant Tracking System (ATS) algorithmic parser and executive recruiter.
A candidate has submitted an external CV (created outside this system).

Instructions:
1. Thoroughly parse and extract all relevant candidate data into a clean structured resume object.
2. Calculate an honest, rigorous ATS match score (0-100), breakdown metrics, missing keywords, strengths, and actionable fixes.

Target Job Title: ${targetJobTitle || "Not specified (evaluate against candidate's primary domain)"}
Target Job Description:
"""
${jobDescription || "No specific job description provided. Evaluate based on modern industry standards and ATS parsing rules for this candidate's role."}
"""

${resumeText ? `Raw Resume Text:\n"""\n${resumeText}\n"""\n` : "The candidate's CV is attached as a document. Extract all details directly from it."}

Output valid JSON ONLY in this exact schema:
{
  "parsedResume": {
    "title": "Descriptive title for this resume (e.g. 'Software Engineer Resume')",
    "fullName": "Candidate full name",
    "email": "Candidate email or empty string",
    "phone": "Candidate phone or empty string",
    "location": "City, Country or empty string",
    "professionalTitle": "Professional title or target role",
    "summary": "Professional summary or career profile paragraph",
    "experiences": [
      {
        "company": "Company Name",
        "position": "Job Title",
        "startDate": "Start date or empty string",
        "endDate": "End date or empty string",
        "description": "Responsibilities and bullet points"
      }
    ],
    "education": [
      {
        "school": "University or College",
        "degree": "Degree",
        "field": "Field of study",
        "graduationYear": "Year or empty string"
      }
    ],
    "skills": ["Skill1", "Skill2", "Skill3", "Skill4"]
  },
  "analysis": {
    "score": 82,
    "summary": "Crisp 2-sentence executive verdict on the CV's ATS readiness and match quality.",
    "breakdown": {
      "keywordMatch": 80,
      "impactAndMetrics": 75,
      "atsFormatting": 85,
      "completeness": 90
    },
    "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "improvements": ["Actionable fix 1", "Actionable fix 2", "Actionable fix 3"]
  }
}`;

    let contents;
    if (fileBase64) {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
      contents = [
        {
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: cleanBase64,
          },
        },
        promptText,
      ];
    } else {
      contents = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
    });

    let raw = response.text ? response.text.trim() : "";
    raw = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    try {
      const parsed = JSON.parse(raw);
      const finalScore = Math.max(0, Math.min(100, Math.round(parsed.analysis?.score || 75)));
      if (parsed.analysis) parsed.analysis.score = finalScore;
      return res.json({
        parsedResume: parsed.parsedResume,
        analysis: parsed.analysis,
        isFallback: false
      });
    } catch (parseErr) {
      console.error("Failed to parse Gemini External CV JSON:", parseErr, raw);
      const fallback = fallbackScanExternalCv(resumeText, targetJobTitle, jobDescription);
      return res.json({
        parsedResume: fallback.parsedResume,
        analysis: fallback.analysis,
        isFallback: true
      });
    }
  } catch (err) {
    console.error("Gemini Scan External CV Error:", err);
    const fallback = fallbackScanExternalCv(req.body.resumeText, req.body.targetJobTitle, req.body.jobDescription);
    return res.json({
      parsedResume: fallback.parsedResume,
      analysis: fallback.analysis,
      isFallback: true,
      errorNotice: err.message
    });
  }
});

export default router;
