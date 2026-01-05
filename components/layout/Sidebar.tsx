'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  CreditCard, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkspaceContext } from './Topbar'; 
import ProjectSection from './ProjectsSection';
 

export function Sidebar({ isOpen, onClose, activeWorkspace }: { isOpen: boolean; onClose: () => void, activeWorkspace: WorkspaceContext }) {
  const pathname = usePathname();  
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard/workspace',
      icon: LayoutDashboard,
    },
    {
      label: 'Projects',
      href: '/dashboard/projects',
      icon: Briefcase,
    },
    {
      label: 'Members',
      href: `/dashboard/members`,
      icon: Users,
    },
    {
      label: 'Audit Logs',
      href: '/dashboard/audit-logs',
      icon: FileText,
    },
    {
      label: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Dual Sidebar Container */}
      <div
        className={cn(
          'fixed md:static inset-y-0 left-0 flex h-screen min-w-65 border-r border-border bg-card shadow-lg transition-transform duration-300 z-50 md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Icon Rail */}
        <aside className="hidden h-full w-16 flex-col items-center justify-between border-r border-border bg-background py-5 md:flex">
          <div className="flex flex-col items-center gap-6">
            <nav className="flex flex-col items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={item.label}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors',
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:border-border hover:bg-accent'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </nav>
          </div> 
        </aside>

        {/* Workspace Navigator */}
        <ProjectSection workspaceId={activeWorkspace.workspaceId}/>
      </div>
    </>
  );
}
