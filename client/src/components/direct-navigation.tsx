import React from 'react';
import { Link } from 'wouter';

export default function DirectNavigation() {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 shadow-lg rounded-lg border border-gray-300">
      <h3 className="font-bold text-gray-700 mb-2">Quick Navigation</h3>
      <div className="flex flex-col space-y-2">
        <Link href="/">
          <a className="text-blue-600 hover:underline">Home</a>
        </Link>
        <Link href="/rasbita">
          <a className="text-blue-600 hover:underline">RASBITA Report</a>
        </Link>
        <Link href="/rasbita-governance">
          <a className="text-blue-600 hover:underline">RASBITA Governance</a>
        </Link>
        <Link href="/threat-modeling">
          <a className="text-blue-600 hover:underline">Threat Modeling</a>
        </Link>
        <Link href="/about-us">
          <a className="text-blue-600 hover:underline">About Us</a>
        </Link>
      </div>
    </div>
  );
}