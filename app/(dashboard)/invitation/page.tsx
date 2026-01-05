'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { InivitationService } from '@/services/invitation.service';
import { Mail, Building2, Shield, User, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ApiException } from '@/lib/http/errors';

interface InvitationData {
    id: string;
    senderEmail: string;
    workspaceName: string;
    role: 'MEMBER' | 'ADMIN';
}

interface GetInvitationResponse {
    invitationData: InvitationData;
}

const Page = () => {
    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<'accept' | 'decline' | null>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                setLoading(true);
                const response = await InivitationService.getInvitation();
                if (response) {
                    setInvitation(response.invitationData);
                }
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message)
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, []);

    const handleAccept = async () => {
        try {
            setActionLoading('accept');
            // Call accept invitation API
            // await InivitationService.acceptInvitation();
            setStatus('success');
            setTimeout(() => {
                // Redirect to workspace or dashboard
                window.location.href = '/dashboard/workspace';
            }, 2000);
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            setStatus('error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async () => {
        try {
            setActionLoading('decline');
            // Call decline invitation API
            // await InivitationService.declineInvitation();
            setStatus('success');
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error('Failed to decline invitation:', error);
            setStatus('error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleButtonAction = async (action: "ACCEPT" | "DECLINE") => {
        if (!invitation) {
            return;
        }
        setActionLoading('accept')
        if (action === "ACCEPT") {
            try {
                await InivitationService.updateInvitation({
                    id: invitation?.id,
                    action: "ACCEPTED"
                })
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message)
                }
            }
        } else {
            try {
                await InivitationService.updateInvitation({
                    id: invitation?.id,
                    action: "DECLINED"
                })
            } catch (error) {
                if (error instanceof ApiException) {
                    toast.error(error.message)
                }
            }
        }
        setActionLoading(null);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-accent-foreground font-medium">Loading your invitation...</p>
                </div>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 text-center border border-gray-200 rounded-lg shadow-sm">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-accent-foreground mb-2">No Invitations</h2>
                    <p className="text-gray-600 mb-6">You don't have any pending invitations at the moment.</p>
                    <Button onClick={() => window.location.href = '/dashboard'} className="w-full bg-foreground hover:bg-foreground/90 text-white">
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const roleConfig = {
        ADMIN: {
            icon: Shield,
            label: 'Admin',
            color: 'bg-white border border-gray-200',
            badgeColor: 'bg-foreground text-white',
            description: 'Full access to workspace settings and member management',
        },
        MEMBER: {
            icon: User,
            label: 'Member',
            color: 'bg-white border border-gray-200',
            badgeColor: 'bg-foreground text-white',
            description: 'Collaborate on workspace projects and tasks',
        },
    };

    const roleInfo = roleConfig[invitation.role];
    const RoleIcon = roleInfo.icon;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Side - Info Display */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-linear-to-br from-gray-50 to-white border-r border-gray-200">
                    <div className="max-w-md w-full space-y-8">
                        {/* Icon & Title */}
                        <div className="text-center space-y-3">
                            <div className="text-6xl">🎉</div>
                            <h1 className="text-4xl font-bold text-accent-foreground">You're Invited!</h1>
                            <p className="text-gray-600 text-lg">Join the team</p>
                        </div>

                        {/* Workspace Info */}
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Building2 className="w-5 h-5 text-accent-foreground" />
                                    <span className="text-sm font-medium text-accent-foreground">Workspace</span>
                                </div>
                                <h2 className="text-2xl font-bold ">{invitation.workspaceName}</h2>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-5 h-5 text-accent-foreground" />
                                    <span className="text-sm font-medium text-accent-foreground">Invited By</span>
                                </div>
                                <p className="text-xl font-semibold truncate">{invitation.senderEmail}</p>
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <RoleIcon className="w-6 h-6 text-accent-foreground" />
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleInfo.badgeColor}`}>
                                    {roleInfo.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{roleInfo.description}</p>
                        </div>

                        {/* Footer Note */}
                        <p className="text-center text-xs text-gray-500">
                            Expires in 30 days
                        </p>
                    </div>
                </div>

                {/* Right Side - Action */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white">
                    <div className="max-w-md w-full space-y-6">
                        {/* Status Message */}
                        {status === 'success' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in">
                                <CheckCircle2 className="w-5 h-5 text-accent-foreground shrink-0" />
                                <p className="text-accent-foreground font-medium">Success! Redirecting...</p>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in">
                                <XCircle className="w-5 h-5 text-gray-500 shrink-0" />
                                <p className="text-gray-700 font-medium">Something went wrong</p>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-accent-foreground mb-2">Ready to join?</h2>
                                <p className="text-gray-600">Accept or decline this invitation to get started.</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    onClick={() => handleButtonAction("ACCEPT")}
                                    disabled={actionLoading !== null}
                                    className="w-full h-12 text-base font-semibold  text-white rounded-lg transition-all"
                                >
                                    {actionLoading === 'accept' ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Accepting...
                                        </div>
                                    ) : (
                                        'Accept Invitation'
                                    )}
                                </Button>
                                <Button
                                    onClick={() => handleButtonAction("DECLINE")}
                                    disabled={actionLoading !== null}
                                    variant="outline"
                                    className="w-full h-12 text-base font-semibold border border-gray-200 text-accent-foreground hover:bg-gray-50 rounded-lg transition-all"
                                >
                                    {actionLoading === 'decline' ? 'Processing...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page; 