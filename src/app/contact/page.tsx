'use client'; // Needed for form handling if implemented later

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react'; // Icons

const ContactPage = () => {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<any>(null);
  const [settingsLoading, setSettingsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Your message has been sent!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">Get In Touch</h1>
      <p className="text-lg text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
        Have questions, feedback, or need assistance? We're here to help! Reach out to us using the methods below or fill out the contact form.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Contact Information</h2>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6 space-y-4">
              {settingsLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  {settings?.store_logo && /^(https?:)?\/\//.test(settings.store_logo) && (
                    <img
                      src={settings.store_logo}
                      alt="Store Logo"
                      className="mx-auto mb-4 h-32 w-32 rounded-full shadow border border-border bg-white"
                      style={{ objectFit: 'contain', background: '#fff' }}
                    />
                  )}
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground">Email Us</h3>
                      <a href={`mailto:${settings?.store_email || 'support@shopsphere.com'}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {settings?.store_email || 'support@shopsphere.com'}
                      </a>
                      <p className="text-sm text-muted-foreground/80">For general inquiries and support.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground">Call Us</h3>
                      <a href={`tel:${settings?.contact_phone || '+1234567890'}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {settings?.contact_phone || '+1 (234) 567-890'}
                      </a>
                      <p className="text-sm text-muted-foreground/80">Mon-Fri, 9am - 5pm EST.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground">Our Office</h3>
                      <p className="text-muted-foreground">{settings?.store_address || '123 Shopping Lane'}<br />Commerce City, ST 12345</p>
                      <p className="text-sm text-muted-foreground/80">Please note: Visits by appointment only.</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Send Us a Message</h2>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" required value={form.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Order Inquiry, Feedback" required value={form.subject} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                {success && <div className="text-green-600 text-sm">{success}</div>}
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional: Map Section */}
      {/* <section className="mt-16">
        <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Find Us Here</h2>
        <div className="aspect-video bg-muted rounded-lg border border-border overflow-hidden">
           Replace with an actual map embed (e.g., Google Maps iframe)
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..." // Your Google Maps embed link
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ShopSphere Location"
          ></iframe>
        </div>
      </section> */}
    </div>
  );
};

export default ContactPage;
