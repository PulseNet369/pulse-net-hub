
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Tokens", href: "/tokens" },
  { name: "Index", href: "/index" },
  { name: "Liquidity Pools", href: "/liquidity-pools" },
  { name: "Info", href: "/info" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Mock PulseNet price - in a real app, this would come from an API
  const pulseNetPrice = "$0.00012";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-pink-500/20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gradient-pulse">
              PulseNet Ecosystem
            </Link>
          </div>

          {/* PulseNet Price */}
          <div className="hidden md:flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-lg">
            <span className="text-sm text-muted-foreground">PulseNet:</span>
            <span className="text-sm font-semibold text-primary">{pulseNetPrice}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-pink-500/20">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile PulseNet Price */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">PulseNet:</span>
                    <span className="text-sm font-semibold text-primary">{pulseNetPrice}</span>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 text-lg font-medium transition-colors hover:text-primary rounded-lg ${
                        location.pathname === item.href
                          ? "text-primary bg-muted/50"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
