"use client";

import Link from "next/link";
import { Navigation } from "./Navigation";
import Image from "next/image";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";

export const Header = () => {
  return (
    <div>
      <Container>
        <div className="flex justify-between gap-x-6 items-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />

          <div className="hidden md:block">
            <Navigation />
          </div>

          <MobileMenu />
        </div>
      </Container>
    </div>
  );
};
