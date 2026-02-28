'use client';

import { useState } from 'react';
import HomeEditor from './HomeEditor';
import AboutEditor from './AboutEditor';
import PatronsEditor from './PatronsEditor';
import ExecutiveEditor from './ExecutiveEditor';
import DepartmentsEditor from './DepartmentsEditor';
import GalleryEditor from './GalleryEditor';
import ApplicationsList from './ApplicationsList';
import ContactEditor from './ContactEditor';
import AnnouncementsEditor from './AnnouncementsEditor';
import ProgramsEditor from './ProgramsEditor';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'programs', label: 'Programs' },
  { id: 'patrons', label: 'Patrons & Mentors' },
  { id: 'executive', label: 'Executive Board' },
  { id: 'departments', label: 'Departments' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'applications', label: 'Join Applications' },
  { id: 'contact', label: 'Contact' },
  { id: 'announcements', label: 'Announcements' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('home');

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <nav className="lg:w-56 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              active === tab.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 glass-panel rounded-xl p-6 min-h-[400px]">
        {active === 'home' && <HomeEditor />}
        {active === 'about' && <AboutEditor />}
        {active === 'programs' && <ProgramsEditor />}
        {active === 'patrons' && <PatronsEditor />}
        {active === 'executive' && <ExecutiveEditor />}
        {active === 'departments' && <DepartmentsEditor />}
        {active === 'gallery' && <GalleryEditor />}
        {active === 'applications' && <ApplicationsList />}
        {active === 'contact' && <ContactEditor />}
        {active === 'announcements' && <AnnouncementsEditor />}
      </div>
    </div>
  );
}
