"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  cgpa: number | null;
  year_of_study: number | null;
  graduation_year: number | null;
  gender: string | null;
};

export default function SettingsTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile.');
      } else if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setCgpa(data.cgpa?.toString() || '');
        setYearOfStudy(data.year_of_study?.toString() || '');
        setGraduationYear(data.graduation_year?.toString() || '');
        setGender(data.gender || '');
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    setError(null);
    setSuccess(null);

    const updatedProfile = {
      id: userId,
      first_name: firstName || null,
      last_name: lastName || null,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      year_of_study: yearOfStudy ? parseInt(yearOfStudy) : null,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      gender: gender || null,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updatedProfile, { onConflict: 'id' });

    if (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + error.message);
    } else {
      setSuccess('Profile updated successfully!');
      setProfile(updatedProfile);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userId) return <p>Please sign in to view your settings.</p>;

  return (
    <div>
      <h2>Profile Settings</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            CGPA:
            <input
              type="number"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="Enter your CGPA (e.g., 3.5)"
              step="0.1"
              min="0"
              max="4"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Year of Study:
            <input
              type="number"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              placeholder="Enter your year of study (e.g., 1, 2, 3, 4)"
              min="1"
              max="5"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Graduation Year:
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="Enter your graduation year (e.g., 2025)"
              min="2020"
              max="2030"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Gender:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
    </div>
  );
}