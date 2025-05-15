import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: {
        name: string;
        display_name: string;
    };
}

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    user?: User;
}

export default function PublicLayout({ children, title = 'Kesehatan Mental Unsoed', user }: PublicLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar user={user} />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}