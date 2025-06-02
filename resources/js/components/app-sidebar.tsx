import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Brain, 
    Users, 
    Activity, 
    Settings, 
    FileText, 
    TestTube,
    Stethoscope,
    Zap,
    Database,
    BarChart3,
    History,
    Folder
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Gangguan Mental',
        href: '/admin/mental-disorders',
        icon: Stethoscope,
        group: 'expert',
    },
    {
        title: 'Gejala',
        href: '/admin/symptoms',
        icon: Activity,
        group: 'expert',
    },
    {
        title: 'Aturan Diagnosis',
        href: '/admin/diagnosis-rules',
        icon: Zap,
        group: 'expert',
    },
    {
        title: 'Test Sistem',
        href: '/admin/test-system',
        icon: TestTube,
        group: 'expert',
    },
    {
        title: 'User Diagnoses',
        href: '/admin/user-diagnoses',
        icon: FileText,
        group: 'data',
    },
    {
        title: 'Consultations',
        href: '/admin/consultations',
        icon: History,
        group: 'data',
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        group: 'data',
    },
    {
        title: 'System Reports',
        href: '/admin/reports',
        icon: BarChart3,
        group: 'analytics',
    },
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
        group: 'analytics',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
        external: true,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: FileText,
        external: true,
    },
];

const groupConfig = {
    expert: {
        title: 'Expert System',
        icon: Brain,
        color: 'text-purple-600'
    },
    data: {
        title: 'Data Management',
        icon: Database,
        color: 'text-green-600'
    },
    analytics: {
        title: 'Analytics & Reports',
        icon: BarChart3,
        color: 'text-orange-600'
    }
};

export function AppSidebar() {
    const { url } = usePage();

   
    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return url === '/admin/dashboard';
        }
        return url.startsWith(href);
    };

   
    const groupedNavItems = adminNavItems.reduce((groups, item) => {
        const group = item.group || 'ungrouped';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {} as Record<string, NavItem[]>);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link 
                                href="/admin/dashboard" 
                                className="flex items-center gap-2"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain 
                    groupedItems={groupedNavItems}
                    groupConfig={groupConfig}
                    isActive={isActive}
                />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}