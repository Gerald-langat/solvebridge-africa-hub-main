import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.jpg" alt="Logo" className="h-14 w-14 mr-2 rounded-full" />
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent md:hidden lg:inline-block">
              SolveBridge Africa
            </div>
          </Link>

            
          <div className="hidden md:flex items-center space-x-4">

          
          {/* Desktop Navigation */}
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/programs" className="text-foreground hover:text-primary transition-colors">
              Programs
            </Link>
            <Link to="/impact" className="text-foreground hover:text-primary transition-colors">
              Impact
            </Link>
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
              Problems
            </Link>
            <Link to="/team" className="text-foreground hover:text-primary transition-colors">
              Team
            </Link>
             <Button variant="outline" size="sm" className="w-full" asChild>
                {user ? <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={async () => {
                      await signOut();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button> : <a href="/auth">Login / Sign Up</a>}  
              </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          
          <div className="md:hidden py-4 animate-fade-in-up">

            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                About
              </Link>
              <Link
                to="/programs"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Programs
              </Link>
              <Link
                to="/impact"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Impact
              </Link>
              <Link
                to="/explore"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Problems
              </Link>
              <Link
                to="/team"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Team
              </Link>
              <Button variant="outline" size="sm" className="w-full" asChild>
                {user ? <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={async () => {
                      await signOut();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button> : <a href="/auth">Login / Sign Up</a>}
                
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
