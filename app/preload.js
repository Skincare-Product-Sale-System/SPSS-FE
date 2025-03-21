// New file to handle preloading logic
import { generateStaticParams } from './products/[slug]/page';
import { generateStaticParams as generateCategoryParams } from './category/[slug]/page';

export async function preloadPages() {
  console.log('Preloading critical pages...');
  
  try {
    // Preload home page
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}`);
    
    // Preload product pages
    const productParams = await generateStaticParams();
    for (const param of productParams.slice(0, 10)) { // Limit to first 10 products
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/products/${param.slug}`);
    }
    
    // Preload category pages
    const categoryParams = await generateCategoryParams();
    for (const param of categoryParams) {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/category/${param.slug}`);
    }
    
    console.log('Critical pages preloaded successfully');
  } catch (error) {
    console.error('Error preloading pages:', error);
  }
} 