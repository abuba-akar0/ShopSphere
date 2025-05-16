"use client";
import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setLogoUrl(data.store_logo || '/Images/ShopSphere.png'));
  }, []);

  return (
    <footer className="bg-background border-t border-border pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="ShopSphere Logo"
                className="h-28 w-auto mb-3"
                style={{ maxWidth: '220px', objectFit: 'contain' }}
              />
            )}
            <h3 className="text-2xl font-bold text-primary mb-1 text-center md:text-left tracking-tight">ShopSphere</h3>
            <p className="text-muted-foreground text-sm text-center md:text-left max-w-xs">Your ultimate destination for amazing products and deals.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-foreground mb-3 tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">Home</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">Categories</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">Cart</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-foreground mb-3 tracking-wide">Follow Us</h4>
            <div className="flex space-x-4 mt-1">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 mt-12 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
