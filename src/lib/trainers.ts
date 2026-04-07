export type Trainer = {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  specializations: string[];
  levels: string[]; // e.g., P100, P500, P1000
  rating: number;
  reviews: number;
  price: number; // per hour
  active: boolean;
  availability: {
    [date: string]: string[]; // "YYYY-MM-DD": ["09:00", "10:00", ...]
  };
};

/**
 * Helper to generate weekday slots for a range of dates.
 * Uses LOCAL date parts to avoid timezone mismatches with the UI.
 */
const generateAvailability = (startMonth: number, endMonth: number, year: number, times: string[]) => {
  const availability: { [key: string]: string[] } = {};
  
  for (let m = startMonth; m <= endMonth; m++) {
    for (let d = 1; d <= 31; d++) {
      const date = new Date(year, m, d);
      if (date.getMonth() !== m) continue;

      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const yStr = date.getFullYear();
        const mStr = String(date.getMonth() + 1).padStart(2, '0');
        const dStr = String(date.getDate()).padStart(2, '0');
        const dateKey = `${yStr}-${mStr}-${dStr}`;
        
        availability[dateKey] = [...times];
      }
    }
  }
  return availability;
};

export const trainers: Trainer[] = [
  {
    id: "trainer1",
    name: "Carlos Sanchez",
    avatarUrl: "https://picsum.photos/seed/padel-trainer-1/200/200",
    bio: "Former professional player with 10 years of coaching experience. I focus on tactical gameplay and advanced techniques to help you dominate the court.",
    specializations: ["Bandeja", "Vibora", "Tactics", "Competition Prep"],
    levels: ["P500", "P700", "P1000"],
    rating: 5,
    reviews: 42,
    price: 90,
    active: true,
    availability: generateAvailability(1, 7, 2025, ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]),
  },
  {
    id: "trainer2",
    name: "Isabella Rossi",
    avatarUrl: "https://picsum.photos/seed/padel-trainer-2/200/200",
    bio: "Passionate about introducing new players to padel. My lessons are fun, engaging, and focus on building a strong foundation of skills.",
    specializations: ["Beginner Fundamentals", "Defense", "Positioning", "Kids Lessons"],
    levels: ["P50", "P100", "P200"],
    rating: 4.8,
    reviews: 28,
    price: 60,
    active: true,
    availability: generateAvailability(1, 3, 2025, ["11:00", "12:00", "17:00", "18:00"]),
  },
  {
    id: "trainer3",
    name: "Liam Chen",
    avatarUrl: "https://picsum.photos/seed/padel-trainer-3/200/200",
    bio: "A certified fitness and padel coach. I help players improve their physical condition, prevent injuries, and develop powerful attacking shots.",
    specializations: ["Fitness", "Attack", "Power Shots", "Injury Prevention"],
    levels: ["P300", "P400", "P500"],
    rating: 4.9,
    reviews: 35,
    price: 75,
    active: true,
    availability: generateAvailability(1, 3, 2025, ["10:00", "11:00", "12:00", "13:00"]),
  },
];