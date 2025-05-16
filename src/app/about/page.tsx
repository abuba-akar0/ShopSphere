"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye } from 'lucide-react';

const AboutPage = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        {settings?.store_logo && (
          <img
            src={settings.store_logo}
            alt="Store Logo"
            className="mx-auto mb-4 h-32 w-32 rounded-full shadow border border-border bg-white"
            style={{ objectFit: 'contain', background: '#fff' }}
          />
        )}
        <h1 className="text-5xl font-bold mb-4 text-primary">About {settings?.store_name || 'ShopSphere'}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {settings?.about || 'Learn more about our journey, mission, and the values that drive us to provide you with the best shopping experience.'}
        </p>
      </section>

      {/* Store Info Section */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              {settings?.store_address && <li><b>Address:</b> {settings.store_address}</li>}
              {settings?.contact_phone && <li><b>Phone:</b> {settings.contact_phone}</li>}
              {settings?.store_email && <li><b>Email:</b> {settings.store_email}</li>}
              {settings?.business_hours && <li><b>Business Hours:</b> {settings.business_hours}</li>}
            </ul>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Wide Selection: Find everything you need in one place.</li>
              <li>Quality Guaranteed: We stand by the quality of our products.</li>
              <li>Secure Shopping: Your data and privacy are protected.</li>
              <li>Fast Shipping: Get your orders delivered quickly.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-border">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide a seamless and delightful online shopping experience by offering a curated selection of high-quality products, competitive prices, and outstanding customer support.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-border">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                <Eye className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the go-to online destination for shoppers seeking variety, value, and reliability, constantly innovating to exceed customer expectations.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-border">
          <CardHeader>
             <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                <Users className="h-8 w-8 text-primary" />
             </div>
            <CardTitle className="text-2xl font-semibold text-foreground">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-left list-disc list-inside">
                <li>Customer Centricity</li>
                <li>Integrity & Transparency</li>
                <li>Quality Assurance</li>
                <li>Innovation & Adaptability</li>
                <li>Community Engagement</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;
