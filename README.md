Book Suggestion App

This is a mobile application built with React Native (Expo) that suggests books based on the user's current mood. It features Google Authentication, Phone Authentication (Simulated), and a Favorites list using Firebase Firestore.

Features

Mood-Based Suggestions: Select a mood (Happy, Sad, Adventurous, etc.) to get curated book lists.
Google Books API: Real-time book data fetching.
Authentication: Login via Email/Password or Phone.
Favorites System: Save books to your personal library (synced to the cloud).
Profile Management: View user details and sign out.

Tech Stack

Framework: React Native (Expo Router)
Backend: Firebase (Auth & Firestore)
API: Google Books API
Styling: StyleSheet & Lucide Icons

Installation & Setup

Clone the repository
git clone [https://github.com/chiraagchari011/AppDevMiniProject.git]
cd BookSuggestions

Install dependencies npm install

Firebase Setup

Create a Firebase project.
Enable Authentication (Email/Password and Phone).
Enable Firestore Database.
Replace the keys in firebaseConfig.ts with your own credentials.

Run the App - npx expo start
