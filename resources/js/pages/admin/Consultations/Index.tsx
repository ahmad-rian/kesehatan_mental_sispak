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
import { Progress } from '@/components/ui/progress';
import { 
    Search, 
    MoreHorizontal, 
    Eye, 
    History,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    PlayCircle,
    Brain,
    Activity,
    TrendingUp,
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
    mental_disorder: MentalDisorder | null;
    confidence_level: number;
}

interface Consultation {
    id: number;
    user: User;
    consultation_flow: Array<{
        type: string;
        question?: string;
        answer?: any;
        symptom_code?: string;
        timestamp: string;
    }>;
    status: 'in_progress' | 'completed' | 'abandoned';
    final_diagnosis: UserDiagnosis | null;
    created_at: string;
    updated_at: string;
}

interface PaginationData {
    current_page: number;
    data: Consultation[];
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

interface StatusOptions {
    [key: string]: string;
}

interface ConsultationsIndexProps {
    consultations: PaginationData;
    status_options: StatusOptions;
}

export default function ConsultationsIndex({ consultations, status_options }: ConsultationsIndexProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'abandoned': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'in_progress': return PlayCircle;
            case 'abandoned': return XCircle;
            default: return Clock;
        }
    };

    const getProgressPercentage = (consultation: Consultation): number => {
        const totalSteps = consultation.consultation_flow?.length || 0;
        const expectedSteps = 10; // Estimasi jumlah pertanyaan maksimal
        return Math.min(100, (totalSteps / expectedSteps) * 100);
    };

    const getReportedSymptoms = (consultation: Consultation): string[] => {
        const symptoms: string[] = [];
        const flow = consultation.consultation_flow || [];

        for (const step of flow) {
            if (
                step.type === 'symptom_question' &&
                step.answer === true &&
                step.symptom_code
            ) {
                symptoms.push(step.symptom_code);
            }
        }

        return [...new Set(symptoms)]; // Remove duplicates
    };

    const filteredConsultations = consultations.data.filter(consultation => {
        const matchesSearch = !search || 
            consultation.user.name.toLowerCase().includes(search.toLowerCase()) ||
            consultation.user.email.toLowerCase().includes(search.toLowerCase()) ||
            consultation.id.toString().includes(search);

        const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
    };

    const hasActiveFilters = search || statusFilter !== 'all';

    // Calculate stats from current page data
    const statsData = {
        total: consultations.total,
        completed: consultations.data.filter(c => c.status === 'completed').length,
        inProgress: consultations.data.filter(c => c.status === 'in_progress').length,
        abandoned: consultations.data.filter(c => c.status === 'abandoned').length,
        avgProgress: consultations.data.length > 0 
            ? Math.round(consultations.data.reduce((sum, c) => sum + getProgressPercentage(c), 0) / consultations.data.length)
            : 0
    };

    return (
        <AppLayout>
            <Head title="Consultations Management" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Konsultasi</h1>
                        <p className="text-muted-foreground mt-2">
                            Monitor dan kelola riwayat konsultasi pengguna sistem expert
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Konsultasi
                            </CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Semua konsultasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Selesai
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statsData.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Konsultasi selesai
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Berlangsung
                            </CardTitle>
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{statsData.inProgress}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Sedang konsultasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rata-rata Progress
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.avgProgress}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Progress konsultasi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Consultations Table */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Daftar Konsultasi</CardTitle>
                        <CardDescription>
                            Riwayat dan status semua konsultasi pengguna
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengguna atau ID konsultasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(status_options).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
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
                                        <TableHead>ID</TableHead>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Diagnosis</TableHead>
                                        <TableHead>Gejala</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="w-[70px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredConsultations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <History className="h-8 w-8 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <p className="text-muted-foreground font-medium">
                                                            {hasActiveFilters 
                                                                ? 'Tidak ada konsultasi yang sesuai filter' 
                                                                : 'Belum ada konsultasi'
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
                                        filteredConsultations.map((consultation) => {
                                            const StatusIcon = getStatusIcon(consultation.status);
                                            const progress = getProgressPercentage(consultation);
                                            const reportedSymptoms = getReportedSymptoms(consultation);
                                            
                                            return (
                                                <TableRow key={consultation.id}>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-mono">
                                                            #{consultation.id}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{consultation.user.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {consultation.user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <StatusIcon className="h-4 w-4" />
                                                            <Badge className={getStatusBadgeColor(consultation.status)}>
                                                                {status_options[consultation.status]}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm">{progress}%</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {consultation.consultation_flow?.length || 0} steps
                                                                </span>
                                                            </div>
                                                            <Progress value={progress} className="h-2" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {consultation.final_diagnosis ? (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <Brain className="h-4 w-4 text-muted-foreground" />
                                                                    <Badge variant="outline">
                                                                        {consultation.final_diagnosis.mental_disorder?.code}
                                                                    </Badge>
                                                                </div>
                                                                <Badge className={
                                                                    consultation.final_diagnosis.confidence_level >= 80 
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : consultation.final_diagnosis.confidence_level >= 60
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }>
                                                                    {consultation.final_diagnosis.confidence_level}%
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="secondary">Belum Selesai</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                                            <Badge variant="secondary">
                                                                {reportedSymptoms.length} gejala
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(consultation.created_at).toLocaleDateString('id-ID', {
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
                                                                    <Link href={`/admin/consultations/${consultation.id}`}>
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
                        {consultations.total > consultations.per_page && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {consultations.from} sampai {consultations.to} dari {consultations.total} konsultasi
                                </div>
                                <div className="flex items-center space-x-2">
                                    {consultations.prev_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(consultations.prev_page_url!)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    
                                    {consultations.links
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
                                    
                                    {consultations.next_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(consultations.next_page_url!)}
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