import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#E0E0E0] placeholder:text-[#A0A0A0] selection:bg-[#A239CA] selection:text-white dark:bg-[#3A3A5A]/30 border-[#4A4A7A] flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm shadow-[#A239CA]/10 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#A239CA] focus-visible:ring-[#A239CA]/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
