"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setPreference } from "@/lib/client/setPreference";

type Props = {
  themeNames: {
    light: string;
    dark: string;
    system: string;
  };
  label: string;
};

export function ModeToggle({ themeNames, label }: Props) {
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme);

    // // 🔐 Persist preference
    // setPreference({
    //   identifier: "email",        // or "phoneNumber"
    //   email: undefined,           // backend resolves via session
    //   key: "theme",
    //   value: theme,
    // });
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            {themeNames.light}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            {themeNames.dark}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            {themeNames.system}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
