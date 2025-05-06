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