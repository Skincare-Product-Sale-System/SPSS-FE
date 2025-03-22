import { preloadPages } from './app/preload';

// After server is started
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await preloadPages();
}); 