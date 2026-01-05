"use client";

import { useEffect, useState } from 'react'; 
import { Sidebar } from '@/components/layout/Sidebar';
import { useUserDataQuery } from '@/utils/queries/user.queries';
import { Topbar } from '@/components/layout/Topbar';
import { useWorkspaceStore } from '@/store/userDataStore'; 

const Layout = ({ children }: { children: React.ReactNode; }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
    const { setUserData, userStoreData,currentWorkspace,setCurrentWorkspace } = useWorkspaceStore();
    const { data, isLoading } = useUserDataQuery(); 
    useEffect(() => {
        if (data) {
            setUserData(data);
        }
    }, [data]);

    useEffect(() => {  
        if(data) {
            if(data?.userData?.defaultWorkspaceId && !currentWorkspace){
                setCurrentWorkspace(data.workspaceData.find(w => w.workspaceId === data.userData.defaultWorkspaceId)!);
            } else {
                setCurrentWorkspace(data.workspaceData[0]);
            }
        }
    }, [data?.userData.defaultWorkspaceId, data]) 

    if (isLoading) {
        return <div>
            Loading
        </div>
    }
    if (!data || !data.workspaceData || !userStoreData || !currentWorkspace) {
        return
    }

    const workspaceChange = (workspaceId: string) => {
        setCurrentWorkspace(data.workspaceData.find(w => w.workspaceId === workspaceId)!); 
    }
    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Topbar */}
            <Topbar
                user={userStoreData.userData}
                activeWorkspace={currentWorkspace}
                workspaces={data.workspaceData}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                onLogout={() => null}
                onWorkspaceChange={workspaceChange}
            />

            {/* Main Content Area with Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    activeWorkspace={currentWorkspace}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;