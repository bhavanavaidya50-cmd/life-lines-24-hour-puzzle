export const SCENARIO_1 = {
  id: 1,
  title: 'THE UNEXPECTED MONDAY',
  tagline: 'Balance professional responsibilities, family commitments and an unexpected emergency.',
  protagonist: {
    name: 'Alex Chen',
    age: 38,
    role: 'Senior Operations Director & Single Parent',
    bio: 'Alex is coordinating a high-stakes quarterly enterprise audit. At 7:00 AM, their 8-year-old child wakes with a severe fever, right before critical client presentations and an urgent family medical update.'
  },
  difficulty: 'Introductory / Adaptive',
  initialResources: {
    timeMinutes: 1440,
    energy: 90,
    money: 850,
    stress: 25,
    relationships: {
      'Board & Clients': 70,
      'Family & Kids': 85,
      'Core Team': 75
    }
  },
  clues: [
    {
      id: 'clue_email_audit',
      title: 'Executive Audit Notice',
      type: 'document',
      source: 'Board of Directors (6:45 AM)',
      snippet: 'The board requires the Q3 operational audit and risk assessment submitted strictly by 16:00 PM today.',
      fullText: 'FROM: Board of Directors\nDATE: 06:45 AM\nSUBJECT: MANDATORY COMPLIANCE AUDIT\n\nAlex, the external regulators moved our deadline forward. The compliance presentation must be completed and delivered no later than 16:00 PM. Failure to present will incur hefty institutional sanctions. Your team is counting on your lead.',
      revealsTask: null,
      isDiscovered: true
    },
    {
      id: 'clue_temp_reading',
      title: 'Pediatric Thermometer Log',
      type: 'object',
      source: 'Child\'s Bedroom (7:10 AM)',
      snippet: 'Child\'s temperature reads 103.2°F (39.5°C). Urgent prescription medication needed before afternoon.',
      fullText: 'THERMOMETER READING: 103.2°F.\nPediatrician Dr. Vance sent an urgent prescription to Maple Pharmacy. It must be collected and administered before noon to prevent escalation.',
      revealsTask: 'task_pharmacy',
      isDiscovered: true
    },
    {
      id: 'clue_hospital_voicemail',
      title: 'St. Jude Hospital Voicemail',
      type: 'message',
      source: 'Emergency Dept (10:15 AM)',
      snippet: 'Voicemail from Dr. Gomez: Alex\'s elderly father suffered a sudden dizzy spell and has been admitted for observation.',
      fullText: 'VOICEMAIL TRANSCRIPT (10:15 AM):\n"Alex, this is Dr. Gomez from St. Jude Emergency. Your father Arthur was brought in after collapsing at the community center. He is conscious and stable now, but we need next of kin authorization for neurological scans between 13:00 and 15:00."',
      revealsTask: 'task_hospital',
      isDiscovered: false
    },
    {
      id: 'clue_colleague_chat',
      title: 'Slack Message from Marcus',
      type: 'message',
      source: 'Marcus Vance - Lead Analyst (8:30 AM)',
      snippet: 'Marcus offers to co-host the client audit if provided with the briefing deck beforehand.',
      fullText: 'SLACK DIRECT MESSAGE - Marcus (08:30 AM):\n"Hey Alex, heard about your kid. Don\'t panic. If you delegate the vendor slides to me by 11:00 AM, I can field the regulatory auditors at 14:00. Just let me know if you need backup."',
      revealsTask: null,
      isDiscovered: true
    }
  ],
  tasks: [
    {
      id: 'task_doctor',
      title: 'Pediatric Doctor Telehealth Visit',
      category: 'family',
      durationHours: 1,
      earliestStartHour: 8,
      deadlineHour: 10,
      dependencies: [],
      energyCost: 10,
      moneyCost: 75,
      stressCost: 5,
      description: 'Consult Dr. Vance to confirm safety instructions and approve pharmacy prescription.'
    },
    {
      id: 'task_pharmacy',
      title: 'Emergency Pharmacy Pickup',
      category: 'family',
      durationHours: 1,
      earliestStartHour: 9,
      deadlineHour: 13,
      dependencies: ['task_doctor'],
      energyCost: 15,
      moneyCost: 45,
      stressCost: 10,
      description: 'Drive to Maple Pharmacy, obtain fever-reducing antibiotics, and administer first dose.'
    },
    {
      id: 'task_prep_deck',
      title: 'Compile Regulatory Audit Deck',
      category: 'work',
      durationHours: 2,
      earliestStartHour: 9,
      deadlineHour: 14,
      dependencies: [],
      energyCost: 25,
      moneyCost: 0,
      stressCost: 15,
      description: 'Synthesize department metrics and verify compliance footnotes for the executive board.'
    },
    {
      id: 'task_delegate_brief',
      title: 'Brief Marcus & Handover Slides',
      category: 'work',
      durationHours: 1,
      earliestStartHour: 10,
      deadlineHour: 13,
      dependencies: ['task_prep_deck'],
      energyCost: 10,
      moneyCost: 0,
      stressCost: -5,
      description: 'Transfer presentation authority to Marcus so Alex can attend to medical issues.'
    },
    {
      id: 'task_hospital',
      title: 'Hospital Visit & Scan Consent',
      category: 'family',
      durationHours: 2,
      earliestStartHour: 12,
      deadlineHour: 16,
      dependencies: [],
      energyCost: 20,
      moneyCost: 120,
      stressCost: 20,
      description: 'Visit St. Jude Hospital, consult Dr. Gomez, and sign father\'s procedural consent forms.'
    },
    {
      id: 'task_board_presentation',
      title: 'Lead Board Audit Meeting',
      category: 'work',
      durationHours: 2,
      earliestStartHour: 14,
      deadlineHour: 16,
      dependencies: ['task_prep_deck'],
      energyCost: 35,
      moneyCost: 0,
      stressCost: 30,
      description: 'Present directly to the executive auditors in person or high-stakes video call.'
    },
    {
      id: 'task_evening_debrief',
      title: 'Family Dinner & Child Recovery Care',
      category: 'personal',
      durationHours: 2,
      earliestStartHour: 18,
      deadlineHour: 22,
      dependencies: ['task_pharmacy'],
      energyCost: 10,
      moneyCost: 30,
      stressCost: -20,
      description: 'Nourish child, check temperature stability, and debrief family on father\'s health.'
    }
  ],
  mandatoryTasks: [
    { id: 'task_doctor', title: 'Pediatric Doctor Telehealth Visit' },
    { id: 'task_pharmacy', title: 'Emergency Pharmacy Pickup' },
    { id: 'task_prep_deck', title: 'Compile Regulatory Audit Deck' }
  ],
  storyBeats: [
    {
      id: 'beat_morning_call',
      title: '07:30 AM – The First Fracture',
      narrative: 'Your child is shivering under heavy blankets with a burning forehead. At the same moment, your company phone buzzes with an urgent notification from CEO Evelyn Vance: "Alex, the auditor panel moved the session up. We need your presence guaranteed."',
      options: [
        {
          text: 'Be fully transparent: Inform Evelyn of your child\'s illness and propose remote co-hosting.',
          consequenceSummary: 'Evelyn appreciates your direct honesty, though cautions that deliverables cannot slip.',
          flags: ['honest_with_evelyn', 'remote_work'],
          resourceEffects: { stress: -5, relationships: { 'Board & Clients': -5, 'Core Team': +10 } }
        },
        {
          text: 'Mask the situation: Promise full in-person presence and rush to complete everything yourself.',
          consequenceSummary: 'You preserve corporate bravado at an extreme cost to your mental endurance.',
          flags: ['masked_crisis', 'solo_hero'],
          resourceEffects: { stress: +20, energy: -15, relationships: { 'Board & Clients': +5 } }
        },
        {
          text: 'Activate Team Delegation: Call Lead Analyst Marcus immediately to take primary client contact.',
          consequenceSummary: 'Marcus rallies the department. Your team feels empowered and trusted.',
          flags: ['empowered_marcus'],
          resourceEffects: { stress: -10, relationships: { 'Core Team': +20, 'Family & Kids': +5 } }
        }
      ]
    },
    {
      id: 'beat_hospital_call',
      title: '11:15 AM – The Hospital Notification',
      narrative: 'While running through your noon tasks, Dr. Gomez from St. Jude Emergency calls. Your father has had a vasovagal syncope episode. He is coherent, but the hospital requires family authorization before proceeding with precautionary scans.',
      options: [
        {
          text: 'Entrust scan authorization digitally via hospital portal, remaining focused on home and work.',
          consequenceSummary: 'Scans proceed smoothly, though your father feels a twinge of loneliness.',
          flags: ['digital_consent'],
          resourceEffects: { stress: +10, relationships: { 'Family & Kids': -10 } }
        },
        {
          text: 'Hand over final presentation to Marcus and drive immediately to St. Jude to be by his side.',
          consequenceSummary: 'Your physical presence comforts your father immensely. Marcus steps up brilliantly.',
          flags: ['in_person_family_care', 'marcus_took_lead'],
          resourceEffects: { energy: -15, stress: -15, relationships: { 'Family & Kids': +25, 'Core Team': +10 } }
        },
        {
          text: 'Hire an emergency on-demand concierge nurse ($220) to stay with father while you finish the audit.',
          consequenceSummary: 'Professional medical escort arrives at father\'s bedside with zero delay.',
          flags: ['hired_nurse_support'],
          resourceEffects: { money: -220, stress: -5, relationships: { 'Family & Kids': +10 } }
        }
      ]
    },
    {
      id: 'beat_final_stand',
      title: '15:30 PM – The Climax of Monday',
      narrative: 'The audit session concludes and the hospital scan results return clear: your father is safe to discharge tomorrow. Your child\'s temperature has dropped to normal after the pharmacy antibiotics.',
      options: [
        {
          text: 'Send a heartfelt recognition note to the entire team and shut down work to cook a quiet family meal.',
          consequenceSummary: 'You embrace the restorative power of boundaries and mutual gratitude.',
          flags: ['healthy_boundaries'],
          resourceEffects: { energy: +20, stress: -25, relationships: { 'Core Team': +15, 'Family & Kids': +20 } }
        },
        {
          text: 'Work through the night answering remaining emails to demonstrate unmatched stamina.',
          consequenceSummary: 'You burn out completely, ending the day exhausted and alienated from family.',
          flags: ['workaholic_spiral'],
          resourceEffects: { energy: -30, stress: +35, relationships: { 'Family & Kids': -25 } }
        }
      ]
    }
  ],
  endings: [
    {
      id: 'ending_triumph_balance',
      title: 'THE HARMONIOUS HORIZON',
      quality: 'Optimal Master Ending',
      baseScore: 200,
      requiredFlags: ['healthy_boundaries'],
      minResources: { energy: 30, stress: 0 },
      maxResources: { stress: 65 },
      text: 'Alex proved that leadership is not about solitary heroism, but about discernment, trust, and loving boundaries. The corporate audit was praised for rigorous team redundancy, your father received compassionate medical oversight, and your child rests peacefully in recovery. Monday was relentless, but your life lines held firm.'
    },
    {
      id: 'ending_career_sacrifice',
      title: 'THE CORPORATE SOLITUDE',
      quality: 'Compromised Ending',
      baseScore: 120,
      requiredFlags: ['workaholic_spiral'],
      text: 'The audit passed with flying colors and the executive board sent a congratulatory plaque. Yet in the quiet of midnight, Alex sits in a silent home surrounded by cold takeout and unread text messages from loved ones. The cost of professional perfection was paid in personal currency.'
    },
    {
      id: 'ending_resilient_recovery',
      title: 'THE WEATHERED ANCHOR',
      quality: 'Resilient Ending',
      baseScore: 160,
      text: 'The day tested every ounce of Alex\'s resolve. While not every detail ran with clockwork precision, the essential pillars survived intact: child medicated, father safely admitted, and team morale fortified through shared crisis management. Tomorrow will bring its own challenges, but you navigated the storm.'
    }
  ]
};
