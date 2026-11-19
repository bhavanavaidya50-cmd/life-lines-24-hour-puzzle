export const SCENARIO_3 = {
  id: 3,
  title: 'THE FAMILY SECRET',
  tagline: 'Explore a fictional family situation, discover hidden information and make difficult decisions.',
  protagonist: {
    name: 'Sam Patel',
    age: 52,
    role: 'Civil Engineer & Eldest Sibling',
    bio: 'Sam returns to their childhood hometown to help 78-year-old mother, Nirmala, downsize her home of 40 years. While clearing the study, Sam discovers hidden medical scans indicating advancing neurocognitive decline, alongside a revised will that cuts off estranged sibling Leena.'
  },
  difficulty: 'Empathetic / Ethical Dilemma',
  initialResources: {
    timeMinutes: 1440,
    energy: 80,
    money: 1200,
    stress: 30,
    relationships: {
      'Mother (Nirmala)': 85,
      'Estranged Sibling (Leena)': 40,
      'Family Physician (Dr. Kroll)': 60
    }
  },
  clues: [
    {
      id: 'clue_neuro_report',
      title: 'Neurological Assessment Summary',
      type: 'document',
      source: 'Desk Drawer (08:45 AM)',
      snippet: 'Diagnostic report confirms early-to-mid stage Alzheimer\'s disease, dated four months ago.',
      fullText: 'VALLEY MEMORIAL NEUROLOGY:\nPATIENT: Nirmala Patel (Age 78)\nDIAGNOSIS: Progressive neurocognitive impairment consistent with early-stage Alzheimer\'s pathology.\nPHYSICIAN RECOMMENDATION: Immediate establishment of durable medical power of attorney and transition away from unassisted solo living.',
      isDiscovered: true
    },
    {
      id: 'clue_revised_will',
      title: 'Notarized Testament Draft',
      type: 'document',
      source: 'Locked Tin Box (10:00 AM)',
      snippet: 'Mother\'s amended will bequeaths entire estate to Sam, disinheriting Leena due to an argument last Thanksgiving.',
      fullText: 'LAST WILL & TESTAMENT (REVISED DRAFT):\n"To my son Sam Patel, I leave the family residence and all liquid securities. To my daughter Leena Patel, I leave no distribution, following her continuous absence and disregard for our traditions."',
      isDiscovered: false
    },
    {
      id: 'clue_leena_letters',
      title: 'Unopened Letters from Leena',
      type: 'message',
      source: 'Hallway Credenza (11:15 AM)',
      snippet: 'A stack of three postmarked envelopes from Leena with return addresses, all unopened by mother.',
      fullText: 'EXCERPT FROM LEENA\'S UNOPENED LETTER (JULY):\n"Mom, I\'m so sorry our talk escalated last autumn. I want nothing from your estate—I just want us to talk. Please let me visit with the grandchildren. I love you regardless."',
      isDiscovered: true
    },
    {
      id: 'clue_medication_calendar',
      title: 'Prescription Dispenser Log',
      type: 'object',
      source: 'Kitchen Counter (12:30 PM)',
      snippet: 'Multiple doses of critical blood pressure and memory medication have been skipped over the past two weeks.',
      fullText: 'MEDICATION DISPENSER:\nDays skipped: Tuesday, Thursday, and Saturday.\nIndicates mother is having substantial difficulty tracking daily medication independently.',
      isDiscovered: false
    }
  ],
  tasks: [
    {
      id: 'task_kitchen_meds',
      title: 'Inspect Kitchen Meds & Nutrition Safety',
      category: 'investigation',
      durationHours: 1,
      earliestStartHour: 8,
      deadlineHour: 11,
      dependencies: [],
      energyCost: 10,
      moneyCost: 0,
      stressCost: 10,
      description: 'Audit mother\'s pantry and medicine cabinet to evaluate daily living safety.'
    },
    {
      id: 'task_consult_dr_kroll',
      title: 'Consult Family Physician Dr. Kroll',
      category: 'medical',
      durationHours: 1,
      earliestStartHour: 10,
      deadlineHour: 13,
      dependencies: ['task_kitchen_meds'],
      energyCost: 15,
      moneyCost: 50,
      stressCost: 15,
      description: 'Discuss cognitive prognosis, care facility options, and medication assistance.'
    },
    {
      id: 'task_call_leena',
      title: 'High-Empathy Phone Call with Leena',
      category: 'family',
      durationHours: 2,
      earliestStartHour: 12,
      deadlineHour: 16,
      dependencies: [],
      energyCost: 20,
      moneyCost: 0,
      stressCost: 20,
      description: 'Break the silence with sister Leena, share the medical diagnosis gently, and mend the rift.'
    },
    {
      id: 'task_evening_talk_mom',
      title: 'Compassionate Heart-to-Heart with Mother',
      category: 'family',
      durationHours: 2,
      earliestStartHour: 16,
      deadlineHour: 19,
      dependencies: ['task_consult_dr_kroll'],
      energyCost: 25,
      moneyCost: 0,
      stressCost: 15,
      description: 'Approach mother with deep dignity about assisted care, driving cessation, and family reconciliation.'
    },
    {
      id: 'task_estate_lawyer',
      title: 'Consult Estate Planning Attorney',
      category: 'legal',
      durationHours: 1,
      earliestStartHour: 14,
      deadlineHour: 17,
      dependencies: [],
      energyCost: 10,
      moneyCost: 250,
      stressCost: 10,
      description: 'Ensure medical power of attorney is ethically drafted and equitable between siblings.'
    }
  ],
  mandatoryTasks: [
    { id: 'task_consult_dr_kroll', title: 'Consult Family Physician Dr. Kroll' },
    { id: 'task_evening_talk_mom', title: 'Compassionate Heart-to-Heart with Mother' }
  ],
  storyBeats: [
    {
      id: 'beat_hidden_diagnosis',
      title: '09:00 AM – The Unspoken Truth',
      narrative: 'Holding the diagnostic paperwork, you look across the breakfast table at Nirmala smiling as she struggles to recall the name of her lifelong neighbor. She whispers: "Sam, don\'t treat me like an invalid. I manage everything just fine."',
      options: [
        {
          text: 'Gently validate her feelings while softly asking if she\'d like you to review Dr. Kroll\'s recommendations together.',
          consequenceSummary: 'Nirmala\'s defenses soften. She weeps with relief that she no longer has to hide her fear.',
          flags: ['empathetic_approach'],
          resourceEffects: { stress: -10, relationships: { 'Mother (Nirmala)': +15 } }
        },
        {
          text: 'Confront her directly with the clinical papers and assert that she cannot continue living alone.',
          consequenceSummary: 'Nirmala feels humiliated and withdraws into defensive silence.',
          flags: ['authoritarian_approach'],
          resourceEffects: { stress: +25, relationships: { 'Mother (Nirmala)': -20 } }
        }
      ]
    },
    {
      id: 'beat_leena_reconciliation',
      title: '13:00 PM – The Sibling Divide',
      narrative: 'You dial Leena. When she hears about mother\'s Alzheimer\'s diagnosis, her voice trembles. Then she asks hesitantly: "Does mom still hate me? Did she ever read my letters?"',
      options: [
        {
          text: 'Tell Leena about the unopened letters and invite her to drive up immediately so you can face this together as equal partners.',
          consequenceSummary: 'Leena drops everything to catch the next flight. Sibling solidarity is reborn.',
          flags: ['sibling_reunion', 'reconciled_leena'],
          resourceEffects: { stress: -15, relationships: { 'Estranged Sibling (Leena)': +40 } }
        },
        {
          text: 'Keep the severity quiet to spare Leena stress, intending to manage all caregiving alone.',
          consequenceSummary: 'Leena feels shut out and excluded from her own mother\'s final cognitive years.',
          flags: ['martyr_caregiver'],
          resourceEffects: { stress: +30, energy: -20, relationships: { 'Estranged Sibling (Leena)': -15 } }
        }
      ]
    },
    {
      id: 'beat_will_resolution',
      title: '18:30 PM – The Question of Legacy',
      narrative: 'With evening setting in, the topic of the revised will arises. The lawyer can file an equitable 50/50 sibling amendment or leave Sam as sole inheritor as mother drafted in her moment of anger.',
      options: [
        {
          text: 'Affirm to Mother that you and Leena will share everything equally: "Mom, you raised us as one family."',
          consequenceSummary: 'Nirmala smiles peacefully, feeling the burden of old grievances lift away.',
          flags: ['equitable_inheritance'],
          resourceEffects: { stress: -20, relationships: { 'Mother (Nirmala)': +20, 'Estranged Sibling (Leena)': +30 } }
        },
        {
          text: 'Accept sole ownership of the house to ensure funding for mother\'s elite private memory care hospice.',
          consequenceSummary: 'Financial resources are concentrated for care, but family friction lingers.',
          flags: ['care_priority_inheritance'],
          resourceEffects: { money: +500, stress: +10, relationships: { 'Estranged Sibling (Leena)': -10 } }
        }
      ]
    }
  ],
  endings: [
    {
      id: 'ending_graceful_unity',
      title: 'THE CIRCLE RESTORED',
      quality: 'Profoundly Moving Ending',
      baseScore: 200,
      requiredFlags: ['empathetic_approach', 'reconciled_leena', 'equitable_inheritance'],
      text: 'Through patience, grace, and moral courage, Sam transformed what could have been a bitter family tragedy into a season of deep healing. Leena and Sam stand hand-in-hand supporting Nirmala with dignity, love, and transparent care. The house will be sold, memories cherished, and the family bond remains unbroken.'
    },
    {
      id: 'ending_isolated_caretaker',
      title: 'THE LONELY VIGIL',
      quality: 'Sobering Ending',
      baseScore: 140,
      requiredFlags: ['martyr_caregiver'],
      text: 'Sam took on the entirety of mother\'s care alone. While Nirmala received adequate medical supervision, Sam collapsed under the emotional and financial weight, estranged from Leena and exhausted by unresolved family silence.'
    },
    {
      id: 'ending_practical_resolution',
      title: 'PRAGMATIC COMPROMISE',
      quality: 'Realistic Ending',
      baseScore: 160,
      text: 'A safe, sensible care plan was established. While old family wounds did not completely vanish overnight, honest communication brought stability and ensured Nirmala will never face her medical journey in isolation.'
    }
  ]
};
