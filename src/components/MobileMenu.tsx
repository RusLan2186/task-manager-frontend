"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Navigation } from "./Navigation";
import { Button } from "./ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-70 pt-12 md:hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6">
          <Navigation isMobile onNavigate={() => setIsMenuOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
