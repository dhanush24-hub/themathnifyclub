'use client';

import { useState } from 'react';

export default function JoinForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.get('full_name'),
          roll_number: data.get('roll_number'),
          department: data.get('department'),
          year: data.get('year'),
          phone: data.get('phone'),
          why_join: data.get('why_join'),
          preferred_department: data.get('preferred_department'),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <p className="text-green-400 font-medium">Application submitted successfully!</p>
        <p className="text-white/70 text-sm mt-2">We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label htmlFor="roll_number" className="block text-sm font-medium text-white/90 mb-2">Roll Number</label>
        <input
          id="roll_number"
          name="roll_number"
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
          placeholder="Roll number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-white/90 mb-2">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g. CSE"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-white/90 mb-2">Year</label>
          <input
            id="year"
            name="year"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g. 2nd"
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
          placeholder="Your phone"
        />
      </div>
      <div>
        <label htmlFor="why_join" className="block text-sm font-medium text-white/90 mb-2">Why do you want to join?</label>
        <textarea
          id="why_join"
          name="why_join"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none resize-none"
          placeholder="Tell us in a few lines..."
        />
      </div>
      <div>
        <label htmlFor="preferred_department" className="block text-sm font-medium text-white/90 mb-2">Preferred Department</label>
        <select
          id="preferred_department"
          name="preferred_department"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Select one</option>
          <option value="Content">Content</option>
          <option value="Event">Event</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>
      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
