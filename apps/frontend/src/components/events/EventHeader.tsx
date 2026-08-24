'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  FaBell,
  FaChevronDown,
  FaRegUserCircle,
  FaSearch,
} from 'react-icons/fa';

interface EventHeaderProps {
  showHostSwitch?: boolean;
}

export default function EventHeader({ showHostSwitch = false }: EventHeaderProps) {
  return (
    <header className="border-b border-[#e8e1da] bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-5 py-5 lg:px-7">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/img/logo.png" alt="TrueStub" width={36} height={36} />
          <span className="text-[24px] font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            TrueStub
          </span>
        </Link>

        <div className="mx-auto hidden w-full max-w-[430px] items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-1.5 md:flex dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-900 shadow-sm dark:bg-slate-900 dark:text-white"
          >
            Rent
            <FaChevronDown className="h-3.5 w-3.5" />
          </button>
          <div className="mx-3 h-6 w-px bg-gray-300 dark:bg-slate-600" />
          <span className="text-sm text-gray-500 dark:text-gray-300">
            City, province or neighborhood
          </span>
          <FaSearch className="ml-auto h-4 w-4 text-gray-600 dark:text-gray-300" />
        </div>

        <div className="ml-auto flex items-center gap-5">
          {showHostSwitch && (
            <Link
              href="/dashboard/escrow-dashboard"
              className="hidden text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600 sm:block whitespace-nowrap"
            >
              Switch to Host view
            </Link>
          )}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="relative">
            <FaBell className="h-4 w-4 text-gray-900 dark:text-white" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-500" />
          </div>
          <span className="hidden text-sm font-semibold text-gray-900 lg:block dark:text-white">
            Randall Valenciano
          </span>
          <div className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800">
            <FaRegUserCircle className="h-5 w-5 text-gray-900 dark:text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
