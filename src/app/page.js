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
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('lumenProfile');
      return savedProfile ? JSON.parse(savedProfile) : {
        dyslexia: false,
        adhd: false,
        lowVision: false
      };
    }
    return {
      dyslexia: false,
      adhd: false,
      lowVision: false
    };
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const toggleProfileOption = (option) => {
    const newProfile = { ...profile, [option]: !profile[option] };
    setProfile(newProfile);
    localStorage.setItem('lumenProfile', JSON.stringify(newProfile));
  };

  return (
    <div className="min-h-screen transition-all duration-500" style={{ background: 'var(--lumen-bg)' }}>
      {/* Decorative stars/sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute top-32 right-40 w-1 h-1 bg-yellow-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-yellow-300 rounded-full opacity-50"></div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-16 relative z-10">

        {/* Enhanced Ornate Header */}
        <header className="ornate-frame">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-glow">
                  <span className="text-3xl">📖</span>
                </div>
                <div>
                  <h1 className="text-6xl font-bold tracking-tight" style={{ color: 'var(--lumen-accent-solid)' }}>Lumen Read</h1>
                  <p className="text-lumen-text-secondary text-lg mt-2">✨ Adaptive, Accessible Reading Platform ✨</p>
                </div>
              </div>
              <p className="text-lumen-text-secondary max-w-md leading-relaxed">
                Experience reading that adapts to you. Our AI detects struggle patterns and transforms the interface in real-time.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: 'var(--lumen-accent-solid)',
                color: '#0f1419',
                borderColor: 'var(--lumen-accent-solid)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                Upload Book
              </span>
            </button>
            <input
              type="file"
              accept=".epub, .txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Enhanced Profile Sidebar */}
          <aside className="space-y-8">
            <div className="ornate-frame">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: '#0f1419' }}>👤</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--lumen-accent-solid)' }}>Reading Profile</h2>
              </div>
              <p className="text-lumen-text-secondary mb-8 leading-relaxed italic">
                ✨ Select your challenges. We&apos;ll automatically build your ideal reading environment. ✨
              </p>

              <div className="space-y-4">
                <label className="flex items-center space-x-4 cursor-pointer group p-4 rounded-xl transition-all duration-200" 
                  style={{ 
                    background: profile.dyslexia ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    border: '1px solid ' + (profile.dyslexia ? 'var(--lumen-accent-solid)' : 'var(--lumen-border)')
                  }}
                  onClick={() => toggleProfileOption('dyslexia')}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    profile.dyslexia
                      ? 'border-transparent shadow-glow'
                      : 'border-lumen-border group-hover:border-lumen-accent'
                  }`}
                  style={{ 
                    background: profile.dyslexia ? 'var(--lumen-accent-solid)' : 'transparent'
                  }}>
                    {profile.dyslexia && <span style={{ color: '#0f1419' }} className="text-sm font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium group-hover:text-lumen-accent transition-colors" style={{ color: profile.dyslexia ? 'var(--lumen-accent-solid)' : 'inherit' }}>Dyslexia</span>
                    <p className="text-sm text-lumen-text-secondary">Enhanced spacing & fonts</p>
                  </div>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer group p-4 rounded-xl transition-all duration-200" 
                  style={{ 
                    background: profile.adhd ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    border: '1px solid ' + (profile.adhd ? 'var(--lumen-accent-solid)' : 'var(--lumen-border)')
                  }}
                  onClick={() => toggleProfileOption('adhd')}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    profile.adhd
                      ? 'border-transparent shadow-glow'
                      : 'border-lumen-border group-hover:border-lumen-accent'
                  }`}
                  style={{ 
                    background: profile.adhd ? 'var(--lumen-accent-solid)' : 'transparent'
                  }}>
                    {profile.adhd && <span style={{ color: '#0f1419' }} className="text-sm font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium group-hover:text-lumen-accent transition-colors" style={{ color: profile.adhd ? 'var(--lumen-accent-solid)' : 'inherit' }}>ADHD / Focus Loss</span>
                    <p className="text-sm text-lumen-text-secondary">Distraction-free reading</p>
                  </div>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer group p-4 rounded-xl transition-all duration-200" 
                  style={{ 
                    background: profile.lowVision ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    border: '1px solid ' + (profile.lowVision ? 'var(--lumen-accent-solid)' : 'var(--lumen-border)')
                  }}
                  onClick={() => toggleProfileOption('lowVision')}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    profile.lowVision
                      ? 'border-transparent shadow-glow'
                      : 'border-lumen-border group-hover:border-lumen-accent'
                  }`}>
                    {profile.lowVision && <span className="text-white text-sm">✓</span>}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium group-hover:text-lumen-accent transition-colors">Low Vision</span>
                    <p className="text-sm text-lumen-text-secondary">High contrast & zoom</p>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Enhanced Library Display */}
          <main className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span style={{ color: '#0f1419' }} className="text-xl font-semibold">📚</span>
              </div>
              <h2 className="text-4xl font-bold" style={{ color: 'var(--lumen-accent-solid)' }}>✨ Your Library ✨</h2>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-20 px-8 ornate-frame">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lumen-accent-solid)' }}>✨ No Books Found ✨</h3>
                <p className="text-lumen-text-secondary mb-8 max-w-sm mx-auto leading-relaxed italic">
                  Upload your first book to start your adaptive reading journey.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => fileInputRef.current?.click()} 
                    style={{
                      background: 'var(--lumen-accent-solid)',
                      color: '#0f1419',
                      border: '2px solid var(--lumen-accent-solid)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <span>📤</span>
                      Upload a book
                    </span>
                  </button>
                  <Link href="/read/sample" 
                    style={{
                      background: 'transparent',
                      color: 'var(--lumen-accent-solid)',
                      border: '2px solid var(--lumen-accent-solid)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <span>🎯</span>
                      Try Sample
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Enhanced Sample Book */}
                <Link href="/read/sample" className="group ornate-frame transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-glow">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl transition-colors mb-1 truncate" style={{ color: 'var(--lumen-accent-solid)' }}>Moby Dick</h3>
                      <p className="text-lumen-text-secondary text-sm">Herman Melville</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--lumen-border)' }}>
                    <span className="text-xs px-3 py-1 rounded-full font-medium uppercase" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--lumen-accent-solid)' }}>Built-in Sample</span>
                    <div className="flex items-center gap-1" style={{ color: 'var(--lumen-accent-solid)' }}>
                      <span className="text-sm font-semibold">Read</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>

                {/* Enhanced User Books */}
                {books.map(book => (
                  <Link href={`/read/${book.id}`} key={book.id} className="group ornate-frame transition-all duration-300 hover:shadow-lg hover:scale-105 relative">
                    <button
                      onClick={(e) => handleDelete(e, book.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <span className="text-red-500 text-sm">✕</span>
                    </button>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-premium">
                        <span className="text-white text-lg">📚</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl group-hover:text-lumen-accent transition-colors mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-lumen-text-secondary text-sm">{book.creator}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-lumen-border-light">
                      <span className="text-xs text-lumen-text-secondary">{new Date(book.addedDate).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-lumen-border-light rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(book.percentComplete || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-lumen-text-secondary">{Math.round(book.percentComplete || 0)}%</span>
                      </div>
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
