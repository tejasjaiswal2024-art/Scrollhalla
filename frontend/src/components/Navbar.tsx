import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rss, Compass, Bookmark, Settings, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/onboarding"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Sparkles size={20} />
        <span>Setup</span>
      </NavLink>

      <NavLink
        to="/timeline"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Rss size={20} />
        <span>Feed</span>
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Compass size={20} />
        <span>Explore</span>
      </NavLink>

      <NavLink
        to="/bookmarks"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Bookmark size={20} />
        <span>Saved</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
