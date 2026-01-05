'use client';

import { Menu, ChevronDown, LogOut, Check, Settings, Building2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { userRole } from '@/utils/interfaces/responses/user.response';
import GetBadge from './GetBadge';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';


interface User {
  name: string;
  avatarUrl: string;
  email: string;
}

export interface WorkspaceContext {
  workspaceId: string,
  workspaceName: string,
  role: userRole
}

interface TopbarProps {
  user: User;
  activeWorkspace: WorkspaceContext;
  workspaces: WorkspaceContext[];
  onWorkspaceChange: (workspaceId: string) => void;
  onMenuClick: () => void;
  onLogout: () => void;
}


export function Topbar({
  user,
  activeWorkspace,
  workspaces,
  onWorkspaceChange,
  onMenuClick,
  onLogout,
}: TopbarProps) {

  return (
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="md:hidden rounded-md p-2 hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo size="sm" />

          {/* ===== Workspace Dropdown ===== */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='focus:outline-0'>
                <button className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-orange-100  ">
                  <Building2 size={20}/>
                  <span className="text-sm font-medium text-black">
                    {activeWorkspace.workspaceName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-orange-600 " />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-60 bg-white border border-orange-200 rounded-lg"
              >
                <DropdownMenuLabel className='font-bold'>Workspaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {workspaces.map(ws => {
                  const isActive = ws.workspaceId === activeWorkspace.workspaceId;

                  return (
                    <DropdownMenuItem
                      key={ws.workspaceId}
                      disabled={isActive}
                      onClick={() => {
                        if (!isActive) {
                          onWorkspaceChange(ws.workspaceId);
                        }
                      }}
                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium text-gray-900">
                          {ws.workspaceName}
                        </span>
                      </div>

                      {isActive && (
                        <Check className="h-4 w-4 text-orange-600 ml-2" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Workspace Role Badge */}
          <span className="hidden md:inline-block rounded-full bg-accent-foreground px-3 py-1 text-xs font-semibold text-white dark:bg-orange-900/30">
            {activeWorkspace.role}
          </span>
        </div>

        {/* ================= RIGHT ================= */}
        <DropdownMenu >
          <DropdownMenuTrigger asChild className='focus:outline-0'>
            <button className="flex items-center gap-3 rounded-lg px-3 my-2 hover:bg-orange-50 transition-colors ">
              <GetBadge avatarUrl={user.avatarUrl} name={user.name} size={30} />
              <span className="hidden sm:inline text-sm font-medium text-gray-900">
                {user.name}
              </span>
              <ChevronDown className="h-4 w-4 text-orange-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-orange-200 rounded-lg"
          >
            <DropdownMenuLabel className='flex flex-col gap-y-1'>
              <span className=''>{user.name}</span>
              <span className='text-xs'>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
            >
              <Settings className="h-4 w-4 text-orange-600" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
            >
              <LogOut className="h-4 w-4 text-orange-600" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}



