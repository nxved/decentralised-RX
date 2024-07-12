"use client";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  return (
    <>
      <div className="justify-center pt-20 text-5xl font-semibold text-left text-center text-black uppercase"></div>
      <div className="flex justify-center p-10">
        <div className="max-w-sm overflow-hidde">
          <Link href="/healthproviders/hospital">
            <img
              src="/hospital.png"
              className="h-[350px] w-[384px] object-cover rounded-md"
            />
            <div className="p-8 text-center bg-yellow-500 border border-black cursor-pointer">
              Hospital
            </div>
          </Link>
        </div>
        <div className="pl-8">
          <div className="max-w-sm overflow-hidden bg-yellow-500">
            <Link href="/healthproviders/pharmcy">
              <img src="/pharmcy.png" className="h-[350px]" />
              <div className="p-8 text-center uppercase border border-black cursor-pointer">
                Pharmacy
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
