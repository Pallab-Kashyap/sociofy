"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({
  className,
}: SearchFieldProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = e.currentTarget;
    const q = (formData.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action={"/search"} className={cn("relative", className)}>
      <div className="relative">
        <Input name="q" type="text" placeholder="Search..." className="pr-10" />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
          aria-label="Search"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
