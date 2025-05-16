// src/components/Header.tsx
'use client'; // Needed for useContext and state hooks

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, ShieldCheck, UserCircle, LayoutDashboard, Moon, Sun } from 'lucide-react'; // Import necessary icons
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose // Import SheetClose
} from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown Menu


const Header = () => {
  const { cart } = useCart();
  const { user, isAdmin, loading, logout } = useAuth(); // Get auth state and logout function
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  const { toast } = useToast();

  const [isDark, setIsDark] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  React.useEffect(() => {
    // Use static logo from public folder if no logo in settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setLogoUrl(data.store_logo || '/Images/ShopSphere.png'));
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/'); // Redirect to homepage after logout
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({ title: "Logout Failed", description: error.message || "An error occurred during logout.", variant: "destructive" });
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }] : []),
  ];

  return (
    <header className="bg-background/95 border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-4 shrink-0" aria-label="Home">
          <span className="text-3xl font-bold text-primary whitespace-nowrap">ShopSphere</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 ml-auto mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center gap-1 ${link.href === '/admin' ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative rounded-full">
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6 text-foreground hover:text-primary transition-colors duration-200" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full"
                  aria-label={`${itemCount} items in cart`}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {loading ? (
            <Skeleton className="h-9 w-24 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {isAdmin ? (
                    <ShieldCheck className="h-6 w-6 text-red-600 dark:text-red-400" />
                  ) : (
                    <UserCircle className="h-6 w-6 text-foreground" />
                  )}
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild className="hidden md:inline-flex rounded-full">
              <Link href="/login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
