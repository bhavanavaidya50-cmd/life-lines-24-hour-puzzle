export const SCENARIO_4 = {
  id: 4,
  title: 'THE BUSINESS CRISIS',
  tagline: 'Handle a business problem involving limited funds, employees, deadlines and competing priorities.',
  protagonist: {
    name: 'Jordan Kim',
    age: 41,
    role: 'CEO & Founder of Aether Health Systems',
    bio: 'Aether\'s clean-water biomedical monitoring system launches commercially in 24 hours. At 07:00 AM, lead seed investor Sterling Capital threatens to withhold the final $150,000 disbursement unless Jordan lays off two senior engineers, while lead firmware architect Tariq discovers a sensor calibration glitch.'
  },
  difficulty: 'High-Stakes Strategic Simulation',
  initialResources: {
    timeMinutes: 1440,
    energy: 85,
    money: 8500,
    stress: 40,
    relationships: {
      'Engineering Team': 80,
      'Lead Investor (Sterling)': 45,
      'Hospital Pilot Clients': 65
    }
  },
  clues: [
    {
      id: 'clue_term_sheet',
      title: 'Sterling Capital Restructuring Addendum',
      type: 'document',
      source: 'Encrypted DocuSign (06:50 AM)',
      snippet: 'Sterling Capital demands reduction of burn rate by $18,000/mo through staffing cuts before releasing Series A bridge.',
      fullText: 'STERLING CAPITAL DEMAND NOTICE:\n"Release of the final $150,000 tranches is contingent on executing headcount reduction plan Exhibit B (termination of two senior engineering roles) prior to 17:00 PM today. Non-compliance results in immediate funding termination."',
      isDiscovered: true
    },
    {
      id: 'clue_calibration_log',
      title: 'Tariq\'s Firmware Diagnostic Report',
      type: 'document',
      source: 'Slack #engineering-war-room (08:15 AM)',
      snippet: 'Water sensor units show 4.2% error variance under high-pressure pipe flow. Patch requires 4 hours of focused coding.',
      fullText: 'FIRMWARE DIAGNOSTIC LOG:\nLead Architect Tariq:\n"Jordan, the telemetry stream drifts beyond medical compliance under 60 PSI pipe pressure. If we ship firmware v1.0 as-is to St. Jude and Mercy Hospital, we risk false contamination alarms. I need an unbothered 4-hour window to flash patch v1.04."',
      isDiscovered: true
    },
    {
      id: 'clue_bridge_loan_offer',
      title: 'Alternative Civic Impact Grant Term',
      type: 'document',
      source: 'State Innovation Development Fund (10:30 AM)',
      snippet: 'State GreenTech Fund offers non-dilutive $100,000 emergency grant if Aether commits to public utility transparency.',
      fullText: 'STATE INNOVATION GRANT PROPOSAL:\nGrant #GT-882\nAward: $100,000 non-dilutive grant payable in 48 hours.\nConditions: Maintain all technical personnel within the state and open-source public health water telemetry protocols.',
      isDiscovered: false
    }
  ],
  tasks: [
    {
      id: 'task_firmware_patch',
      title: 'Supervise & Assist Firmware Calibration Patch',
      category: 'technical',
      durationHours: 3,
      earliestStartHour: 8,
      deadlineHour: 13,
      dependencies: [],
      energyCost: 25,
      moneyCost: 0,
      stressCost: 15,
      description: 'Work alongside Tariq in the lab to validate pressure chamber sensors and pass safety compliance.'
    },
    {
      id: 'task_all_hands_meeting',
      title: 'Transparent Company All-Hands Meeting',
      category: 'leadership',
      durationHours: 1,
      earliestStartHour: 11,
      deadlineHour: 14,
      dependencies: [],
      energyCost: 15,
      moneyCost: 0,
      stressCost: 10,
      description: 'Address the team honestly regarding financial runway, investor tension, and technical pride.'
    },
    {
      id: 'task_investor_negotiation',
      title: 'Climactic Sterling Capital Showdown Meeting',
      category: 'executive',
      durationHours: 2,
      earliestStartHour: 14,
      deadlineHour: 17,
      dependencies: ['task_all_hands_meeting'],
      energyCost: 30,
      moneyCost: 0,
      stressCost: 25,
      description: 'Defend your engineering talent, counter Sterling\'s layoff ultimatum, or pivot funding sources.'
    },
    {
      id: 'task_hospital_demo',
      title: 'Deliver Live Pilot Demo to Hospital Directors',
      category: 'client',
      durationHours: 2,
      earliestStartHour: 17,
      deadlineHour: 20,
      dependencies: ['task_firmware_patch'],
      energyCost: 20,
      moneyCost: 0,
      stressCost: 15,
      description: 'Present the calibrated telemetry dashboard directly to hospital medical facility heads.'
    }
  ],
  mandatoryTasks: [
    { id: 'task_firmware_patch', title: 'Supervise & Assist Firmware Calibration Patch' },
    { id: 'task_investor_negotiation', title: 'Climactic Sterling Capital Showdown Meeting' },
    { id: 'task_hospital_demo', title: 'Deliver Live Pilot Demo to Hospital Directors' }
  ],
  storyBeats: [
    {
      id: 'beat_the_ultimatum',
      title: '09:00 AM – The Investor\'s Knife',
      narrative: 'Richard Sterling joins the Zoom call bluntly: "Jordan, startups aren\'t charities. Fire Tariq\'s junior devs, cut payroll by $18k today, or we terminate your credit line by 17:00 PM. Sign the addendum or drown."',
      options: [
        {
          text: 'Refuse layoffs firmly: Pitch that engineering cohesion is your unique competitive moat, and reveal the state grant backup.',
          consequenceSummary: 'Sterling is shaken by your leverage, recognizing you won\'t be bullied.',
          flags: ['stood_ground_sterling', 'pivoted_funding'],
          resourceEffects: { stress: +10, relationships: { 'Engineering Team': +30, 'Lead Investor (Sterling)': -10 } }
        },
        {
          text: 'Capitulate to Sterling: Sign the layoff papers immediately to guarantee the $150k wire.',
          consequenceSummary: 'Engineering morale collapses. Tariq threatens resignation in protest.',
          flags: ['capitulated_layoffs'],
          resourceEffects: { money: +15000, stress: +35, relationships: { 'Engineering Team': -45, 'Lead Investor (Sterling)': +20 } }
        },
        {
          text: 'Propose executive pay cut: Offer to forfeit 100% of founder salary for 6 months to preserve developers.',
          consequenceSummary: 'The team is deeply inspired by your servant leadership; Sterling begrudgingly accepts.',
          flags: ['founder_sacrifice', 'saved_talent'],
          resourceEffects: { money: -2500, stress: -10, relationships: { 'Engineering Team': +35, 'Lead Investor (Sterling)': +10 } }
        }
      ]
    },
    {
      id: 'beat_launch_readiness',
      title: '17:30 PM – The Zero Hour Launch',
      narrative: 'The clock ticks toward the hospital pilot deployment. Tariq signals that the telemetry firmware patch is running smoothly. The hospital procurement committee is gathered in the auditorium.',
      options: [
        {
          text: 'Deliver the live demonstration with total transparency on fail-safes and telemetry precision.',
          consequenceSummary: 'Hospital leadership is blown away by the system\'s clinical rigor and integrity.',
          flags: ['impeccable_launch'],
          resourceEffects: { energy: +15, stress: -20, relationships: { 'Hospital Pilot Clients': +35 } }
        },
        {
          text: 'Rush the demo superficially without showing real-time error logs to avoid tricky questions.',
          consequenceSummary: 'The presentation passes, but hospital engineers harbor lingering skepticism.',
          flags: ['evasive_demo'],
          resourceEffects: { stress: +15, relationships: { 'Hospital Pilot Clients': -10 } }
        }
      ]
    }
  ],
  endings: [
    {
      id: 'ending_visionary_leadership',
      title: 'THE UNCOMPROMISED MISSION',
      quality: 'Visionary Master Ending',
      baseScore: 200,
      requiredFlags: ['stood_ground_sterling', 'impeccable_launch'],
      text: 'Jordan proved that profound commercial success does not require compromising human values or engineering ethics. By protecting the technical team, securing ethical grant backing, and delivering bulletproof water monitoring tech, Aether Health closed multi-year hospital contracts on its own terms.'
    },
    {
      id: 'ending_hollow_survival',
      title: 'THE PYRRHIC VICTORY',
      quality: 'Compromised Ending',
      baseScore: 130,
      requiredFlags: ['capitulated_layoffs'],
      text: 'Aether secured the investor check, but its creative soul was hollowed out. Tariq and the senior talent resigned within ninety days, leaving Jordan with an investor board that micromanages every breath of a decaying company.'
    },
    {
      id: 'ending_stable_turnaround',
      title: 'THE BATTLE-TESTED VENTURE',
      quality: 'Resilient Ending',
      baseScore: 165,
      text: 'Through grit and disciplined negotiation, Jordan weathered the 24-hour liquidity tempest. The product launched successfully, runway was preserved, and the foundation was laid for genuine sustainable growth.'
    }
  ]
};
