import React from 'react';
import { Link } from 'wouter';
import CleanDeviceInventory from '../components/device-inventory/clean-device-inventory';

export default function DeviceInventoryPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-xl font-bold mb-1">12. Device Inventory Tracking</h1>
        <p className="text-gray-600 text-sm mb-6">
          Track and manage your organization's devices to improve security visibility and control.
        </p>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <CleanDeviceInventory />
        </div>
      </div>
    </div>
  );
}