import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { 
  CheckCircle2, 
  Users, 
  FolderKanban, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Benefit {
  text: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Organize work into projects with customizable workflows and task boards.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, assign tasks, and track progress together.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Get actionable insights on team productivity and project health.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Control who can view, edit, and manage with granular permissions.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Summaries',
    description: 'Get intelligent task summaries and workload recommendations.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Built for speed with real-time updates across your entire team.',
  },
] as const;

const BENEFITS: readonly Benefit[] = [
  { text: 'Unlimited projects and tasks' },
  { text: 'Multi-workspace support' },
  { text: 'Audit logs and compliance' },
  { text: 'Priority support' },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="md" />
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="default" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="default" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 lg:py-20">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge variant="secondary" className="mb-6 px-3 py-1.5 text-sm font-medium">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI-powered task management for modern teams
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Manage work across your entire organization
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            WorkLune is a multi-tenant task management platform that helps teams organize projects, 
            track progress, and collaborate effectively across workspaces.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="min-w-[180px] h-12">
              <Link href="/signup">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="min-w-[180px] h-12">
              <Link href="/login">View demo</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Multi-workspace support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4 sm:text-4xl">
              Everything you need to manage work
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for teams of all sizes, from startups to enterprises.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="border-border bg-card hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section> 
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:py-20 lg:py-24">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto bg-card border-border shadow-sm">
            <CardContent className="p-8 sm:p-10 md:p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    Ready to get started?
                  </h2>
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    Join thousands of teams already using WorkLune to streamline their workflow 
                    and boost productivity across multiple workspaces.
                  </p>
                  <ul className="space-y-3" role="list">
                    {BENEFITS.map((benefit) => (
                      <li 
                        key={benefit.text} 
                        className="flex items-center gap-2.5 text-sm text-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
                  <Button size="lg" asChild className="w-full h-12">
                    <Link href="/signup">Create free account</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    No credit card required • Free forever
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WorkLune. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
