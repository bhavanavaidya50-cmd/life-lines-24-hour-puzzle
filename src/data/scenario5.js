export const SCENARIO_5 = {
  id: 5,
  title: 'THE FINAL DECISION',
  tagline: 'A challenging scenario combining time management, investigation, resources and consequences.',
  protagonist: {
    name: 'Robin Okafor',
    age: 55,
    role: 'City Council Ombudsman & Civic Mediator',
    bio: 'On the eve of the municipal election, an explosive investigative leak threatens to shutter the historic Eastside Community Health Clinic to make way for a luxury high-rise development. Robin has exactly 24 hours to arbitrate between furious neighborhood advocates, municipal politicians, and corporate developers.'
  },
  difficulty: 'Master Level / Comprehensive Synthesis',
  initialResources: {
    timeMinutes: 1440,
    energy: 90,
    money: 1500,
    stress: 45,
    relationships: {
      'Community Coalition': 75,
      'City Council & Mayor': 50,
      'Development Consortium': 40
    }
  },
  clues: [
    {
      id: 'clue_zoning_amendment',
      title: 'Confidential City Hall Rezoning Memo',
      type: 'document',
      source: 'Whistleblower Drop (07:30 AM)',
      snippet: 'Internal memo reveals city planners accepted understated environmental impact studies for the luxury high-rise project.',
      fullText: 'CITY PLANNING COMMISSION CONFIDENTIAL MEMO:\n"Rezoning parcel 14-B from Public Healthcare to Commercial High-Density was accelerated without public comment periods. Soil hydrology reports showing flood susceptibility were omitted from public docket."',
      isDiscovered: true
    },
    {
      id: 'clue_clinic_records',
      title: 'Eastside Clinic Community Care Metrics',
      type: 'document',
      source: 'Clinic Director Dr. Lisa Vance (09:00 AM)',
      snippet: 'Clinic provides primary medical and pediatric care to over 14,000 uninsured neighborhood residents annually.',
      fullText: 'EASTSIDE CLINIC ANNUAL CARE REPORT:\nAnnual patient visits: 14,280.\nFree preventive pediatric vaccinations: 3,400.\nClosest alternative public clinic: 8.5 miles away across the river canal.',
      isDiscovered: true
    },
    {
      id: 'clue_compromise_blueprint',
      title: 'Integrated Civic Architecture Proposal',
      type: 'document',
      source: 'Independent Urban Planning Think Tank (11:15 AM)',
      snippet: 'Design proposal showing the high-rise can include a state-of-the-art 3-story civic clinic at ground level, satisfying both sides.',
      fullText: 'URBAN INTEGRATION BLUEPRINT:\n"Proposal for Shared Civic Density: The developer builds 18 floors of residential units while dedicating floors 1-3 to an expanded, permanently endowed Eastside Medical Center, subsidized by municipal tax-increment financing."',
      isDiscovered: false
    }
  ],
  tasks: [
    {
      id: 'task_investigate_memo',
      title: 'Investigate Omitted Hydrology & Soil Reports',
      category: 'investigation',
      durationHours: 2,
      earliestStartHour: 8,
      deadlineHour: 12,
      dependencies: [],
      energyCost: 20,
      moneyCost: 0,
      stressCost: 15,
      description: 'Review city environmental records to establish undeniable legal leverage against backroom zoning.'
    },
    {
      id: 'task_community_townhall',
      title: 'Moderate Heated Community Townhall',
      category: 'mediation',
      durationHours: 2,
      earliestStartHour: 11,
      deadlineHour: 15,
      dependencies: [],
      energyCost: 30,
      moneyCost: 50,
      stressCost: 20,
      description: 'Listen to neighborhood elders, validate healthcare concerns, and prevent civil unrest.'
    },
    {
      id: 'task_closed_door_summit',
      title: 'Convene Closed-Door Mayoral & Developer Summit',
      category: 'negotiation',
      durationHours: 3,
      earliestStartHour: 14,
      deadlineHour: 18,
      dependencies: ['task_investigate_memo', 'task_community_townhall'],
      energyCost: 35,
      moneyCost: 0,
      stressCost: 25,
      description: 'Present the integrated civic clinic blueprint to the Mayor and Lead Developer at City Hall.'
    },
    {
      id: 'task_public_press_conference',
      title: 'Deliver Live Broadcast Press Address',
      category: 'public',
      durationHours: 2,
      earliestStartHour: 18,
      deadlineHour: 22,
      dependencies: ['task_closed_door_summit'],
      energyCost: 20,
      moneyCost: 0,
      stressCost: 15,
      description: 'Announce the historic resolution to the city on live evening broadcast.'
    }
  ],
  mandatoryTasks: [
    { id: 'task_investigate_memo', title: 'Investigate Omitted Hydrology & Soil Reports' },
    { id: 'task_closed_door_summit', title: 'Convene Closed-Door Mayoral & Developer Summit' },
    { id: 'task_public_press_conference', title: 'Deliver Live Broadcast Press Address' }
  ],
  storyBeats: [
    {
      id: 'beat_civic_confrontation',
      title: '10:00 AM – The Boiling Point',
      narrative: 'Protesters surround City Hall steps with megaphones. Inside, the Mayor warns you: "Robin, developer campaign money is backing our entire municipal slate. Either calm the crowd down, or police will disperse them."',
      options: [
        {
          text: 'Walk outside directly into the crowd without police escorts, listening to neighborhood leaders with authentic respect.',
          consequenceSummary: 'Tensions de-escalate peacefully. The community embraces you as an honorable advocate.',
          flags: ['peaceful_deescalation', 'moral_courage'],
          resourceEffects: { stress: -15, energy: -10, relationships: { 'Community Coalition': +35, 'City Council & Mayor': -5 } }
        },
        {
          text: 'Stay safely inside City Hall and issue a stern bureaucratic statement ordering dispersal.',
          consequenceSummary: 'Scuffles break out on the steps. Media coverage turns sharply negative.',
          flags: ['heavy_handed_dispersal'],
          resourceEffects: { stress: +30, relationships: { 'Community Coalition': -40, 'City Council & Mayor': +10 } }
        }
      ]
    },
    {
      id: 'beat_the_grand_bargain',
      title: '16:00 PM – The Mayor\'s Office Summit',
      narrative: 'Behind heavy mahogany doors, Lead Developer Marcus Stone and the Mayor sit opposite you. You hold the environmental discrepancy documents in your briefcase, and the integrated blueprint in your hand.',
      options: [
        {
          text: 'Unveil the Integrated Blueprint: Show how the developer gains 18 stories while funding a brand new 3-story civic clinic.',
          consequenceSummary: 'Marcus Stone is won over by the positive PR; the Mayor celebrates a political triumph.',
          flags: ['historic_grand_compromise'],
          resourceEffects: { energy: +10, stress: -20, relationships: { 'Development Consortium': +25, 'Community Coalition': +30, 'City Council & Mayor': +30 } }
        },
        {
          text: 'Threaten immediate criminal whistleblowing unless the development is killed permanently.',
          consequenceSummary: 'The high-rise is cancelled, but bitter lawsuits lock the vacant lot in probate for a decade.',
          flags: ['total_scorched_earth'],
          resourceEffects: { stress: +25, relationships: { 'Development Consortium': -50, 'City Council & Mayor': -30, 'Community Coalition': +20 } }
        }
      ]
    }
  ],
  endings: [
    {
      id: 'ending_civic_renaissance',
      title: 'THE COMMONWEALTH COVENANT',
      quality: 'Legendary Civic Master Ending',
      baseScore: 200,
      requiredFlags: ['peaceful_deescalation', 'historic_grand_compromise'],
      text: 'Robin Okafor achieved what cynics claimed was impossible: uniting grass-roots community activists, municipal leadership, and private capital behind a shared vision for civic dignity. The Eastside Clinic was reborn in a modern, permanently endowed medical pavilion, preserving healthcare for 14,000 citizens while honoring the city\'s economic dynamism. A masterclass in moral stewardship.'
    },
    {
      id: 'ending_scorched_earth',
      title: 'THE EMBATTLED MONUMENT',
      quality: 'Stalemate Ending',
      baseScore: 140,
      requiredFlags: ['total_scorched_earth'],
      text: 'Robin blocked the luxury tower, but at the price of endless municipal litigation. The vacant lot stood behind chain-link fences for years, and the old clinic struggled under dwindling city subsidies. A victory of principle, shadowed by harsh reality.'
    },
    {
      id: 'ending_quiet_compromise',
      title: 'THE PRAGMATIC SETTLEMENT',
      quality: 'Balanced Ending',
      baseScore: 165,
      text: 'A mediated agreement established temporary clinic relocation and future zoning reviews. While not everyone left the negotiating table triumphant, violence was averted and the democratic process proved resilient.'
    }
  ]
};
