export interface PolicyDocument {
  id: string
  fileName: string
  evidenceIndicator: string
  category: string
  uploadedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  url?: string
  content?: string
}

export interface PolicyBin {
  evidenceIndicator: string
  title: string
  description: string
  category: string
  documents: PolicyDocument[]
}

export const policyCategories = [
  { id: '1', name: 'Prior Information', icon: 'FileText' },
  { id: '3', name: 'Treatment Procedures', icon: 'Activity' },
  { id: '4', name: 'Job Descriptions', icon: 'Users' },
  { id: '5', name: 'Staff Requirements', icon: 'UserCheck' },
  { id: '6', name: 'Staffing Levels', icon: 'UsersRound' },
  { id: '7', name: 'Culture of Safety', icon: 'Shield' },
  { id: '8', name: 'Radioactive Materials', icon: 'Radiation' },
  { id: '9', name: 'Emergency Planning', icon: 'AlertTriangle' },
  { id: '10', name: 'Infection Control', icon: 'Heart' },
  { id: '11', name: 'Information Systems', icon: 'Database' },
  { id: '13', name: 'Peer Review', icon: 'UserSearch' },
  { id: '14', name: 'Patient Care', icon: 'Stethoscope' },
]

export const policyBins: PolicyBin[] = [
  {
    evidenceIndicator: '1.3',
    title: 'Sending prior radiation information',
    description: 'SOP on sending prior radiation therapy information to new providers when requested',
    category: 'Prior Information',
    documents: []
  },
  {
    evidenceIndicator: '3.1',
    title: 'Data transfer',
    description: 'SOP on verification of patient identity during information and/or data transfer',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.1',
    title: 'Simulation',
    description: 'SOP for simulation procedures',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.2',
    title: 'EBRT',
    description: 'SOP for EBRT (2D, 3D, 4D, IMRT/VMAT)',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.3',
    title: 'SRS',
    description: 'SOP for SRS',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.4',
    title: 'SBRT',
    description: 'SOP for SBRT/SABR',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.7',
    title: 'HDR',
    description: 'SOP for HDR',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.8',
    title: 'LDR',
    description: 'SOP for LDR',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.9',
    title: 'RPT',
    description: 'SOP for RPT',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.10',
    title: 'Microspheres',
    description: 'SOP for microspheres',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.12',
    title: 'Superficial',
    description: 'SOP for superficial radiation, including orthovoltage',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.13',
    title: 'IGRT/SGRT',
    description: 'SOP on IGRT/SGRT',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.14',
    title: 'Motion management',
    description: 'SOP for motion management',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.15',
    title: 'Emergent radiation therapy',
    description: 'SOP for emergent radiation therapy',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '3.3.16',
    title: 'CIED',
    description: 'SOP for EBRT treatments for patients with cardiac implanted electronic devices',
    category: 'Treatment Procedures',
    documents: []
  },
  {
    evidenceIndicator: '4.1.1',
    title: 'Radiation oncologists',
    description: 'Job description for radiation oncologists',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.2',
    title: 'Medical physicists',
    description: 'Job description for medical physicists',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.3',
    title: 'Radiation therapists',
    description: 'Job description for radiation therapists',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.4',
    title: 'Dosimetrists',
    description: 'Job description for medical dosimetrists',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.5',
    title: 'Oncology nurses',
    description: 'Job description for radiation oncology nurses',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.6',
    title: 'Non-physician providers',
    description: 'Job description for radiation oncology non-physician providers',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.7',
    title: 'Therapist and Physicist Assistants',
    description: 'Job description for therapist and/or physicist assistants',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.8',
    title: 'Practice manager/administrator',
    description: 'Job description for the practice manager/administrator',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.1.9',
    title: 'Radiation Safety Officer',
    description: 'Job description for the Radiation Safety Officer',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '4.2',
    title: 'Medical Director',
    description: 'Job description for the Medical Director',
    category: 'Job Descriptions',
    documents: []
  },
  {
    evidenceIndicator: '5.1',
    title: 'Board eligibility requirements',
    description: 'SOP for staff Board certification requirements',
    category: 'Staff Requirements',
    documents: []
  },
  {
    evidenceIndicator: '5.2',
    title: 'Licensure and certification',
    description: 'Policy on verification of licensure and Board certification status',
    category: 'Staff Requirements',
    documents: []
  },
  {
    evidenceIndicator: '5.3',
    title: 'Staff on-boarding',
    description: 'Evidence of staff on-boarding',
    category: 'Staff Requirements',
    documents: []
  },
  {
    evidenceIndicator: '5.4',
    title: 'Annual staff training',
    description: 'Evidence of annual staff training',
    category: 'Staff Requirements',
    documents: []
  },
  {
    evidenceIndicator: '6.1',
    title: 'Staffing levels',
    description: 'Staffing policy and completed staffing table',
    category: 'Staffing Levels',
    documents: []
  },
  {
    evidenceIndicator: '6.2',
    title: 'Temporary personnel/locums',
    description: 'SOP on temporary personnel/locums',
    category: 'Staffing Levels',
    documents: []
  },
  {
    evidenceIndicator: '7.1',
    title: 'Culture of Safety',
    description: 'SOP on the Culture of Safety',
    category: 'Culture of Safety',
    documents: []
  },
  {
    evidenceIndicator: '7.3',
    title: 'Interdisciplinary meetings',
    description: 'Minutes from the two most recent interdisciplinary quality/safety meetings',
    category: 'Culture of Safety',
    documents: []
  },
  {
    evidenceIndicator: '8.3',
    title: 'Radioactive materials',
    description: 'SOP on radioactive material storage, handling and waste',
    category: 'Radioactive Materials',
    documents: []
  },
  {
    evidenceIndicator: '9.1',
    title: 'Emergency preparation and planning',
    description: 'SOP for emergency response to equipment and facility related emergencies',
    category: 'Emergency Planning',
    documents: []
  },
  {
    evidenceIndicator: '9.2',
    title: 'Emergency response',
    description: 'SOP for emergency response for patient-related emergencies',
    category: 'Emergency Planning',
    documents: []
  },
  {
    evidenceIndicator: '10.3',
    title: 'Infection Control',
    description: 'SOP on infection control',
    category: 'Infection Control',
    documents: []
  },
  {
    evidenceIndicator: '11.1',
    title: 'Information systems',
    description: 'SOP on information systems management',
    category: 'Information Systems',
    documents: []
  },
  {
    evidenceIndicator: '13.1',
    title: 'Peer review',
    description: 'SOP on intradisciplinary peer review',
    category: 'Peer Review',
    documents: []
  },
  {
    evidenceIndicator: '14.1',
    title: 'Informed consent',
    description: 'SOP for informed consent',
    category: 'Patient Care',
    documents: []
  },
  {
    evidenceIndicator: '14.2',
    title: 'Translation services',
    description: 'SOP for communicating with patients with language or other communication barriers',
    category: 'Patient Care',
    documents: []
  },
  {
    evidenceIndicator: '14.5',
    title: 'Financial education',
    description: 'SOP for financial education',
    category: 'Patient Care',
    documents: []
  },
  {
    evidenceIndicator: '14.7',
    title: 'Patient experience',
    description: 'SOP on patient feedback',
    category: 'Patient Care',
    documents: []
  },
]
