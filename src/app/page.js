'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { parseEpubBlob } from '@/lib/epubParser';

export default function Dashboard() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [profile, setProfile] = useState({
    dyslexia: false,
    adhd: false,
    lowVision: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load library
    storage.getLibrary().then(setBooks);
    
    // Load profile
    const savedProfile = localStorage.getItem('lumenProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileChange = (key) => {
    const nextProfile = { ...profile, [key]: !profile[key] };
    setProfile(nextProfile);
    localStorage.setItem('lumenProfile', JSON.stringify(nextProfile));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (file.name.endsWith('.epub')) {
        const { metadata, paragraphs } = await parseEpubBlob(file);
        await storage.saveBook(metadata, paragraphs);
        setBooks(await storage.getLibrary());
      } else if (file.name.endsWith('.txt')) {
         const text = await file.text();
         const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
         const metadata = {
            id: `book-${Date.now()}`,
            title: file.name.replace('.txt', ''),
            creator: 'Unknown'
         };
         await storage.saveBook(metadata, paragraphs);
         setBooks(await storage.getLibrary());
      } else {
        alert('Unsupported file format. Please upload .epub or .txt');
      }
    } catch (e) {
      alert('Failed to parse file: ' + e.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if(confirm('Delete book?')) {
      await storage.deleteBook(id);
      setBooks(await storage.getLibrary());
    }
  };

  return (
    <div className="min-h-screen bg-lumen-bg text-lumen-text p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-lumen-border pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Lumen Read</h1>
            <p className="text-lumen-text-secondary mt-1">Adaptive, Accessible Reading Platform</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-lumen-text text-lumen-bg font-semibold rounded-lg hover:bg-lumen-accent transition-colors"
            disabled={isUploading}
          >
            {isUploading ? 'Parsing...' : '+ Upload Book'}
          </button>
          <input 
            type="file" 
            accept=".epub, .txt" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <aside className="space-y-6">
            <div className="bg-lumen-bg-secondary p-6 rounded-xl border border-lumen-border">
              <h2 className="text-xl font-semibold mb-4">Reading Profile</h2>
              <p className="text-sm text-lumen-text-secondary mb-6">Select your challenges. We'll automatically build your ideal reading environment.</p>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profile.dyslexia ? 'bg-lumen-accent border-lumen-accent text-lumen-bg' : 'border-lumen-text-secondary'}`}>
                    {profile.dyslexia && <span>✓</span>}
                  </div>
                  <span className="group-hover:text-lumen-accent transition-colors">Dyslexia</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profile.adhd ? 'bg-lumen-accent border-lumen-accent text-lumen-bg' : 'border-lumen-text-secondary'}`}>
                    {profile.adhd && <span>✓</span>}
                  </div>
                  <span className="group-hover:text-lumen-accent transition-colors">ADHD / Focus Loss</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profile.lowVision ? 'bg-lumen-accent border-lumen-accent text-lumen-bg' : 'border-lumen-text-secondary'}`}>
                    {profile.lowVision && <span>✓</span>}
                  </div>
                  <span className="group-hover:text-lumen-accent transition-colors">Low Vision</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Library Display */}
          <main className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Your Library</h2>
            
            {books.length === 0 ? (
              <div className="text-center py-16 px-6 border-2 border-dashed border-lumen-border rounded-xl">
                <p className="text-lumen-text-secondary mb-2">No books found in local storage.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button onClick={() => fileInputRef.current?.click()} className="text-lumen-accent hover:underline">Upload a book</button>
                  <span className="text-lumen-border">|</span>
                  <Link href="/read/sample" className="text-lumen-accent hover:underline">Read Sample</Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Always show the hardcoded sample book */}
                <Link href="/read/sample" className="group p-5 bg-lumen-bg-secondary border border-lumen-border rounded-xl hover:border-lumen-accent hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-lumen-accent transition-colors mb-1">Moby Dick (Sample)</h3>
                    <p className="text-sm text-lumen-text-secondary">Herman Melville</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-lumen-border/50 text-xs text-lumen-text-secondary uppercase tracking-widest">
                    Built-in Sample
                  </div>
                </Link>

                {/* Display IndexedDB books */}
                {books.map(book => (
                  <Link href={`/read/${book.id}`} key={book.id} className="group p-5 bg-lumen-bg-secondary border border-lumen-border rounded-xl hover:border-lumen-accent hover:shadow-lg transition-all flex flex-col justify-between relative">
                    <button 
                      onClick={(e) => handleDelete(e, book.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-lumen-text-secondary hover:text-red-500 transition-opacity"
                    >
                      ✕
                    </button>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-lumen-accent transition-colors mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-lumen-text-secondary">{book.creator}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-lumen-border/50 flex justify-between items-center text-xs text-lumen-text-secondary">
                       <span>{new Date(book.addedDate).toLocaleDateString()}</span>
                       <span className="bg-lumen-border/50 px-2 py-1 rounded">{Math.round(book.percentComplete || 0)}% Read</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
