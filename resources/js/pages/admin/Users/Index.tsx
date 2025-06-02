import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Search, 
    MoreHorizontal, 
    Eye, 
    Users,
    Activity,
    Brain,
    Shield,
    Mail,
    Calendar,
    Filter,
    TrendingUp,
    UserCheck,
    Download
} from 'lucide-react';

interface Role {
    id: number;
    name: string;
    display_name: string;
}

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
}

interface LatestDiagnosis {
    id: number;
    confidence_level: number;
    created_at: string;
    mental_disorder: MentalDisorder;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    provider: string;
    email_verified_at: string | null;
    created_at: string;
    role: Role;
    latest_diagnosis?: LatestDiagnosis;
    diagnoses_count: number;
    consultations_count: number;
}

interface PaginationData {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface AdminUsersIndexProps {
    users: PaginationData;
}

export default function AdminUsersIndex({ users }: AdminUsersIndexProps) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getConfidenceText = (confidence: number) => {
        if (confidence >= 80) return 'Tinggi';
        if (confidence >= 60) return 'Sedang';
        return 'Rendah';
    };

    const getProviderBadge = (provider: string) => {
        const colors = {
            google: 'bg-red-100 text-red-800',
            email: 'bg-blue-100 text-blue-800'
        };
        return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getRoleBadgeColor = (roleName: string) => {
        return roleName === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    };

    const filteredUsers = users.data.filter(user => {
        const matchesSearch = !search || 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role.name === roleFilter;

        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'verified' && user.email_verified_at) ||
            (statusFilter === 'unverified' && !user.email_verified_at) ||
            (statusFilter === 'active' && user.consultations_count > 0) ||
            (statusFilter === 'inactive' && user.consultations_count === 0);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = search || roleFilter !== 'all' || statusFilter !== 'all';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola data pengguna sistem kesehatan mental
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pengguna
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pengguna terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pengguna Aktif
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter(user => user.consultations_count > 0).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pernah konsultasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dengan Diagnosis
                            </CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter(user => user.latest_diagnosis).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Sudah terdiagnosis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Admin
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter(user => user.role.name === 'admin').length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Administrator sistem
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <CardDescription>
                            Semua pengguna yang terdaftar dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="verified">Terverifikasi</SelectItem>
                                    <SelectItem value="unverified">Belum Verifikasi</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    <Filter className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Role & Status</TableHead>
                                        <TableHead>Aktivitas</TableHead>
                                        <TableHead>Diagnosis Terakhir</TableHead>
                                        <TableHead>Bergabung</TableHead>
                                        <TableHead className="w-[70px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <Users className="h-8 w-8 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <p className="text-muted-foreground font-medium">
                                                            {hasActiveFilters 
                                                                ? 'Tidak ada pengguna yang sesuai filter' 
                                                                : 'Belum ada pengguna'
                                                            }
                                                        </p>
                                                        {hasActiveFilters && (
                                                            <Button 
                                                                variant="link" 
                                                                onClick={clearFilters}
                                                                className="mt-2"
                                                            >
                                                                Hapus semua filter
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            {user.avatar ? (
                                                                <img
                                                                    className="h-8 w-8 rounded-full"
                                                                    src={user.avatar}
                                                                    alt={user.name}
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-white">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-sm">{user.name}</p>
                                                            <div className="flex items-center space-x-1">
                                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                                <p className="text-xs text-muted-foreground">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-2">
                                                        <Badge className={getRoleBadgeColor(user.role.name)}>
                                                            {user.role.display_name}
                                                        </Badge>
                                                        <div className="flex flex-wrap gap-1">
                                                            <Badge 
                                                                variant="outline"
                                                                className={getProviderBadge(user.provider)}
                                                            >
                                                                {user.provider === 'google' ? 'Google' : 'Email'}
                                                            </Badge>
                                                            {user.email_verified_at && (
                                                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                    <UserCheck className="w-3 h-3 mr-1" />
                                                                    Verified
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <div className="text-center">
                                                                <div className="font-medium">{user.consultations_count}</div>
                                                                <div className="text-xs text-muted-foreground">Konsultasi</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="font-medium">{user.diagnoses_count}</div>
                                                                <div className="text-xs text-muted-foreground">Diagnosis</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {user.latest_diagnosis ? (
                                                        <div className="space-y-2">
                                                            <div className="text-sm font-medium">
                                                                {user.latest_diagnosis.mental_disorder.name}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Badge className={getConfidenceBadgeColor(user.latest_diagnosis.confidence_level)}>
                                                                    {getConfidenceText(user.latest_diagnosis.confidence_level)}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {user.latest_diagnosis.confidence_level}%
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDate(user.latest_diagnosis.created_at)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Belum ada diagnosis
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{formatDate(user.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/users/${user.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.total > users.per_page && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {users.from} sampai {users.to} dari {users.total} pengguna
                                </div>
                                <div className="flex items-center space-x-2">
                                    {users.prev_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(users.prev_page_url!)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    
                                    {users.links
                                        .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    
                                    {users.next_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(users.next_page_url!)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}