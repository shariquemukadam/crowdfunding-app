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
  const [profile, setProfile] = useState<Profile | null>(null); // Keep profile state
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
        setProfile(data); // Keep this line
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
      setProfile(updatedProfile); // Update profile state
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userId) return <p>Please sign in to view your settings.</p>;

  return (
    <div>
      <h2>Profile Settings</h2>
      
      {/* Display Profile Details */}
      {profile && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Your Profile</h3>
          <ul>
            <li>First Name: {profile.first_name}</li>
            <li>Last Name: {profile.last_name}</li>
            <li>CGPA: {profile.cgpa}</li>
            <li>Year of Study: {profile.year_of_study}</li>
            <li>Graduation Year: {profile.graduation_year}</li>
            <li>Gender: {profile.gender}</li>
          </ul>
        </div>
      )}

      {/* Form for Editing Profile */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Form Fields */}
        {/* ... */}
        
        {/* Submit Button */}
        <button type="submit">Save Changes</button>
        
        {/* Error/Success Messages */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
}
