import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, User, Briefcase, Building2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CartSheet } from "@/components/CartSheet";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchWithAuth("/api/me");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUserName(data.fullName || data.email || "User");
          setUserRole(data.role || null);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-heading bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity" data-testid="link-logo">
            Stootap
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {/* Packages - Highlighted with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-orange-500 hover:to-amber-400 transition-all duration-200 flex items-center gap-1.5"
                  data-testid="button-packages"
                >
                  Packages
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/packages" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Company Packages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentorship" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    1-on-1 Mentorship
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/students"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-200"
              data-testid="link-students"
            >
              For Students
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-200"
              data-testid="link-services"
            >
              For Businesses
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-200"
              data-testid="link-contact"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted/50 transition-all duration-200 rounded-full px-4" data-testid="button-profile">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{userName?.split(" ")[0] || "Account"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {/* Student-specific options */}
                  {userRole === "student" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/student/dashboard" className="flex items-center gap-2 cursor-pointer">
                          <Briefcase className="h-4 w-4" />
                          Student Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Business-specific options */}
                  {userRole === "business" && (
                    <DropdownMenuItem asChild>
                      <Link href="/business/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <Building2 className="h-4 w-4" />
                        Business Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Company-specific options */}
                  {userRole === "company" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Company</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/company/dashboard" className="flex items-center gap-2 cursor-pointer">
                          <Building2 className="h-4 w-4" />
                          Company Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/company/post-job" className="flex items-center gap-2 cursor-pointer">
                          <Briefcase className="h-4 w-4" />
                          Post Job
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Show company registration for non-company users */}
                  {userRole && userRole !== "company" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Company</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/company/register" className="flex items-center gap-2 cursor-pointer">
                          <Building2 className="h-4 w-4" />
                          Register as Company
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
            <CartSheet />
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
            {/* Packages - Highlighted */}
            <div className="space-y-2">
              <Link
                href="/packages"
                className="block text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md"
                data-testid="link-packages-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                Company Packages
              </Link>
              <Link
                href="/mentorship"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors pl-4"
                data-testid="link-mentorship-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                1-on-1 Mentorship
              </Link>
            </div>
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
            {isLoggedIn ? (
              <>
                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground px-1">Account</p>
                  <Link
                    href="/profile"
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {userRole === "student" && (
                    <Link
                      href="/student/dashboard"
                      className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Student Dashboard
                    </Link>
                  )}

                  {userRole === "business" && (
                    <Link
                      href="/business/dashboard"
                      className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Business Dashboard
                    </Link>
                  )}

                  {userRole === "company" && (
                    <>
                      <p className="text-sm text-muted-foreground px-1 mt-4">Company</p>
                      <Link
                        href="/company/dashboard"
                        className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Company Dashboard
                      </Link>
                      <Link
                        href="/company/post-job"
                        className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Post Job
                      </Link>
                    </>
                  )}

                  {userRole && userRole !== "company" && (
                    <>
                      <p className="text-sm text-muted-foreground px-1 mt-4">Company</p>
                      <Link
                        href="/company/register"
                        className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register as Company
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export { Navigation };
