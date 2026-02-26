'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  FolderKanban,
  CheckSquare,
  Brain,
  CheckCircle,
  Calendar,
  Landmark,
  Lock,
  Zap,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/memory', label: 'Memory', icon: Brain },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle },
  { href: '/this-week', label: 'This Week', icon: Calendar },
  { href: '/council', label: 'Council', icon: Landmark, comingSoon: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        w-60 h-full bg-[#111111] border-r border-[#1e1e1e] flex flex-col
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        {/* Logo */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#1e1e1e]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-[15px] text-white">Harper OS</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const disabled = item.comingSoon;

            if (disabled) {
              return (
                <div
                  key={item.href}
                  className="group relative flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 cursor-not-allowed"
                  title="Coming Soon"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-sm">{item.label}</span>
                  <Lock className="h-3 w-3 ml-auto opacity-50" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1e1e1e] rounded text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Coming Soon
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${active ? 'text-amber-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-[#1e1e1e]">
          <div className="text-[11px] text-slate-600">
            Harper OS v2.0
          </div>
        </div>
      </aside>
    </>
  );
}
