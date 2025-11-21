import { Tabs } from 'expo-router';
import { Heart, Home, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#4F46E5',
        tabBarStyle: { paddingBottom: 5, paddingTop: 5 }
    }}>
      {/* 1. Home Tab */}
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }} 
      />

      {/* 2. Favorites Tab */}
      <Tabs.Screen 
        name="favorites" 
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }} 
      />

      {/* 3. Profile Tab (NEW) */}
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }} 
      />

      {/* Hidden Screens (So tab bar stays visible) */}
      <Tabs.Screen 
        name="book-list" 
        options={{
          href: null, // Hides from tab bar
          headerShown: false
        }} 
      />
      <Tabs.Screen 
        name="book-detail" 
        options={{
          href: null, // Hides from tab bar
          headerShown: false,
          presentation: 'modal' // Optional: Makes it slide up
        }} 
      />
    </Tabs>
  );
}