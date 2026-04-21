import ePub from 'epubjs';

/**
 * EPUB Parser
 * Uses epubjs to load an ePUB file locally, extract the spine,
 * and dump pure text paragraphs for the Lumen Reader engine.
 */

export async function parseEpubBlob(fileBlob) {
  try {
    const book = ePub(fileBlob);
    
    // Wait for the book to fully load and parse metadata
    await book.ready;
    const metadata = await book.loaded.metadata;
    const spine = await book.loaded.spine;
    
    let paragraphs = [];
    
    // Extract text from every item in the spine
    for (let i = 0; i < spine.items.length; i++) {
        const item = spine.items[i];
        
        try {
           const doc = await book.load(item.href);
           if (!doc) continue;
           
           // We're digging into the parsed iframe document to extract text nodes
           // To be safe against weird HTML setups, we extract direct text content from block elements like <p>, <h1>, <div>
           const textElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
           
           textElements.forEach(el => {
              const text = el.textContent ? el.textContent.trim() : '';
              if (text && text.length > 0) {
                 paragraphs.push(text);
              }
           });

        } catch (chapterErr) {
           console.warn(`Failed to parse chapter ${item.href}`, chapterErr);
        }
    }

    // Return the clean data object
    return {
       metadata: {
          id: `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: metadata.title || fileBlob.name.replace('.epub', ''),
          creator: metadata.creator || 'Unknown Author',
       },
       paragraphs
    };
  } catch (error) {
     console.error('EPUB Parsing Failed:', error);
     throw new Error('Could not parse the EPUB file. It might be corrupt or DRM protected.');
  }
}
