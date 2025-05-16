"use client";
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && String(user.role) === '1') {
      alert('Admin users cannot be edited.');
      return;
    }
    if (user) {
      setEditUser(user);
      setEditForm({ name: user.name, email: user.email });
      setShowEditDialog(true);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, email: editForm.email })
      });
      if (!res.ok) throw new Error('Failed to update user');
      setUsers(users => users.map(u => u.id === editUser.id ? { ...u, name: editForm.name, email: editForm.email } : u));
      setShowEditDialog(false);
    } catch (error: any) {
      setEditError(error.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Prevent deleting admin
    const user = users.find(u => u.id === userId);
    if (user && String(user.role) === '1') {
      alert('Admin users cannot be deleted.');
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Manage Users</h1>
      {users.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{String(user.role) === '1' ? 'admin' : 'user'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => handleEditUser(user.id)}
                    disabled={String(user.role) === '1'}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={String(user.role) === '1'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">No users found.</p>
      )}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user's name and email.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              placeholder="Name"
              className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
              required
            />
            <input
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              placeholder="Email"
              type="email"
              className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
              required
            />
            {editError && <span className="text-destructive text-xs">{editError}</span>}
            <DialogFooter>
              <Button type="submit" disabled={editLoading} className="bg-primary text-white">
                {editLoading ? 'Updating...' : 'Update User'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;