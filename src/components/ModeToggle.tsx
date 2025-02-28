"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  themeNames: {
    light: string,
    dark: string,
    system: string,
  },
  label: string,
}

export function ModeToggle({ themeNames, label }: Props) {
  const { setTheme } = useTheme()

  //   video. We also have to change the Link to use the one from i18n in order to solve the issue I had with clicking links in the nav bar.


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          { themeNames.light }
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          { themeNames.dark }
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          { themeNames.system }
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
