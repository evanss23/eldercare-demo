export const mockProfile = {
  name: 'Grammy',
  wellnessScore: 85,
  safetyStatus: { level: 'green', message: 'All is Well' },
  lastActive: new Date().toISOString(),
  medications: [
    { name: 'Blood Pressure Medicine', time: '8:00 AM', taken: true },
    { name: 'Vitamin D', time: '12:00 PM', taken: false },
    { name: 'Heart Medicine', time: '6:00 PM', taken: false }
  ]
};

export const mockMemories = [
  { 
    id: 1,
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1606787503066-794bb59c64bc?w=800&q=80', 
    caption: 'Family reunion 2019! Everyone was there.',
    date: '2019-07-15'
  },
  { 
    id: 2,
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', 
    caption: 'You loved these flowers in our garden',
    date: '2020-05-20'
  },
  {
    id: 3,
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&q=80',
    caption: 'Sunday dinner with the grandkids',
    date: '2021-11-28'
  },
  {
    id: 4,
    type: 'music',
    title: 'Moon River',
    artist: 'Andy Williams',
    url: 'https://open.spotify.com/track/example1',
    caption: 'Your wedding song'
  },
  {
    id: 5,
    type: 'music',
    title: 'What a Wonderful World',
    artist: 'Louis Armstrong',
    url: 'https://open.spotify.com/track/example2',
    caption: 'Always makes you smile'
  }
];

export const mockChatHistory = [
  {
    id: 1,
    timestamp: '2024-01-20 10:30 AM',
    type: 'voice',
    from: 'elder',
    message: 'Good morning dear, I just had breakfast.',
    duration: '0:23'
  },
  {
    id: 2,
    timestamp: '2024-01-20 10:32 AM',
    type: 'text',
    from: 'caretaker',
    message: 'Good morning Grammy! That\'s wonderful. What did you have?'
  },
  {
    id: 3,
    timestamp: '2024-01-20 10:35 AM',
    type: 'voice',
    from: 'elder',
    message: 'I had oatmeal with blueberries. The nurse helped me.',
    duration: '0:18'
  },
  {
    id: 4,
    timestamp: '2024-01-20 2:15 PM',
    type: 'text',
    from: 'caretaker',
    message: 'Don\'t forget to take your afternoon medication!'
  },
  {
    id: 5,
    timestamp: '2024-01-20 2:20 PM',
    type: 'voice',
    from: 'elder',
    message: 'Thank you for reminding me. I just took it.',
    duration: '0:12'
  }
];

export const mockActivities = [
  {
    id: 1,
    time: '9:00 AM',
    activity: 'Morning Walk',
    completed: true,
    icon: '🚶‍♀️'
  },
  {
    id: 2,
    time: '10:30 AM',
    activity: 'Doctor Appointment',
    completed: true,
    icon: '👨‍⚕️'
  },
  {
    id: 3,
    time: '2:00 PM',
    activity: 'Lunch with Friends',
    completed: false,
    icon: '🍽️'
  },
  {
    id: 4,
    time: '4:00 PM',
    activity: 'Reading Time',
    completed: false,
    icon: '📚'
  }
];

export const mockEmergencyContacts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Primary Physician',
    phone: '555-0123',
    priority: 1
  },
  {
    id: 2,
    name: 'Emily (Daughter)',
    role: 'Family',
    phone: '555-0124',
    priority: 2
  },
  {
    id: 3,
    name: 'Care Center',
    role: 'Facility',
    phone: '555-0125',
    priority: 3
  }
];