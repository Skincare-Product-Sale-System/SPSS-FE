// This file should be imported in your Next.js server startup code
import { preloadServerPages } from './preload';

export async function initializeServerPreload() {
  console.log('Initializing server preload...');
  
  // Start preloading after a short delay to allow server to initialize
  setTimeout(async () => {
    try {
      await preloadServerPages();
    } catch (error) {
      console.error('Error during server preload initialization:', error);
    }
  }, 2000);
}

// Call this directly if you want immediate execution
// if (process.env.NODE_ENV === 'production') {
//   initializeServerPreload();
// } 