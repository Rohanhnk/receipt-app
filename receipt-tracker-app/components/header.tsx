"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div
      className={`p-4 flex justify-between items-center ${isHomePage ? "bg-blue-50" : "bg-white border-b border-blue-50"}`}
    >
      <Link href="/" className="flex items-center">
        <Shield className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-xl font-semibold">Expnesio</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/receipts">
            <Button variant="outline">My Receipts</Button>
          </Link>

          <Link href="/manage-plan">
            <Button>Manage Plan</Button>
          </Link>

          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button>Login</button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
