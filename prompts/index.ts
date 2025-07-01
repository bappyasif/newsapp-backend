export const resumeExperiencesPrompt = (text: string) => {
    return `
    from this resume text provide a detailed breakdown of the candidate's experiences or professional experiences. 
    
    Identify the specific experiences mentioned in this resume.

    list experiences from this resume in a way that can be easily understood by the interviewer.

    if no relevant experiences or professional experiences are found, try to list found experiences, certifications and educations or any other relevant information.

Resume text to analyze: ${text}`;
}

export const resumeSkillsPrompt = (text: string, role: string) => {
    return `
    Analyze the extracted resume text and provide a detailed breakdown of the candidate's skills. Identify the specific skills mentioned

Relevant tools and technologies used

Resume text to analyze: ${text}`
}

// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze the extracted resume text and provide a detailed breakdown of the candidate's skills. Identify the specific skills mentioned

// Relevant tools and technologies used in previous roles
// Compare and list the candidate's skills as a ${role} to common job roles in the industry as a ${role}

// Resume text to analyze: ${text}`
// }

// this provides a lot better skilsl listings rather than comparisons
// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze the extracted resume text and provide a detailed breakdown of the candidate's skills. Identify the specific skills mentioned

// List Relevant tools and technologies used in ${role} professionally

// Compare and list the candidate's skills as a ${role} to common job roles in the industry as a ${role}

// Resume text to analyze: ${text}`
// }


// still getting back skills specefics results and not any comparisons
// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze the extracted resume text and Identify the specific skills mentioned dont have to list them if response would exceed free limit of 1024 tokens rather do following:

// Compare and list the candidate's skills as a ${role} to common job roles in the industry as a ${role} and quantify them however useful

// Resume text to analyze: ${text}`
// }


// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze the extracted resume text and Identify the specific skills mentioned dont list them if response would exceed free limit of 1024 tokens rather do following:

//     Identify the top 4 skills gaps for this ${role} and provide recommendations for improvement. What areas of development would you suggest for a candidate to excel in this role?

// Compare and list the candidate's skills that are missing as a ${role} to common job roles in the industry as a ${role} and quantify them however useful

// Resume text to analyze: ${text}`
// }


// best skillset identification prompt so far!!
// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze the extracted resume text and Identify the specific skills mentioned

// Resume text to analyze: ${text}`
// }

// this will return if there is any missing skills list found in resume which usualy no resume would never have in
// export const resumeSkillsFeedbackPrompt = (text: string, role: string) => {
//     return `
//     Analyze this extracted resume text and Identify the top 4 skills gaps for this ${role} and provide recommendations for improvement. What areas of development would you suggest for a candidate to excel in this role?

// Compare and list the candidate's skills that are missing as a ${role} to common job roles in the industry as a ${role} and quantify them however useful

// Resume text to analyze: ${text}`
// }

// export const resumeSkillsFeedbackPrompt = (text: string, role: string, skills: string = "JavaScript, HTML, CSS, and Java, MERN stack, Expo Stack", industry: string = 'IT') => {
//     return `Resume text to analyze: ${text}

// SKILLS: ${skills}

// ROLE: ${role}

// INDUSTRY: ${industry}

// RESPONSE FORMAT:
// Please analyze the resume text and compare it to the typical skills required for a ${role} in the ${industry} industry. Identify the top 4 skills gaps for the role and provide recommendations for improvement. Quantify the skills gaps in terms of must-have, nice-to-have, and skills gaps.

// If the resume does not contain any missing skills, please respond with "No missing skills found."

// stop responding with "impossible to say" or related without any information
// `
// }


export const resumeSkillsFeedbackPrompt = (text: string, role: string, skills: string = "Dev Ops, Cloud Computing, DevSecOps, Docker, Kubernetes, Redis, MongoDB, PostgreSQL, json, html, css, js, python, java, javascript, react, react native, node, express, vue, angular", industry: string = 'IT') => {
    return `
    Analyze this extracted resume text and Identify the top 4 skills gaps for this ${role} and provide recommendations for improvement. What areas of development would you suggest for a candidate to excel in this role?

    ideal skills: ${skills}

Compare and list the candidate's that are missing as a ${role} to common job roles in the industry as a ${role} and quantify them however useful

Resume text to analyze: ${text}`
}

export const geminiResumePromptInOneGo = (text: string, role: string) => {
    return `
    Analyze this resume and extract:
    - Name
    - Email
    - Phone
    - Skills
    - Experience
    - Education
    - Certifications

    when possible include improvements for role ${role} in skills required, experience, and education or certifications for resume feedback.

    Format your response as a JSON object.
    Resume Text:
    ${text}
    `
}

export const geminiResumePromptForExtraction = (text: string, role: string) => {
    return `
    Analyze this resume and extract the following information:
- Name
- Email
- Phone
- Skills (as a list of strings)
- Experience (as a list of objects, each detailing title, company, dates, and key responsibilities/achievements)
- Education (as a list of objects, each detailing degree, institution, and dates)
- Certifications (as a list of strings)
- Projects (as a list of strings)
- Awards (as a list of strings)
- Languages (as a list of strings)
- Interests (as a list of strings)
- Achievements (as a list of strings)
- References (as a list of strings)
- Summary (few sentences that reflects candidates strengths and weaknesses as a ${role})

Format your response strictly as a JSON object and turn those props keys in lowercase.
Resume Text:
${text}
    `
}

export const geminiResumePromptForFeedback = (text: string, role: string) => {
    return `
    Given the following resume text for a candidate interested in a "${role}" position:
---
Resume Text:
${text}
---

Provide actionable feedback and suggestions for improvement related to the "${role}". Focus on:
- Skills: Identify any crucial skills for a ${role} that are missing or could be highlighted better. Suggest relevant skills to develop.
- Experience: How can the candidate better tailor their experience presentation for a ${role}? Suggest ways to quantify achievements.
- Education: Are there any additional educational qualifications or certifications that would be beneficial for a ${role}?
- Certifications: How can the candidate's certifications demonstrate their relevant skills for a ${role}?
- Projects: How can the candidate's projects demonstrate their relevant skills for a ${role}?
- Awards: How can the candidate's awards demonstrate their achievements in a ${role}?
- Interests: How can the candidate's interests align with a ${role}?
- Achievements: How can the candidate's achievements demonstrate their relevant skills for a ${role}?
- References: How can the candidate's references demonstrate their relevant skills for a ${role}?
- - ATS: calculate ATS score (out of 10) before and after reflecting then  adjusted resume as per provided feedback. Suggestions and improvements for ATS score
- Summary: How can the candidate's summary demonstrate their relevant skills for a ${role}?

Format your response as a JSON object with keys in lowercase.
    `
}

// - ATS: calculate ATS score (out of 10) before and after reflecting then  adjusted resume as per provided feedback. Also suggest ways to improve ATS score

// - ATS: calculate ATS score (out of 10) before and after reflecting then  adjusted resume as per provided feedback. Suggestions and improvements for ATS score

// - ATS score: calculate ATS score (out of 10) after reflecting and adjusted resume as per feedback
// - ATS improvements: Suggest ways to improve ATS score