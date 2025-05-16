// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard, PackagePlus, Users, Settings, MessageCircle } from 'lucide-react'; // Icons

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    // If still loading, wait. If not loading and user is not admin, redirect.
    if (!loading && !isAdmin) {
      router.push('/login'); // Or redirect to a "not authorized" page
      // console.log("Redirecting: Not an admin or not logged in.");
    }
     // console.log("Admin check:", { loading, isAdmin, user: user?.email });

    // Fetch contact messages
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/contact-messages');
        const data = await res.json();
        setMessages(data);
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [user, isAdmin, loading, router]);

  // Show loading state or placeholder while checking auth/admin status
  if (loading || !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading or checking authorization...</p>
        {/* Optional: Add a spinner */}
      </div>
    );
  }


  // If loading is done and user is admin, show the dashboard
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Cards for Admin Sections */}
        <Card className="shadow-md hover:shadow-lg transition-shadow border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Manage Products</CardTitle>
            <PackagePlus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add, edit, or remove products from the store catalog.
            </p>
            {/* Link to actual product management page once created */}
            <Link href="/admin/products" passHref>
              <Button variant="outline" size="sm">Go to Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border border-border">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Manage Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View customer information and manage user roles (use with caution).
            </p>
            {/* Link to actual user management page once created */}
            <Link href="/admin/users" passHref>
                <Button variant="outline" size="sm">Go to Users</Button>
             </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border border-border">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Store Settings</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure store settings, payment gateways, and shipping options.
            </p>
            {/* Link to actual settings page once created */}
             <Link href="/admin/settings" passHref>
                <Button variant="outline" size="sm">Go to Settings</Button>
             </Link>
          </CardContent>
        </Card>

        {/* Add more cards for Orders, Analytics, etc. */}

      </div>
      {/* Feedback & Messages Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="h-6 w-6" /> User Messages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {messagesLoading ? (
                <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center">No messages found.</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="even:bg-muted/50">
                    <td className="p-2 border font-medium">{msg.name}</td>
                    <td className="p-2 border">{msg.email}</td>
                    <td className="p-2 border">{msg.subject}</td>
                    <td className="p-2 border max-w-xs whitespace-pre-line break-words">{msg.message}</td>
                    <td className="p-2 border">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
