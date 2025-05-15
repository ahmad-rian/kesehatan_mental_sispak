
export interface Role {
    name: string;
    display_name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: Role;
}

export interface AuthUser {
    user?: User;
}

// Page props yang include auth
export interface PageProps {
    auth: AuthUser;
    status?: string;
    error?: string;
    info?: string;
}

// Utility function untuk mengecek role
export const hasRole = (user: User | undefined, roleName: string): boolean => {
    return user?.role?.name === roleName;
};

export const isAdmin = (user: User | undefined): boolean => {
    return hasRole(user, 'admin');
};

export const getUserDisplayName = (user: User | undefined): string => {
    return user?.name || 'Guest';
};

export const getUserRoleDisplay = (user: User | undefined): string => {
    return user?.role?.display_name || 'User';
};