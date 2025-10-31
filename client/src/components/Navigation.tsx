import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Menu, X, ShoppingCart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-heading" data-testid="link-logo">
            Stootap
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/students"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-students"
            >
              For Students
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-services"
            >
              For Businesses
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-contact"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-login"
            >
              Login
            </Link>
            <Button asChild data-testid="button-signup">
              <Link href="/register">Sign Up</Link>
            </Button>
            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="relative" aria-label="View cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle-mobile"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              href="/students"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-students-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Students
            </Link>
            <Link
              href="/services"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-services-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Businesses
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-contact-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-login-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Button asChild className="w-full" data-testid="button-signup-mobile">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
