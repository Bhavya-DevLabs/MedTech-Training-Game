// All 22 Dualto NSM training questions — SINGLE SOURCE OF TRUTH for question data.
// Topics: Pre-Sales (Q1-Q9), Polyphonic Preparation (Q10-Q13),
//         Device Shipment (Q14-Q18), Device Installation (Q19-Q22)
//
// Types: single-select | multi-select | drag-drop-blank | drag-drop-blanks | drag-drop-order

export const QUESTIONS = [
  // ──────────────────────────────────────────────
  //  PRE-SALES  (Q1 – Q9)
  // ──────────────────────────────────────────────
  {
    id: 'q1',
    topic: 'Pre-Sales',
    type: 'multi-select',
    question: 'What are the 2 steps to be done before PO is released?',
    options: [
      'Activation & Go-LIVE',
      'Polyphonic Preparation',
      'Clinical Evaluation/Hospital IT Review',
      'Connectivity Readiness',
      'Device installation'
    ],
    correctAnswers: [2, 3],
    points: 5
  },
  {
    id: 'q2',
    topic: 'Pre-Sales',
    type: 'multi-select',
    question: 'What are the various resources available for the sales team to engage with the hospital teams during the pre-purchase process?',
    options: [
      'Intake Form',
      'IFU',
      'Price List',
      'Technical Brochure',
      'Service Brochure',
      'Connectivity Welcome Packet',
      'Cybersecurity Whitepaper',
      'Privacy & Security Technical Brief'
    ],
    correctAnswers: [0, 3, 4, 5, 7],
    points: 5
  },
  {
    id: 'q3',
    topic: 'Pre-Sales',
    type: 'drag-drop-blank',
    question: 'Since these questions may be more technical for a sales team to answer, the right DRI for this stage is the ________.',
    options: [
      'IT team',
      'Biomed team',
      'Dualto Specialist',
      'Cybersecurity Consultant',
      'Regional Sales Manager'
    ],
    correctAnswers: [2],
    points: 5
  },
  {
    id: 'q4',
    topic: 'Pre-Sales',
    type: 'drag-drop-blank',
    question: 'If in any case, a DUALTO specialist needs information to answer the hospital\'s query, he would need to get in touch with ________.',
    options: [
      'APAC Technical Team',
      'Bhanupriya',
      'India Technical Team',
      'Jigmee',
      'Global Technical Team'
    ],
    correctAnswers: [0],
    points: 5
  },
  {
    id: 'q5',
    topic: 'Pre-Sales',
    type: 'drag-drop-blanks',
    question: 'After the IT assessment has been reviewed and approved by the Hospital IT team, the sales representative will re-engage with the Hospital IT and Biomed teams to discuss ________ & ________.',
    options: [
      'Reserving a physical Ethernet port for use during installation',
      'Single Sign On (SSO)',
      'Firewall whitelisting',
      'VPN Configuration',
      'Data storage'
    ],
    correctAnswers: [2, 0],
    points: 5
  },
  {
    id: 'q6',
    topic: 'Pre-Sales',
    type: 'multi-select',
    question: 'What are the 2 ways in which DUALTO can be connected?',
    options: [
      'Direct Ethernet connection',
      'Tethered to a connected computer',
      'Hospital Wi-Fi',
      'Bluetooth pairing',
      'VPN-based remote connection'
    ],
    correctAnswers: [0, 1],
    points: 5
  },
  {
    id: 'q7',
    topic: 'Pre-Sales',
    type: 'single-select',
    question: 'Which of the following correctly describes the steps required to set up SSO Federation?',
    options: [
      'Sales works with Hospital IT to complete the federation form \u2192 form is emailed to Tech Support \u2192 internal J&J team shares URLs \u2192 Hospital IT configures and activates SSO',
      'Hospital IT configures SSO \u2192 Sales submits form \u2192 URLs are generated later',
      'Sales sends request directly to Hospital IT without internal support',
      'Hospital IT activates SSO without completing the federation form'
    ],
    correctAnswers: [0],
    points: 5
  },
  {
    id: 'q8',
    topic: 'Pre-Sales',
    type: 'single-select',
    question: 'What is the first action required to initiate SSO Federation for a hospital?',
    options: [
      'Sales representative works with Hospital IT to fill the federation section of the connectivity welcome packet',
      'Hospital IT configures federation in their system',
      'Internal J&J team shares URLs',
      'User accounts are created in Polyphonic Fleet'
    ],
    correctAnswers: [0],
    points: 5
  },
  {
    id: 'q9',
    topic: 'Pre-Sales',
    type: 'single-select',
    question: 'Once a contract is signed and a purchase order is placed, what is the next step?',
    options: [
      'Create a Polyphonic Biomed Admin account to install the systems',
      'Whitelist the Dualto MAC address',
      'Schedule device installation with the Biomed team',
      'Ship the Dualto unit to the hospital'
    ],
    correctAnswers: [0],
    points: 5
  },

  // ──────────────────────────────────────────────
  //  POLYPHONIC PREPARATION  (Q10 – Q13)
  // ──────────────────────────────────────────────
  {
    id: 'q10',
    topic: 'Polyphonic Preparation',
    type: 'single-select',
    question: 'How many users should be set up ahead of DUALTO installation, and who should they be?',
    options: [
      'One Biomed User, available post-installation',
      'Two Biomed Users, created by Hospital IT',
      'Two Biomed Admin Users, with at least one available to perform installation',
      'One Biomed Admin User and one Surgeon User'
    ],
    correctAnswers: [2],
    points: 5
  },
  {
    id: 'q11',
    topic: 'Polyphonic Preparation',
    type: 'drag-drop-order',
    question: 'Arrange the steps required to set up a Polyphonic account in the correct order:',
    options: [
      'Sales submits an intake form to the Polyphonic Customer Support team',
      'Internal teams create the accounts',
      'Hospital Biomed Admin receives activation and login emails'
    ],
    correctOrder: [0, 1, 2],
    points: 5
  },
  {
    id: 'q12',
    topic: 'Polyphonic Preparation',
    type: 'multi-select',
    question: 'What are the 3 activities a Biomed Admin user can do, that a Biomed user cannot?',
    options: [
      'User management',
      'Facility management',
      'Generation of an audit log',
      'Ability to view a list of all devices',
      'Setup new devices',
      'Performing software updates',
      'Updating security certificates',
      'Uploading event logs'
    ],
    correctAnswers: [0, 1, 2],
    points: 5
  },
  {
    id: 'q13',
    topic: 'Polyphonic Preparation',
    type: 'multi-select',
    question: 'Which of the following statements are TRUE for Polyphonic account setup based on whether SSO is enabled? (Select all that apply)',
    options: [
      'If SSO is enabled, Biomed Admin accounts are automatically activated',
      'If SSO is enabled, users must click an activation link within 7 days',
      'If SSO is not enabled, Biomed Admin users must set up MFA within 7 days',
      'If SSO is not enabled, users receive only one email to log in',
      'If SSO is enabled, users receive only one email with a login link',
      'If the activation email expires (non-SSO), a new one can be requested via TechSupportAPAC@its.jnj.com'
    ],
    correctAnswers: [0, 2, 4, 5],
    points: 5
  },

  // ──────────────────────────────────────────────
  //  DEVICE SHIPMENT  (Q14 – Q18)
  // ──────────────────────────────────────────────
  {
    id: 'q14',
    topic: 'Device Shipment',
    type: 'multi-select',
    question: 'Once DUALTO units are shipped, which actions are the responsibility of the Sales Representative? (Select all that apply)',
    options: [
      'Assign systems to the hospital in Mission Control',
      'Receive MAC addresses from the shipping team',
      'Work with Hospital IT to get MAC addresses whitelisted',
      'Work with Hospital IT to get URLs whitelisted',
      'Confirm that a physical Ethernet port is reserved',
      'Confirm that SSO federation is complete (as needed)',
      'Perform device assembly and guided setup'
    ],
    correctAnswers: [0, 2, 3, 4],
    points: 5
  },
  {
    id: 'q15',
    topic: 'Device Shipment',
    type: 'drag-drop-order',
    question: 'Arrange the following steps in the correct order after DUALTO units are shipped:',
    options: [
      'Systems are assigned to the hospital in Mission Control',
      'MAC addresses are emailed to the sales/marketing team',
      'Sales works with Hospital IT to whitelist MAC addresses & URLs',
      'Sales confirms Ethernet port reservation and SSO status'
    ],
    correctOrder: [0, 1, 2, 3],
    points: 5
  },
  {
    id: 'q16',
    topic: 'Device Shipment',
    type: 'single-select',
    question: 'What is the purpose of providing the DUALTO MAC address to the Hospital IT team?',
    options: [
      'To assign a user account to the device',
      'To generate login credentials for Polyphonic Fleet',
      'To identify the physical devices being connected to the hospital network',
      'To configure Single Sign On (SSO)'
    ],
    correctAnswers: [2],
    points: 5
  },
  {
    id: 'q17',
    topic: 'Device Shipment',
    type: 'single-select',
    question: 'Why must the URLs used by DUALTO be whitelisted before installation?',
    options: [
      'To create Biomed user accounts in Polyphonic Fleet',
      'To assign IP addresses to DUALTO devices',
      'To allow the DUALTO device to connect to the hospital network',
      'To activate Single Sign-On (SSO)'
    ],
    correctAnswers: [2],
    points: 5
  },
  {
    id: 'q18',
    topic: 'Device Shipment',
    type: 'multi-select',
    question: 'Which of the following statements correctly describe MAC address and URL whitelisting for DUALTO? (Select all that apply)',
    options: [
      'MAC address whitelisting allows Hospital IT to identify the physical DUALTO devices being connected to the network',
      'URL whitelisting enables the DUALTO device to connect to the hospital network',
      'If MAC addresses and URLs are not whitelisted, DUALTO systems cannot be installed',
      'MAC and URL whitelisting assign IP addresses to the DUALTO device',
      'Whitelisting typically takes 5\u201310 minutes but may extend to 48\u201372 hours due to hospital policies',
      'MAC and URL whitelisting are performed by the sales representative directly'
    ],
    correctAnswers: [0, 1, 2, 4],
    points: 5
  },

  // ──────────────────────────────────────────────
  //  DEVICE INSTALLATION  (Q19 – Q22)
  // ──────────────────────────────────────────────
  {
    id: 'q19',
    topic: 'Device Installation',
    type: 'drag-drop-blanks',
    question: 'In the assembly process, after removing modules from their respective packaging, we need to save the certificate in the ________ as it has the ________.',
    options: [
      'communications module box',
      'energy module packaging',
      'user screen',
      'shipping carton',
      'MAC address',
      'IP address',
      'serial number',
      'login credentials'
    ],
    correctAnswers: [0, 4],
    points: 5
  },
  {
    id: 'q20',
    topic: 'Device Installation',
    type: 'multi-select',
    question: 'Which of the following settings can be customized on DUALTO? (Select all that apply)',
    options: [
      'Screen brightness',
      'System volume',
      'Default energy settings',
      'Surgeon / procedure profiles',
      'Network firewall rules',
      'User login credentials'
    ],
    correctAnswers: [0, 1, 2, 3],
    points: 5
  },
  {
    id: 'q21',
    topic: 'Device Installation',
    type: 'drag-drop-blanks',
    question: 'To perform output verification, a Biomed needs a ________ and a ________. Instructions for output verification and electrical safety testing can be found in the ________.',
    options: [
      'DUALTO output verification key (ETHOVK)',
      'Footswitch',
      'Power adapter',
      'Network cable',
      'Service manual',
      'Connectivity Welcome Packet',
      'User Guide (Quick Start)'
    ],
    correctAnswers: [0, 1, 4],
    points: 5
  },
  {
    id: 'q22',
    topic: 'Device Installation',
    type: 'multi-select',
    question: 'With what topics can the J&J Tech Support team assist? (Select all that apply)',
    options: [
      'DUALTO questions or issues',
      'POLYPHONIC Fleet questions or issues',
      'Connectivity or IT related questions or issues',
      'Warranty extensions',
      'Workflow optimizing consulting',
      'Service contract negotiation'
    ],
    correctAnswers: [0, 1, 2],
    points: 5
  }
];

// Helper to get question by ID or index
export const getQuestion = (idOrIndex) => {
  if (typeof idOrIndex === 'number') {
    return QUESTIONS[idOrIndex];
  }
  return QUESTIONS.find(q => q.id === idOrIndex);
};

export const getTotalQuestions = () => QUESTIONS.length;

// Calculate maximum achievable score
export const getMaxScore = () => {
  return QUESTIONS.reduce((total, question) => {
    if (question.type === 'multi-select') {
      return total + (question.correctAnswers.length * 5);
    } else if (question.type === 'drag-drop-blanks') {
      return total + (question.correctAnswers.length * 5);
    } else {
      return total + 5;
    }
  }, 0);
};
