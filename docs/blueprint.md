# **App Name**: PadelVerse

## Core Features:

- User Authentication: Secure user authentication using Firebase Authentication with email/password and optional social login (Google/Apple).
- Profile Management: Users can create and update their profiles, including skill level, ranking, and club affiliations. Choose profile visibility settings.
- Club Management: Club admins and owners can manage club details, events, announcements, and member roles within their clubs.
- Match Creation & Management: Create and manage matches, track scores in real-time, and record match statistics. Utilizes Firestore listeners for real-time score updates.
- Highlight Generation Tool: Allow users to create video highlight clips based on uploaded videos and suggest key moments from matches, which leverages AI to assist the selection process using given tags. Requires interaction with video from Firebase storage.
- Real-Time Chat: Enable real-time chat functionality within the app, supporting 1-on-1, group, match, and event chats using Firestore listeners for new messages.
- Marketplace: A secure 'Buy/Sell' feature for second-hand padel items within each club, with moderation by club admins.

## Style Guidelines:

- Primary color: Lime green (#A6FF00) for highlights and action elements, conveying energy.
- Background color: Dark blue (#001F3F) to provide a modern and sophisticated base.
- Accent color: A lighter shade of lime green (#BFFF40) to add contrast without overwhelming the dark theme.
- Body and headline font: 'Inter', a sans-serif font providing a modern and neutral look.
- Use minimalist and clear icons, with lime green accents for interactive elements. All iconography must be optimized for accessibility across a wide age range.
- Mobile-first design with a clear information hierarchy, ensuring an intuitive user experience. Utilize a grid system for consistent alignment and spacing.
- Subtle transitions and animations to enhance user engagement and provide visual feedback. Focus on speed and responsiveness.