"""
DataPulse - AI Investigation Prompts
Prompt templates for AI-assisted crime analysis, lead generation, and case matching.
"""

SYSTEM_INVESTIGATION_PROMPT = """You are DataPulse AI, an advanced Law Enforcement Criminal Intelligence Assistant.
Your objective is to provide high-precision, actionable, and structured investigative analysis for police officers.
Be concise, professional, clear, and prioritize public safety and tactical effectiveness.
"""

SUMMARY_PROMPT = """Analyze the following crime incident details and generate an executive investigation summary.

CRIME DETAILS:
Title: {title}
Category: {category}
Severity: {severity}
District: {district}
Location: {location}
Status: {status}
Description: {description}
Reported By: {reported_by}

Provide a structured analysis with the following sections:
1. 📋 **Executive Incident Summary** (2-3 concise sentences)
2. ⚠️ **Operational Risk & Threat Assessment** (Primary threat vectors & urgency)
3. 🎯 **Modus Operandi (M.O.) Analysis** (Pattern of execution)
4. 📌 **Key Evidence & Variables Identified**
"""

LEADS_PROMPT = """Based on the crime incident provided below, generate prioritized, actionable investigation leads for the investigating officer.

INCIDENT DETAILS:
Title: {title}
Category: {category}
Severity: {severity}
District: {district}
Description: {description}

Provide 4-5 tactical leads in bullet points covering:
- 🔍 **Immediate Field Actions** (Canvas area, CCTV retrieval, Digital forensics)
- 👤 **Suspect & Witness Interrogation Angles**
- 💻 **Cyber / Financial Data Checks** (if applicable)
- 🤝 **Inter-Agency / Police Station Alerts**
"""

RELATIONSHIP_PROMPT = """Analyze potential criminal relationships and accomplice patterns for the following crime and suspects.

INCIDENT DETAILS:
Title: {title}
Category: {category}
District: {district}
Suspect Info: {suspect_info}

Analyze:
1. 🕸️ **Accomplice & Network Vulnerability** (Likely gang or network connections)
2. 🔄 **Repeat Offender Correlation** (Historical link to previous offenses)
3. 📍 **Geographic Operational Radius**
"""

RECOMMENDATION_PROMPT = """Based on the target case details, evaluate similar historical crime records and recommend comparative precedents.

TARGET CASE:
Category: {category}
District: {district}
Description: {description}

HISTORICAL MATCHES:
{historical_context}

Provide a comparative analysis highlighting:
- 🔁 **Matching Modus Operandi Patterns**
- 🏢 **Jurisdiction & Serial Suspect Indicators**
- 💡 **Key Takeaways from Past Case Resolutions**
"""
