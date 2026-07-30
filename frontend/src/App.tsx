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
  // Read stored user profile and onboarding status from localStorage
  const [currentUser, setCurrentUser] = useState<IUserProfile | null>(() => {
    const savedUser = localStorage.getItem('scrollhalla_user');
    const isOnboarded = localStorage.getItem('scrollhalla_onboarded') === 'true';
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return { ...parsed, onboarded: isOnboarded };
    }
    return {
      name: 'Tejas Jaiswal',
      email: 'tejas.jaiswal2024@vitstudent.ac.in',
      role: 'Senior Software Engineer',
      onboarded: isOnboarded,
      selectedInterestTags: ['tech', 'news', 'ai', 'india'],
      articlesReadCount: 3,
      savedArticlesCount: 2,
      likedArticlesCount: 2,
      algorithmWeights: { techWeight: 1.5, newsWeight: 1.4, designWeight: 1.3, scienceWeight: 1.2 }
    };
  });

  const [selectedArticle, setSelectedArticle] = useState<IRssArticle | null>(null);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(['ART-103', 'ART-104']);
  const [likedArticleIds, setLikedArticleIds] = useState<string[]>(['ART-102', 'ART-103', 'ART-104']);
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

  const handleToggleLike = (articleId: string) => {
    if (likedArticleIds.includes(articleId)) {
      setLikedArticleIds(prev => prev.filter(id => id !== articleId));
    } else {
      setLikedArticleIds(prev => [...prev, articleId]);
    }
  };

  const handleCompleteOnboarding = (user: IUserProfile) => {
    setCurrentUser(user);
  };

  const bookmarkedArticles = timelineArticles
    .filter(a => bookmarkedArticleIds.includes(a.id))
    .map(a => ({ ...a, isBookmarked: true }));

  // Check if onboarding is completed
  const isOnboarded = currentUser?.onboarded === true;

  return (
    <BrowserRouter>
      <div className="app-container">
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Onboarding Screen */}
            <Route
              path="/onboarding"
              element={<OnboardingView onCompleteOnboarding={handleCompleteOnboarding} />}
            />

            {/* Main Reels Reading Timeline */}
            <Route
              path="/timeline"
              element={
                !isOnboarded ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <MainTimelineView
                    onOpenArticle={setSelectedArticle}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleLike={handleToggleLike}
                    likedArticleIds={likedArticleIds}
                    bookmarkedArticleIds={bookmarkedArticleIds}
                  />
                )
              }
            />

            {/* Explore RSS Directory */}
            <Route
              path="/explore"
              element={!isOnboarded ? <Navigate to="/onboarding" replace /> : <ExploreView />}
            />

            {/* Saved Bookmarks List */}
            <Route
              path="/bookmarks"
              element={
                !isOnboarded ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <BookmarksView
                    bookmarkedArticles={bookmarkedArticles}
                    onOpenArticle={setSelectedArticle}
                    onToggleBookmark={handleToggleBookmark}
                  />
                )
              }
            />

            {/* Settings & Reader Profile */}
            <Route
              path="/settings"
              element={
                !isOnboarded ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <SettingsView
                    currentUser={currentUser}
                    onUpdateUser={setCurrentUser}
                    savedArticlesCount={bookmarkedArticleIds.length}
                    likedArticlesCount={likedArticleIds.length}
                  />
                )
              }
            />

            <Route path="*" element={<Navigate to={isOnboarded ? "/timeline" : "/onboarding"} replace />} />
          </Routes>
        </main>

        {/* Bottom Mobile Navigation Bar (Shown when onboarded) */}
        {isOnboarded && <Navbar />}

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
