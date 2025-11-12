import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const convex = new ConvexReactClient('https://deafening-wolverine-739.convex.cloud');

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ConvexProvider>
  );
}
