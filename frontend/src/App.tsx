import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReaderViewModal from './components/ReaderViewModal';
import OnboardingView from './views/OnboardingView';
import MainTimelineView from './views/MainTimelineView';
import ExploreView from './views/ExploreView';
import BookmarksView from './views/BookmarksView';
import SettingsView from './views/SettingsView';
import { IRssArticle, IUserProfile } from './types';
import { fetchFeedTimeline } from './services/apiService';

export function App() {
  const [currentUser, setCurrentUser] = useState<IUserProfile | null>({
    name: 'Tejas Jaiswal',
    email: 'engineer@scrollhalla.io',
    role: 'Senior Software Engineer'
  });

  const [selectedArticle, setSelectedArticle] = useState<IRssArticle | null>(null);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(['ART-1']);
  const [timelineArticles, setTimelineArticles] = useState<IRssArticle[]>([]);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    const data = await fetchFeedTimeline();
    setTimelineArticles(data);
  };

  const handleToggleBookmark = (articleId: string) => {
    if (bookmarkedArticleIds.includes(articleId)) {
      setBookmarkedArticleIds(prev => prev.filter(id => id !== articleId));
    } else {
      setBookmarkedArticleIds(prev => [...prev, articleId]);
    }
  };

  const bookmarkedArticles = timelineArticles
    .filter(a => bookmarkedArticleIds.includes(a.id))
    .map(a => ({ ...a, isBookmarked: true }));

  return (
    <BrowserRouter>
      <div className="app-container">
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/onboarding" element={<OnboardingView />} />

            <Route
              path="/timeline"
              element={
                <MainTimelineView
                  onOpenArticle={setSelectedArticle}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />

            <Route path="/explore" element={<ExploreView />} />

            <Route
              path="/bookmarks"
              element={
                <BookmarksView
                  bookmarkedArticles={bookmarkedArticles}
                  onOpenArticle={setSelectedArticle}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <SettingsView
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                />
              }
            />

            <Route path="*" element={<Navigate to="/timeline" replace />} />
          </Routes>
        </main>

        {/* Bottom Mobile Navigation Bar */}
        <Navbar />

        {/* Screen 5: Distraction-Free Reading / Focus View Modal */}
        {selectedArticle && (
          <ReaderViewModal
            article={{
              ...selectedArticle,
              isBookmarked: bookmarkedArticleIds.includes(selectedArticle.id)
            }}
            onClose={() => setSelectedArticle(null)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
