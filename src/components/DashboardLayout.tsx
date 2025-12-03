import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, PlusCircle, Search, Settings, LogOut, Menu, Shield, Users, Target, DollarSign, Briefcase, BarChart } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/progress", label: "Progress", icon: TrendingUp },
    { path: "/submit-problem", label: "Submit Problem", icon: PlusCircle },
    { path: "/dashboard/explore", label: "Explore", icon: Search },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const adminNavItems = [
    { path: "/admin", label: "Admin Dashboard", icon: Shield },
    { path: "/admin/moderation", label: "Moderation", icon: Users },
    { path: "/admin/bounties", label: "Bounties", icon: Target },
    { path: "/admin/partners", label: "Partners", icon: DollarSign },
    { path: "/admin/projects", label: "Projects", icon: Briefcase },
    { path: "/admin/impact", label: "Impact Analytics", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">SolveBridge</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            {isAdmin && (
              <>
                <Separator className="my-2" />
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">Admin Panel</p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </>
            )}
           <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={async () => {
                await signOut();
                navigate("/"); // redirect to home
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </nav>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-card min-h-screen sticky top-0">
          <div className="p-6 border-b">
            <a href="/" className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SolveBridge
            </a>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">Admin Panel</p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={async () => {
                await signOut();
                navigate("/"); // redirect to home
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
