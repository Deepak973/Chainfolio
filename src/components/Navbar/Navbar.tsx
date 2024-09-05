/* eslint-disable @next/next/no-img-element */
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="bg-black">
      <>
        <div className="mx-auto px-2 sm:px-10 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="/">
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/logo.png`}
                  alt="Logo"
                  className="h-12 w-auto"
                />
              </a>
            </div>

            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
