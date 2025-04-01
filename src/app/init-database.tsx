'use client';

import { useEffect, useState } from 'react';

export function InitDatabase() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initializeDatabase() {
      try {
        const response = await fetch('/api/init-db');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to initialize database');
        }
        
        console.log('Database initialization:', data.message);
        setInitialized(true);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    // Initialize database when component mounts
    initializeDatabase();
  }, []);

  // This component doesn't render anything visible
  return null;
} 