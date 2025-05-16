// src/app/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, ShieldCheck, Loader2 } from 'lucide-react'; // Icons
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ProfilePage = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not loading and no user is logged in
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`/api/profile?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Show loading state
  if (loading || loadingProfile) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is done but still no user (shouldn't happen if redirect works, but good practice)
  if (!user) {
     return (
      <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  // User is logged in, show profile
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show a toast notification for logout error
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Your Profile</h1>

      <Card className="max-w-lg mx-auto shadow-lg border border-border">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
             {/* Use user's photoURL if available, otherwise fallback */}
            <AvatarImage src={(user as any).photoURL || undefined} alt={(user as any).displayName || user.email || 'User'} />
            <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">{userInitial}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{(user as any).displayName || 'User'}</CardTitle>
           <CardDescription className="flex items-center justify-center gap-1 text-muted-foreground">
             <Mail className="h-4 w-4" /> {user.email}
            {isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {/* Add more profile details here if available (e.g., from Firestore) */}
           {/* <div className="space-y-1">
             <p className="text-sm font-medium text-foreground">Member Since:</p>
             <p className="text-sm text-muted-foreground">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
           </div> */}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Button variant="outline" className="flex-1" disabled> {/* Disabled as functionality not implemented */}
                    <User className="mr-2 h-4 w-4" /> Edit Profile
                 </Button>
                <Button variant="destructive" onClick={handleLogout} className="flex-1">
                    Logout
                </Button>
            </div>

        </CardContent>
      </Card>

      <form className="space-y-6 mt-8">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        {editing ? (
          <div className="flex gap-4">
            <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save
            </Button>
            <Button type="button" onClick={() => setEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setEditing(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Edit Profile
          </Button>
        )}
      </form>

      <div>
        <h1>Profile</h1>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phone}</p>
        <p>Address: {profile.address}</p>
        {/* Add more profile fields as needed */}
      </div>
    </div>
  );
};

export default ProfilePage;
