import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Smartphone, BarChart3, Settings } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/apps", icon: Smartphone, label: "Apps" },
    { path: "/history", icon: BarChart3, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
