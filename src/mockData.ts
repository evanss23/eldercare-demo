// TypeScript interfaces for mock data
export interface Medication {
  name: string;
  time: string;
  taken: boolean;
}

export interface SafetyStatus {
  level: 'green' | 'yellow' | 'red';
  message: string;
}

export interface Profile {
  name: string;
  wellnessScore: number;
  safetyStatus: SafetyStatus;
  lastActive: string;
  medications: Medication[];
}

export interface Activity {
  id: string;
  time: string;
  activity: string;
  completed: boolean;
  icon: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export interface Memory {
  id: number;
  type: 'photo' | 'music';
  url: string;
  caption?: string;
  title?: string;
  artist?: string;
  date?: string;
}

export interface AIHighlight {
  id: string;
  timestamp: string;
  type: 'medication' | 'wellness' | 'concern' | 'activity';
  summary: string;
  details: string;
  importance: 'high' | 'medium' | 'low';
  outcome: 'success' | 'positive' | 'pending';
}

export interface QuickMessage {
  id: string;
  message: string;
  icon: string;
}

// Mock Elder Profile
export const mockProfile: Profile = {
  name: "Grammy",
  wellnessScore: 75,
  safetyStatus: {
    level: "green",
    message: "All Clear"
  },
  lastActive: "10 minutes ago",
  medications: [
    { name: "Blood Pressure Medicine", time: "8:00 AM", taken: true },
    { name: "Vitamin D", time: "12:00 PM", taken: false },
    { name: "Heart Medicine", time: "6:00 PM", taken: false }
  ]
};

// Mock Activities
export const mockActivities: Activity[] = [
  { id: "1", time: "8:00 AM", activity: "Morning medication", completed: true, icon: "💊" },
  { id: "2", time: "9:30 AM", activity: "Breakfast", completed: true, icon: "🍳" },
  { id: "3", time: "11:00 AM", activity: "Physical therapy", completed: false, icon: "🏃" },
  { id: "4", time: "2:00 PM", activity: "Afternoon walk", completed: false, icon: "🚶" },
  { id: "5", time: "4:00 PM", activity: "Video call with family", completed: false, icon: "📱" }
];

// Mock Emergency Contacts
export const mockEmergencyContacts: EmergencyContact[] = [
  { id: "1", name: "Dr. Sarah Johnson", phone: "(555) 123-4567", role: "Primary Physician" },
  { id: "2", name: "Emergency Services", phone: "911", role: "Emergency" },
  { id: "3", name: "John (Son)", phone: "(555) 987-6543", role: "Family" }
];

// Mock Memories
export const mockMemories: Memory[] = [
  {
    id: 1,
    type: "photo",
    url: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa",
    caption: "Your 80th birthday celebration!",
    date: "2 days ago"
  },
  {
    id: 2,
    type: "photo",
    url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4",
    caption: "Family dinner last Sunday",
    date: "5 days ago"
  },
  {
    id: 3,
    type: "music",
    title: "Unchained Melody",
    artist: "The Righteous Brothers",
    url: "https://example.com/song1.mp3",
    date: "1 week ago"
  },
  {
    id: 4,
    type: "photo",
    url: "https://images.unsplash.com/photo-1556911073-52527ac43761",
    caption: "The garden is blooming beautifully!",
    date: "2 weeks ago"
  },
  {
    id: 5,
    type: "music",
    title: "Can't Help Myself",
    artist: "The Four Tops",
    url: "https://example.com/song2.mp3",
    date: "3 weeks ago"
  }
];

// Mock AI Conversation Highlights
export const mockAIHighlights: AIHighlight[] = [
  {
    id: "1",
    timestamp: "Today at 10:15 AM",
    type: "medication",
    summary: "Grammy confirmed taking morning medication",
    details: "She took her blood pressure medicine and said she's feeling good today. She mentioned slight dizziness yesterday but feels better now.",
    importance: "high",
    outcome: "success"
  },
  {
    id: "2",
    timestamp: "Today at 9:30 AM",
    type: "wellness",
    summary: "Positive mood and good appetite",
    details: "Grammy had a full breakfast and is in good spirits. She talked about looking forward to the video call with family later.",
    importance: "medium",
    outcome: "positive"
  },
  {
    id: "3",
    timestamp: "Yesterday at 7:45 PM",
    type: "concern",
    summary: "Mentioned feeling lonely in the evening",
    details: "Grammy expressed feeling a bit lonely after dinner. Vera engaged her in conversation about her favorite memories and suggested calling family.",
    importance: "medium",
    outcome: "positive"
  },
  {
    id: "4",
    timestamp: "Yesterday at 2:00 PM",
    type: "activity",
    summary: "Completed afternoon walk with neighbor",
    details: "Grammy went for a 20-minute walk with Mrs. Henderson from next door. They walked to the park and back.",
    importance: "low",
    outcome: "success"
  }
];

// Mock Quick Messages
export const mockQuickMessages: QuickMessage[] = [
  { id: "1", message: "How are you feeling today?", icon: "👋" },
  { id: "2", message: "Did you take your medicine?", icon: "💊" },
  { id: "3", message: "I love you!", icon: "❤️" },
  { id: "4", message: "Call me when you can", icon: "📱" },
  { id: "5", message: "Time for your walk!", icon: "🚶" },
  { id: "6", message: "What did you have for lunch?", icon: "🍽️" }
];