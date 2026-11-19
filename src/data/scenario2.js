export const SCENARIO_2 = {
  id: 2,
  title: 'THE MISSING TRANSACTION',
  tagline: 'Investigate a financial mystery by connecting transaction records, messages and clues.',
  protagonist: {
    name: 'Maya Rodriguez',
    age: 45,
    role: 'Boutique Architecture Firm Founder & Lead Partner',
    bio: 'During routine quarterly reconciliation, Maya uncovers an unauthorized $12,500 wire transfer leaving the firm\'s escrow account. The banking window closes at 15:00 PM today. Maya must discover whether it is embezzlement, a cyber breach, or a misclassified vendor escrow before triggering irreversible legal fallout.'
  },
  difficulty: 'Analytical / Investigative Mystery',
  initialResources: {
    timeMinutes: 1440,
    energy: 85,
    money: 3200,
    stress: 35,
    relationships: {
      'Business Partner (David)': 65,
      'Office Manager (Sofia)': 80,
      'Bank & Legal Counsel': 50
    }
  },
  clues: [
    {
      id: 'clue_wire_notice',
      title: 'First National Bank Wire Slip',
      type: 'document',
      source: 'Banking Portal (08:15 AM)',
      snippet: 'Wire #WT-9921 for $12,500 routed to "Apex Material Holdings" at 02:45 AM Sunday morning.',
      fullText: 'FIRST NATIONAL WIRE ADVICE:\nAMOUNT: $12,500.00 USD\nBENEFICIARY: Apex Material Holdings LLC\nORIGINATOR ACCOUNT: Rodriguez & Vance Escrow #4412\nIP ADDRESS: Logged from local VPN subnet\nSTATUS: Pending Final Clearing at 15:00 PM today.',
      isDiscovered: true
    },
    {
      id: 'clue_vendor_invoice',
      title: 'Apex Material Supplier Contract',
      type: 'document',
      source: 'Filing Cabinet B (09:30 AM)',
      snippet: 'Supplier contract shows Apex is legitimate, but usual quarterly balance is $2,500—not $12,500.',
      fullText: 'PURCHASING AGREEMENT - APEX MATERIALS:\nAuthorized quarterly retainer: $2,500.\nSpecial clause: In the event of emergency structural steel tariffs, balance requires dual partner signature (Maya Rodriguez AND David Vance).',
      isDiscovered: false
    },
    {
      id: 'clue_david_text',
      title: 'WhatsApp Message from Partner David',
      type: 'message',
      source: 'David Vance - Co-Founder (10:00 AM)',
      snippet: 'David claims he was off-grid over the weekend at a regional design retreat, yet his digital keycard swiped at the office.',
      fullText: 'DAVID: "Hey Maya! Reception is awful out here in the Catskills retreat. Won\'t be back in the office until Wednesday. Everything smooth with the Q3 close?"\n\nNOTE: Office security logs show David\'s access badge logged into the server room at 11:15 PM Saturday night.',
      isDiscovered: true
    },
    {
      id: 'clue_sofia_ledger',
      title: 'Sofia\'s Audit Reconciliation Notes',
      type: 'document',
      source: 'Office Manager Desk (11:20 AM)',
      snippet: 'Sofia left a sticky note: "David asked for Apex account routing numbers Friday afternoon for an expedited client order."',
      fullText: 'HANDWRITTEN NOTE BY SOFIA:\n"10/14 - David called asking for Apex wiring details. Stated client project \'The Meridian Pavilion\' had urgent foundation deadline. Told him to run by Maya for dual authorization. Did he get your signature?"',
      isDiscovered: false
    },
    {
      id: 'clue_email_phish',
      title: 'Spoofed Domain Security Alert',
      type: 'document',
      source: 'IT Security Incident Log (12:45 PM)',
      snippet: 'IT caught a spear-phishing email targeting David with spoofed address: apex-materia1s.com (number 1 instead of l).',
      fullText: 'IT SECURITY BULLETIN:\nIncident #SEC-401\nAttacker impersonated Apex Materials billing department demanding urgent payment to an overseas mule account. David appears to have clicked the malicious link on his laptop.',
      isDiscovered: false
    }
  ],
  tasks: [
    {
      id: 'task_audit_server',
      title: 'Inspect Office Server Logs & Badges',
      category: 'investigation',
      durationHours: 1,
      earliestStartHour: 8,
      deadlineHour: 11,
      dependencies: [],
      energyCost: 15,
      moneyCost: 0,
      stressCost: 10,
      description: 'Cross-reference server room entry records against weekend wire transfer timestamps.'
    },
    {
      id: 'task_interview_sofia',
      title: 'Confidential Interview with Sofia',
      category: 'investigation',
      durationHours: 1,
      earliestStartHour: 9,
      deadlineHour: 12,
      dependencies: [],
      energyCost: 10,
      moneyCost: 0,
      stressCost: 5,
      description: 'Gently question Sofia regarding recent vendor requests and accounting discrepancies.'
    },
    {
      id: 'task_it_forensics',
      title: 'Run Digital IT Forensics on David\'s Rig',
      category: 'investigation',
      durationHours: 2,
      earliestStartHour: 11,
      deadlineHour: 14,
      dependencies: ['task_audit_server'],
      energyCost: 20,
      moneyCost: 150,
      stressCost: 15,
      description: 'Trace suspicious email headers and outbound connections on partner workstation.'
    },
    {
      id: 'task_bank_freeze',
      title: 'Emergency In-Person Bank Freeze Meeting',
      category: 'finance',
      durationHours: 2,
      earliestStartHour: 13,
      deadlineHour: 15,
      dependencies: [],
      energyCost: 25,
      moneyCost: 0,
      stressCost: 20,
      description: 'Meet Commercial Branch Manager Mr. Henderson before 15:00 PM cutoff to freeze or claw back the wire.'
    },
    {
      id: 'task_confront_david',
      title: 'Direct Video Conference with David',
      category: 'management',
      durationHours: 1,
      earliestStartHour: 14,
      deadlineHour: 17,
      dependencies: [],
      energyCost: 15,
      moneyCost: 0,
      stressCost: 15,
      description: 'Present factual evidence to partner David and decide company strategy together.'
    }
  ],
  mandatoryTasks: [
    { id: 'task_audit_server', title: 'Inspect Office Server Logs & Badges' },
    { id: 'task_bank_freeze', title: 'Emergency In-Person Bank Freeze Meeting' }
  ],
  storyBeats: [
    {
      id: 'beat_wire_discovery',
      title: '08:30 AM – The Discrepancy',
      narrative: 'The escrow dashboard flashes red: $12,500 has departed under David\'s signature. Firing off accusations to law enforcement now could ruin David\'s reputation if innocent, yet delaying past 15:00 PM makes the funds irrecoverable.',
      options: [
        {
          text: 'Initiate quiet forensic inquiry: Keep news contained internally while collecting forensic facts.',
          consequenceSummary: 'Panic is avoided. Sofia and the IT team work methodically without fear.',
          flags: ['calm_investigation'],
          resourceEffects: { stress: -5, relationships: { 'Business Partner (David)': +5, 'Office Manager (Sofia)': +10 } }
        },
        {
          text: 'Call David aggressively: Demand an immediate explanation and threaten legal police involvement.',
          consequenceSummary: 'David turns defensive and ceases communications through attorney advice.',
          flags: ['antagonistic_partner'],
          resourceEffects: { stress: +25, relationships: { 'Business Partner (David)': -30 } }
        },
        {
          text: 'Immediate Bank Fraud Alert: Call the bank hotline instantly to freeze all company accounts.',
          consequenceSummary: 'Funds are safeguarded, but ongoing payroll and card operations freeze for 48 hours.',
          flags: ['blunt_freeze'],
          resourceEffects: { money: -500, stress: +15, relationships: { 'Bank & Legal Counsel': +15 } }
        }
      ]
    },
    {
      id: 'beat_phishing_revelation',
      title: '12:15 PM – The Deception Revealed',
      narrative: 'Forensics confirm David was victim of an elaborate spear-phishing heist. Believing he was expediting steel for a vital project, he input dual authentication into a mock portal created by cybercriminals.',
      options: [
        {
          text: 'Provide bank branch manager with cyber-fraud incident report before 15:00 PM to initiate SWIFT recall.',
          consequenceSummary: 'The bank acknowledges criminal interception and initiates Federal clawback protocols.',
          flags: ['swift_clawback_success'],
          resourceEffects: { stress: -15, relationships: { 'Bank & Legal Counsel': +20, 'Business Partner (David)': +15 } }
        },
        {
          text: 'Blame David publicly to the staff and force him to personally cover the loss from his equity.',
          consequenceSummary: 'The partnership relationship permanently fractures despite recovering funds.',
          flags: ['partnership_split'],
          resourceEffects: { stress: +20, relationships: { 'Business Partner (David)': -40 } }
        }
      ]
    },
    {
      id: 'beat_firm_future',
      title: '16:00 PM – Restoring Stability',
      narrative: 'The wire has been intercepted by federal banking authorities. Maya and David sit down to establish future firm governance and cybersecurity protocols.',
      options: [
        {
          text: 'Implement institutional multi-sig authentication and mandatory cybersecurity training for all partners.',
          consequenceSummary: 'The firm emerges stronger, modernized, and insulated from future vulnerabilities.',
          flags: ['institutional_maturation'],
          resourceEffects: { energy: +10, stress: -20, money: -300, relationships: { 'Core Team': +20, 'Business Partner (David)': +20 } }
        },
        {
          text: 'Sweep the matter under the rug to avoid reputational embarrassment.',
          consequenceSummary: 'Underlying vulnerabilities remain, leaving the firm exposed to recurring risks.',
          flags: ['swept_under_rug'],
          resourceEffects: { stress: +15, relationships: { 'Bank & Legal Counsel': -15 } }
        }
      ]
    }
  ],
  endings: [
    {
      id: 'ending_forensic_triumph',
      title: 'THE SHIELD OF CLARITY',
      quality: 'Master Detective Ending',
      baseScore: 200,
      requiredFlags: ['swift_clawback_success', 'institutional_maturation'],
      text: 'Maya\'s methodical forensic discipline saved the firm from catastrophic financial theft without sacrificing professional humanity. The full $12,500 was recovered by federal wire recall, the cyber ring was flagged, and the partnership with David emerged bonded by shared humility and reinforced operational protocols.'
    },
    {
      id: 'ending_broken_partnership',
      title: 'FRACTURED FOUNDATIONS',
      quality: 'Bittersweet Ending',
      baseScore: 140,
      requiredFlags: ['partnership_split'],
      text: 'The money was clawed back, but the 15-year architectural partnership dissolved in rancor and resentment. David resigned his partnership by month\'s end. Trust, once broken by hasty suspicion, could not be reassembled.'
    },
    {
      id: 'ending_close_call',
      title: 'THE EMBATTLED ALLIANCE',
      quality: 'Satisfactory Ending',
      baseScore: 160,
      text: 'The firm survived the 24-hour financial crisis by the narrowest of margins. Maya learned invaluable lessons in rapid forensic investigation and corporate crisis management, preserving both capital and core client confidence.'
    }
  ]
};
