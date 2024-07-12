"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function Header() {
  const { open, close } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const handleWallet = () => {
    open();
  };

  return (
    <header className="flex items-center justify-between p-5 text-white bg-black">
      <div className="flex">
        {/* <Link href="/#">
          <img className="" src="/Token.png" />
        </Link> */}
        <Link
          href="/#"
          className="px-8 py-2 text-xs font-semibold border uppercas"
        >
          Home
        </Link>
        <div className="pt-1 pl-8">
          <Link
            href="/healthproviders"
            className="px-8 py-2 text-xs font-semibold uppercase border"
          >
            For Healthcare Provider
          </Link>
        </div>
        <div className="pt-1 pl-8">
          <Link
            href="/individuals"
            className="px-8 py-2 text-xs font-semibold uppercase border"
          >
            For Individuals
          </Link>
        </div>
      </div>
      <button
        className="px-8 py-2 text-xs font-semibold uppercase border"
        onClick={handleWallet}
      >
        {isConnected ? "Disconnect" : "Connect Wallet"}
      </button>
      {/* <div>
        <w3m-button />
      </div> */}
    </header>
  );
}
