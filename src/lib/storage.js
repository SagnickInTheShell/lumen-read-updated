import localforage from 'localforage';

/**
 * Storage Library
 * Uses IndexedDB to store book metadata and large text arrays locally.
 */

// Initialize store names
const libraryStore = localforage.createInstance({
  name: 'lumenRead',
  storeName: 'libraryList'
});

const contentStore = localforage.createInstance({
  name: 'lumenRead',
  storeName: 'bookContents'
});

export const storage = {
  /**
   * Save a processed book to the local library.
   * @param {Object} book Metadata (id, title, author, addedDate, percentComplete)
   * @param {Array<String>} paragraphs Extract text content
   */
  async saveBook(book, paragraphs) {
    try {
      // Get current list
      const list = await this.getLibrary();
      // Update metadata list
      const existingIdx = list.findIndex(b => b.id === book.id);
      if (existingIdx > -1) {
        list[existingIdx] = { ...list[existingIdx], ...book };
      } else {
        list.push({ ...book, addedDate: Date.now(), percentComplete: 0 });
      }

      await libraryStore.setItem('books', list);
      
      // Save large bulk content separately to avoid lag when loading just the dashboard
      await contentStore.setItem(book.id, paragraphs);
      return true;
    } catch (e) {
      console.error('Failed to save book to DB', e);
      throw e;
    }
  },

  /**
   * Get all books in the library metadata.
   */
  async getLibrary() {
    return (await libraryStore.getItem('books')) || [];
  },

  /**
   * Get the array of text paragraphs for a specific book id.
   */
  async getBookContent(bookId) {
    return await contentStore.getItem(bookId);
  },
  
  /**
   * Delete a book entirely.
   */
  async deleteBook(bookId) {
    const list = await this.getLibrary();
    const filtered = list.filter(b => b.id !== bookId);
    await libraryStore.setItem('books', filtered);
    await contentStore.removeItem(bookId);
  },

  /**
   * Update reading progress for a book
   */
  async updateProgress(bookId, percent) {
    const list = await this.getLibrary();
    const book = list.find(b => b.id === bookId);
    if (book) {
       book.percentComplete = percent;
       await libraryStore.setItem('books', list);
    }
  }
};
