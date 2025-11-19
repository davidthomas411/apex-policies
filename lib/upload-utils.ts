import { policyBins, PolicyDocument } from './policy-data'

const FILENAME_MAPPINGS: Record<string, string> = {
  "200 - Previous Treatment Record Retrieval.TBA.pdf": "1.3",
  "106 - radiation oncology patient verification during electronic transfer.a_1.pdf": "3.1",
  "skcc_simulation new_1.pdf": "3.3.1",
  "skcc_ebrt_imrt_vmat_1.pdf": "3.3.2",
  "SKCC_PP_231_SRS SOP.pdf": "3.3.3",
  "skcc_sitespecificsbrtpnps_1.pdf": "3.3.4",
  "530+550.pdf": "3.3.7",
  "SOPs_RTPs_RSO+PolicyStat.pdf": "3.3.9",
  "RSO-026 Y-90.Sep2.2025(RAS.CMA).pdf": "3.3.10",
  "statement regarding superficial_1.pdf": "3.3.12",
  "PP_IGRT+SGRT.pdf": "3.3.13",
  "PP TJUH Motion Management SOP_2025-08-27.pdf": "3.3.14",
  "SOP_ClinicalSetups_EmergencyTx_2025-09-16.pdf": "3.3.15",
  "3.3.16 combined cied_1.pdf": "3.3.16",
  "RadOnc Job Description 6.2025.pdf": "4.1.1",
  "medical physicist jd_1.pdf": "4.1.2",
  "RadtherapistJDcombined.pdf": "4.1.3",
  "Enterprise JD - Dosimetrist II.pdf": "4.1.4",
  "enterprise jd - registered nurse (acute care)_1.pdf": "4.1.5",
  "Enterprise JD APP Outpatient (1).pdf": "4.1.6",
  "PhysicsAssistanJobDescription_ForPosting.pdf": "4.1.7",
  "JD administrator 4.1.8.pdf": "4.1.8",
  "tjuh rso full jd v2_1.pdf": "4.1.9",
  "medical director combined_1.pdf": "4.2",
  "104 - radiation oncology staff licensing & credentialing.a_1.pdf": "5.1",
  "verification of licensure- certification & registration- 200-04_1.pdf": "5.2",
  "Onboarding examples combined.pdf": "5.3",
  "5.4 Mandatory annual training policy+sampling.pdf": "5.4",
  "Staffing tables+policy 6.1.pdf": "6.1",
  "6.2 Locum combined.pdf": "6.2",
  "7 Culture of safety combined.pdf": "7.1",
  "minutes fom quality safety meetings_1.pdf": "7.3",
  "530+550+PolicyStat.pdf": "8.3",
  "9.1 combined.pdf": "9.1",
  "9.2 Emergency response combined.pdf": "9.2",
  "301 - Radiation Oncology Infection Prevention Policy.A.pdf": "10.3",
  "Information Systems Access Control and Audit Logging-Monitoring Policy- 126-17.pdf": "11.1",
  "Radiation Oncology Program Peer Review Practices.docx": "13.1",
  "Informed Consent- 117-03.pdf": "14.1",
  "Interpreter and Language Services for Visually Impaired- Limited English Proficiency -112.11.pdf": "14.2",
  "14.5 combined Financial.pdf": "14.5",
  "14.7 combined pt experience.pdf": "14.7",
}

export function matchFileToEvidenceIndicator(fileName: string): string | null {
  if (FILENAME_MAPPINGS[fileName]) {
    return FILENAME_MAPPINGS[fileName]
  }

  const normalizedFileName = fileName.toLowerCase()
  
  const patterns = [
    /(\d+\.\d+(?:\.\d+)?)/g, // Matches 1.3, 3.3.1, 14.7, etc.
  ]
  
  for (const pattern of patterns) {
    const matches = normalizedFileName.match(pattern)
    if (matches) {
      for (const match of matches) {
        // Check if this evidence indicator exists in our bins
        const bin = policyBins.find(b => b.evidenceIndicator === match)
        if (bin) {
          return match
        }
      }
    }
  }
  
  const keywordMatches: Record<string, string[]> = {
    '1.3': ['prior', 'radiation', 'information', 'previous', 'treatment', 'record'],
    '3.1': ['data transfer', 'patient identity', 'verification', 'electronic transfer'],
    '3.3.1': ['simulation'],
    '3.3.2': ['ebrt', 'imrt', 'vmat'],
    '3.3.3': ['srs'],
    '3.3.4': ['sbrt', 'sabr'],
    '3.3.7': ['hdr'],
    '3.3.8': ['ldr'],
    '3.3.9': ['rpt'],
    '3.3.10': ['microspheres', 'y-90', 'y90'],
    '3.3.12': ['superficial', 'orthovoltage'],
    '3.3.13': ['igrt', 'sgrt'],
    '3.3.14': ['motion', 'management', '4d-ct'],
    '3.3.15': ['emergent', 'emergency'],
    '3.3.16': ['cied', 'cardiac', 'implanted', 'electronic', 'device'],
    '4.1.1': ['radiation oncologist', 'radonc'],
    '4.1.2': ['medical physicist', 'physicist jd'],
    '4.1.3': ['radiation therapist', 'therapist jd'],
    '4.1.4': ['dosimetrist'],
    '4.1.5': ['oncology nurse', 'registered nurse'],
    '4.1.6': ['non-physician', 'app', 'provider'],
    '4.1.7': ['assistant', 'physics assistant', 'therapy assistant'],
    '4.1.8': ['practice manager', 'administrator'],
    '4.1.9': ['radiation safety officer', 'rso'],
    '4.2': ['medical director'],
    '5.1': ['board', 'certification', 'eligibility'],
    '5.2': ['licensure', 'certification', 'verification'],
    '5.3': ['onboarding', 'on-boarding'],
    '5.4': ['annual', 'training', 'mandatory'],
    '6.1': ['staffing', 'levels', 'table'],
    '6.2': ['locum', 'temporary', 'personnel'],
    '7.1': ['culture', 'safety'],
    '7.3': ['interdisciplinary', 'meetings', 'minutes', 'quality'],
    '8.3': ['radioactive', 'materials', 'storage', 'waste'],
    '9.1': ['emergency', 'preparation', 'planning', 'equipment', 'facility'],
    '9.2': ['emergency', 'response', 'patient'],
    '10.3': ['infection', 'control', 'prevention'],
    '11.1': ['information', 'systems', 'management', 'access'],
    '13.1': ['peer', 'review'],
    '14.1': ['informed', 'consent'],
    '14.2': ['translation', 'interpreter', 'language'],
    '14.5': ['financial', 'education'],
    '14.7': ['patient', 'experience', 'feedback'],
  }
  
  for (const [indicator, keywords] of Object.entries(keywordMatches)) {
    const matchCount = keywords.filter(keyword => 
      normalizedFileName.includes(keyword.toLowerCase())
    ).length
    
    if (matchCount >= 2) {
      return indicator
    }
  }
  
  return null
}

export function createPolicyDocument(
  file: File,
  evidenceIndicator: string
): PolicyDocument {
  const bin = policyBins.find(b => b.evidenceIndicator === evidenceIndicator)
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName: file.name,
    evidenceIndicator,
    category: bin?.category || 'Uncategorized',
    uploadedAt: new Date(),
    status: 'pending'
  }
}
