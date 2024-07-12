"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-between min-h-screen">
      <img src="bg1.png" />
      <div className="absolute pt-12 pr-12 text-3xl font-semibold text-black uppercase cursor-pointer right-20 top-64">
        <h1 className="p-2 pl-16 font-extrabold text-7xl">Welcome to D-RX</h1>
        <p className="p-2 pb-3 pl-24">decentralized prescription management </p>
        <div className="flex">
          <Link href="/healthproviders">
            <button className="px-6 py-2 uppercase bg-yellow-500 border rounded-full hover:bg-yellow-600 ">
              For Healthcare Providers
            </button>
          </Link>
          <div className="px-2"></div>
          <Link href="/individuals">
            <button className="px-6 py-2 uppercase bg-yellow-500 border rounded-full cursor-pointer hover:bg-yellow-600">
              For Individuals
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
