import Link from "next/link";
import { Navigation } from "./Navigation";
import Image from "next/image";
import { Container } from "./Container";


export const Header = () => {
  return (
    <div>

      <Container>
      <div className="flex justify-between items-center">
        <Link className="text-green-600 font-bold" href="/">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </Link>

        <div>
          <Navigation />
        </div>
      </div>
      </Container>
    </div>
  );
};
