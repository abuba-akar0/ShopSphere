"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const defaultSettings = {
  store_name: '',
  store_email: '',
  store_address: '',
  store_logo: '',
  contact_phone: '',
  theme_color: '#2563eb',
  promotion_message: '',
  about: '',
  business_hours: '',
  maintenance_mode: '0',
  maintenance_message: '',
  outgoing_email: '',
  registration_email_enabled: '1',
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      } catch {
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast({ title: 'Settings saved', description: 'All settings updated successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl">
      <Card className="shadow-lg border border-border">
        <CardHeader>
          <CardTitle>Admin Store Settings</CardTitle>
          <CardDescription>
            Configure your store's branding, appearance, operational, and notification settings. Changes are saved instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="store_name">Store Name</Label>
                <Input id="store_name" name="store_name" value={settings.store_name} onChange={handleChange} required placeholder="e.g. ShopSphere" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="store_email">Store Contact Email</Label>
                <Input id="store_email" name="store_email" value={settings.store_email} onChange={handleChange} required placeholder="e.g. contact@shopsphere.com" className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="store_address">Store Address</Label>
                <Input id="store_address" name="store_address" value={settings.store_address} onChange={handleChange} placeholder="e.g. 123 Main St, City, Country" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input id="contact_phone" name="contact_phone" value={settings.contact_phone} onChange={handleChange} placeholder="e.g. +1234567890" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="store_logo">Store Logo URL</Label>
                <Input id="store_logo" name="store_logo" value={settings.store_logo} onChange={handleChange} placeholder="Paste logo image URL here" className="mt-1" />
                <span className="text-xs text-muted-foreground block mt-1">Paste a direct image URL (ending in .jpg, .png, .webp, etc.). Do not use a page link.</span>
                <div className="min-h-16 flex items-center">
                  {settings.store_logo && /\.(jpe?g|png|gif|webp|svg)$/i.test(settings.store_logo.trim()) ? (
                    <img
                      src={settings.store_logo}
                      alt="Store Logo Preview"
                      className="mt-2 h-24 w-auto rounded shadow border bg-white"
                      style={{ maxWidth: '300px', maxHeight: '96px', objectFit: 'contain', background: '#fff' }}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-xs text-destructive ml-2">Invalid image URL</span>');
                      }}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground ml-2">Logo preview will appear here</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <Label htmlFor="theme_color">Theme Color</Label>
                <Input id="theme_color" name="theme_color" type="color" value={settings.theme_color} onChange={handleChange} className="w-16 h-10 p-0 border-none bg-transparent cursor-pointer" />
                <span className="ml-2 text-sm text-muted-foreground">Choose your brand's primary color</span>
              </div>
              <div className="flex-1">
                <Label htmlFor="promotion_message">Promotion Message</Label>
                <Textarea
                  id="promotion_message"
                  name="promotion_message"
                  value={settings.promotion_message}
                  onChange={handleChange}
                  placeholder="Enter a promotion or information message to show users after login"
                  className="resize-none min-h-[60px]"
                />
                <span className="text-xs text-muted-foreground">This message will pop up for users after login.</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <Label htmlFor="about">About Store</Label>
              <Textarea
                id="about"
                name="about"
                value={settings.about || ''}
                onChange={handleChange}
                placeholder="Describe your store, mission, or any details you want to share."
                className="resize-none min-h-[80px]"
              />
              <Label htmlFor="business_hours">Business Hours</Label>
              <Input
                id="business_hours"
                name="business_hours"
                value={settings.business_hours || ''}
                onChange={handleChange}
                placeholder="e.g. Mon-Fri 9am-6pm, Sat 10am-4pm"
              />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="text-lg font-semibold mb-2">Operational Settings</h2>
              <div className="flex items-center gap-4">
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode === '1'}
                  onCheckedChange={checked => setSettings(s => ({ ...s, maintenance_mode: checked ? '1' : '0' }))}
                />
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
              </div>
              {settings.maintenance_mode === '1' && (
                <div>
                  <Label htmlFor="maintenance_message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance_message"
                    name="maintenance_message"
                    value={settings.maintenance_message || ''}
                    onChange={handleChange}
                    placeholder="Message shown to users when site is in maintenance mode."
                    className="resize-none min-h-[60px]"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="text-lg font-semibold mb-2">Email Settings</h2>
              <Label htmlFor="outgoing_email">Outgoing Email Address</Label>
              <Input
                id="outgoing_email"
                name="outgoing_email"
                value={settings.outgoing_email || ''}
                onChange={handleChange}
                placeholder="e.g. no-reply@shopsphere.com"
              />
              <div className="flex items-center gap-4">
                <Switch
                  id="registration_email_enabled"
                  checked={settings.registration_email_enabled === '1'}
                  onCheckedChange={checked => setSettings(s => ({ ...s, registration_email_enabled: checked ? '1' : '0' }))}
                />
                <Label htmlFor="registration_email_enabled">Send email to user on registration</Label>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <Button type="submit" disabled={saving} className="px-8 py-2 text-base font-semibold">
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;