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
    FileText,
    Users,
    TrendingUp,
    Brain,
    AlertCircle,
    CheckCircle,
    Activity,
    Filter
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
}

interface UserDiagnosis {
    id: number;
    user: User;
    mental_disorder: MentalDisorder | null;
    symptoms_reported: string[];
    recommendation: string | null;
    confidence_level: number;
    created_at: string;
    updated_at: string;
}

interface PaginationData {
    current_page: number;
    data: UserDiagnosis[];
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

interface Filters {
    confidence_levels: Record<string, string>;
    disorders: MentalDisorder[];
}

interface UserDiagnosesIndexProps {
    diagnoses: PaginationData;
    filters: Filters;
}

export default function UserDiagnosesIndex({ diagnoses, filters }: UserDiagnosesIndexProps) {
    const [search, setSearch] = useState('');
    const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
    const [disorderFilter, setDisorderFilter] = useState<string>('all');

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getConfidenceIcon = (confidence: number) => {
        if (confidence >= 80) return CheckCircle;
        if (confidence >= 60) return AlertCircle;
        return AlertCircle;
    };

    const filteredDiagnoses = diagnoses.data.filter(diagnosis => {
        const matchesSearch = !search || 
            diagnosis.user.name.toLowerCase().includes(search.toLowerCase()) ||
            diagnosis.user.email.toLowerCase().includes(search.toLowerCase()) ||
            diagnosis.mental_disorder?.name.toLowerCase().includes(search.toLowerCase()) ||
            diagnosis.mental_disorder?.code.toLowerCase().includes(search.toLowerCase());

        const matchesConfidence = confidenceFilter === 'all' || 
            (confidenceFilter === 'high' && diagnosis.confidence_level >= 80) ||
            (confidenceFilter === 'medium' && diagnosis.confidence_level >= 60 && diagnosis.confidence_level < 80) ||
            (confidenceFilter === 'low' && diagnosis.confidence_level < 60);

        const matchesDisorder = disorderFilter === 'all' || 
            diagnosis.mental_disorder?.id.toString() === disorderFilter;

        return matchesSearch && matchesConfidence && matchesDisorder;
    });

    const clearFilters = () => {
        setSearch('');
        setConfidenceFilter('all');
        setDisorderFilter('all');
    };

    const hasActiveFilters = search || confidenceFilter !== 'all' || disorderFilter !== 'all';

    return (
        <AppLayout>
            <Head title="User Diagnoses Management" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Diagnosis Pengguna</h1>
                        <p className="text-muted-foreground mt-2">
                            Monitor dan kelola hasil diagnosis pengguna sistem expert
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Diagnosis
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{diagnoses.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Diagnosis yang telah dibuat
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                High Confidence
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {diagnoses.data.filter(d => d.confidence_level >= 80).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Confidence ≥ 80%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(diagnoses.data.map(d => d.user.id)).size}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pengguna dengan diagnosis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg. Confidence
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {diagnoses.data.length > 0 
                                    ? Math.round(diagnoses.data.reduce((sum, d) => sum + d.confidence_level, 0) / diagnoses.data.length)
                                    : 0
                                }%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Rata-rata confidence level
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Diagnosis Table */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Daftar Diagnosis Pengguna</CardTitle>
                        <CardDescription>
                            Semua diagnosis yang telah dibuat oleh pengguna sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengguna atau diagnosis..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            
                            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter Confidence" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Confidence</SelectItem>
                                    {Object.entries(filters.confidence_levels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={disorderFilter} onValueChange={setDisorderFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter Gangguan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Gangguan</SelectItem>
                                    {filters.disorders.map((disorder) => (
                                        <SelectItem key={disorder.id} value={disorder.id.toString()}>
                                            {disorder.code} - {disorder.name}
                                        </SelectItem>
                                    ))}
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
                                        <TableHead>Diagnosis</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead>Gejala</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="w-[70px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDiagnoses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <p className="text-muted-foreground font-medium">
                                                            {hasActiveFilters 
                                                                ? 'Tidak ada diagnosis yang sesuai filter' 
                                                                : 'Belum ada diagnosis'
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
                                        filteredDiagnoses.map((diagnosis) => {
                                            const ConfidenceIcon = getConfidenceIcon(diagnosis.confidence_level);
                                            return (
                                                <TableRow key={diagnosis.id}>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{diagnosis.user.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {diagnosis.user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {diagnosis.mental_disorder ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <Badge variant="outline">
                                                                        {diagnosis.mental_disorder.code}
                                                                    </Badge>
                                                                    <Brain className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <p className="text-sm font-medium">
                                                                    {diagnosis.mental_disorder.name}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="secondary">Tidak Terdiagnosis</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <ConfidenceIcon className="h-4 w-4" />
                                                            <Badge className={getConfidenceBadgeColor(diagnosis.confidence_level)}>
                                                                {diagnosis.confidence_level}%
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                                            <Badge variant="secondary">
                                                                {diagnosis.symptoms_reported?.length || 0} gejala
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(diagnosis.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
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
                                                                    <Link href={`/admin/user-diagnoses/${diagnosis.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Lihat Detail
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {diagnoses.total > diagnoses.per_page && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {diagnoses.from} sampai {diagnoses.to} dari {diagnoses.total} diagnosis
                                </div>
                                <div className="flex items-center space-x-2">
                                    {diagnoses.prev_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(diagnoses.prev_page_url!)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    
                                    {diagnoses.links
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
                                    
                                    {diagnoses.next_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(diagnoses.next_page_url!)}
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
                                       