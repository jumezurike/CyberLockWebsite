import React from 'react';
import { Link } from 'wouter';

export default function DirectNavigation() {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 shadow-lg rounded-lg border border-gray-300">
      <h3 className="font-bold text-gray-700 mb-2">Quick Navigation</h3>
      <div className="flex flex-col space-y-2">
        <Link href="/">
          <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
        </Link>
        <Link href="/rasbita">
          <span className="text-blue-600 hover:underline cursor-pointer">RASBITA Report</span>
        </Link>
        <Link href="/rasbita-governance">
          <span className="text-blue-600 hover:underline cursor-pointer">RASBITA Governance</span>
        </Link>
        <Link href="/threat-modeling">
          <span className="text-blue-600 hover:underline cursor-pointer">Threat Modeling (Overview)</span>
        </Link>
        <Link href="/threat-modeling-full">
          <span className="text-blue-600 hover:underline cursor-pointer">Threat Modeling (4-Step STRIDE)</span>
        </Link>
        <Link href="/about-us">
          <span className="text-blue-600 hover:underline cursor-pointer">About Us</span>
        </Link>
      </div>
    </div>
  );
}