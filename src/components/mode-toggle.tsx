"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 text-muted-foreground ${isDark ? "opacity-50" : "opacity-100 text-yellow-600"}`} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) =>
          setTheme(checked ? "dark" : "light")
        }
        aria-label="Toggle theme"
        
      >
        
      </Switch>
      <Moon className={`h-4 w-4 text-muted-foreground ${isDark ? "opacity-100 text-gray-300" : "opacity-50"}`}  />
    </div>
  );
}
