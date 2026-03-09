const pdfParse = require('pdf-parse');

// Basic heuristic match logic for finding Job Compatibility Score
const calculateMatchScore = (resumeText, jobDescription, requiredSkills, experienceLevel) => {
    const resumeLower = resumeText.toLowerCase();
    const descLower = jobDescription.toLowerCase();

    // 1. Skill Overlap (0.4)
    let skillMatch = 0;
    if (requiredSkills && requiredSkills.length > 0) {
        let matchedSkills = 0;
        requiredSkills.forEach(skill => {
            if (resumeLower.includes(skill.toLowerCase())) {
                matchedSkills++;
            }
        });
        skillMatch = matchedSkills / requiredSkills.length;
    } else {
        skillMatch = 0.5; // Neutral if no skills specified
    }

    // 2. Keyword similarity (simplified heuristic) (0.3)
    const buzzwords = ['react', 'node', 'express', 'mongodb', 'sql', 'javascript', 'python', 'java', 'aws', 'docker', 'typescript', 'frontend', 'backend', 'fullstack', 'api', 'git'];
    let jobKeywords = buzzwords.filter(b => descLower.includes(b));
    let resumeKeywords = jobKeywords.filter(b => resumeLower.includes(b));

    let keywordMatch = 0;
    if (jobKeywords.length > 0) {
        keywordMatch = resumeKeywords.length / jobKeywords.length;
    } else {
        keywordMatch = 0.5;
    }

    // 3. Experience Match (0.3)
    let experienceMatch = 0;
    if (experienceLevel && resumeLower.includes(experienceLevel.toLowerCase())) {
        experienceMatch = 1.0;
    } else {
        experienceMatch = 0.5; // neutral
    }

    // Final Score
    const score = (0.4 * skillMatch) + (0.3 * experienceMatch) + (0.3 * keywordMatch);

    return {
        totalScore: score,
        breakdown: {
            skillMatch,
            experienceMatch,
            keywordMatch
        }
    };
};

const parseResume = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (err) {
        console.error('Error parsing PDF:', err);
        return '';
    }
};

module.exports = { calculateMatchScore, parseResume };
