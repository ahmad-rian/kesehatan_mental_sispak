import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    ArrowLeft,
    User as UserIcon,
    Mail,
    Calendar,
    Shield,
    Brain,
    Activity,
    History,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    Eye,
    BarChart3,
    UserCheck
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface UserDiagnosis {
    id: number;
    mental_disorder: MentalDisorder;
    confidence_level: number;
    created_at: string;
    symptoms_reported: string[];
}

interface FinalDiagnosis {
    id: number;
    mental_disorder: MentalDisorder;
    confidence_level: number;
}

interface Consultation {
    id: number;
    status: string;
    created_at: string;
    final_diagnosis?: FinalDiagnosis;
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
    diagnoses: UserDiagnosis[];
    consultations: Consultation[];
}

interface DiagnosisHistoryItem {
    id: number;
    disorder: string;
    confidence: number;
    date: string;
    symptoms_count: number;
}

interface ConsultationSummary {
    total: number;
    completed: number;
    in_progress: number;
    abandoned: number;
}

interface AdminUsersShowProps {
    user: User;
    diagnosis_history: DiagnosisHistoryItem[];
    consultation_summary: ConsultationSummary;
}

export default function AdminUsersShow({ user, diagnosis_history, consultation_summary }: AdminUsersShowProps) {
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

    const getConfidenceText = (confidence: number) => {
        if (confidence >= 80) return 'Tinggi';
        if (confidence >= 60) return 'Sedang';
        return 'Rendah';
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'abandoned': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Selesai';
            case 'in_progress': return 'Berlangsung';
            case 'abandoned': return 'Dibatalkan';
            default: return status;
        }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const completionRate = consultation_summary.total > 0 
        ? Math.round((consultation_summary.completed / consultation_summary.total) * 100) 
        : 0;

    return (
        <AppLayout>
            <Head title={`Pengguna: ${user.name}`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/users">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Profil Pengguna
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Detail informasi pengguna {user.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(user.role.name)}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role.display_name}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* User Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    Informasi Pengguna
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        {user.avatar ? (
                                            <img
                                                className="h-20 w-20 rounded-full"
                                                src={user.avatar}
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                    Nama Lengkap
                                                </h3>
                                                <p className="font-medium text-lg">{user.name}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                    Email
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                    Provider
                                                </h3>
                                                <Badge className={getProviderBadge(user.provider)}>
                                                    {user.provider === 'google' ? 'Google' : 'Email'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                    Status Verifikasi
                                                </h3>
                                                {user.email_verified_at ? (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <UserCheck className="w-3 h-3 mr-1" />
                                                        Terverifikasi
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Belum Verifikasi
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Bergabung: {formatDate(user.created_at)}</span>
                                                </div>
                                                <div>
                                                    <span>ID Pengguna: {user.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Diagnosis History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Riwayat Diagnosis ({user.diagnoses.length})
                                </CardTitle>
                                <CardDescription>
                                    Semua diagnosis yang pernah diterima pengguna
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user.diagnoses.length > 0 ? (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Gangguan</TableHead>
                                                    <TableHead>Confidence</TableHead>
                                                    <TableHead>Gejala</TableHead>
                                                    <TableHead>Tanggal</TableHead>
                                                    <TableHead className="w-[70px]">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {user.diagnoses.map((diagnosis) => {
                                                    const ConfidenceIcon = getConfidenceIcon(diagnosis.confidence_level);
                                                    return (
                                                        <TableRow key={diagnosis.id}>
                                                            <TableCell>
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
                                                                <Badge variant="secondary">
                                                                    {diagnosis.symptoms_reported?.length || 0} gejala
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {formatDate(diagnosis.created_at)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={`/admin/user-diagnoses/${diagnosis.id}`}>
                                                                        <Eye className="h-3 w-3" />
                                                                    </Link>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">
                                            Belum ada diagnosis
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Pengguna belum pernah melakukan diagnosis
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Consultation History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Riwayat Konsultasi ({user.consultations.length})
                                </CardTitle>
                                <CardDescription>
                                    Semua sesi konsultasi yang pernah dilakukan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user.consultations.length > 0 ? (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID Konsultasi</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Hasil Diagnosis</TableHead>
                                                    <TableHead>Tanggal</TableHead>
                                                    <TableHead className="w-[70px]">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {user.consultations.map((consultation) => (
                                                    <TableRow key={consultation.id}>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-mono text-sm">
                                                                    #{consultation.id}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getStatusBadgeColor(consultation.status)}>
                                                                {getStatusLabel(consultation.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {consultation.final_diagnosis ? (
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Badge variant="outline">
                                                                            {consultation.final_diagnosis.mental_disorder.code}
                                                                        </Badge>
                                                                        <Brain className="h-4 w-4 text-muted-foreground" />
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {consultation.final_diagnosis.mental_disorder.name}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">
                                                                    Tidak ada diagnosis
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {formatDate(consultation.created_at)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/admin/consultations/${consultation.id}`}>
                                                                    <Eye className="h-3 w-3" />
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <History className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">
                                            Belum ada konsultasi
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Pengguna belum pernah melakukan konsultasi
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Statistik Pengguna
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {user.consultations.length}
                                        </div>
                                        <p className="text-sm text-blue-800">
                                            Total Konsultasi
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {user.diagnoses.length}
                                        </div>
                                        <p className="text-sm text-green-800">
                                            Total Diagnosis
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {completionRate}%
                                        </div>
                                        <p className="text-sm text-purple-800">
                                            Tingkat Penyelesaian
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consultation Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Ringkasan Konsultasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Selesai</span>
                                    <div className="flex items-center space-x-2">
                                        <Badge className="bg-green-100 text-green-800">
                                            {consultation_summary.completed}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Berlangsung</span>
                                    <div className="flex items-center space-x-2">
                                        <Badge className="bg-blue-100 text-blue-800">
                                            {consultation_summary.in_progress}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Dibatalkan</span>
                                    <div className="flex items-center space-x-2">
                                        <Badge className="bg-gray-100 text-gray-800">
                                            {consultation_summary.abandoned}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/user-diagnoses" className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Semua Diagnosis
                                    </Link>
                                </Button>
                                
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/consultations" className="flex items-center">
                                        <History className="mr-2 h-4 w-4" />
                                        Semua Konsultasi
                                    </Link>
                                </Button>

                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/users" className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Semua Pengguna
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Informasi Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Role</span>
                                        <Badge className={getRoleBadgeColor(user.role.name)}>
                                            {user.role.display_name}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Provider</span>
                                        <Badge className={getProviderBadge(user.provider)}>
                                            {user.provider === 'google' ? 'Google' : 'Email'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        {user.email_verified_at ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t text-xs text-muted-foreground">
                                    <p>Bergabung: {formatDateTime(user.created_at)}</p>
                                    {user.email_verified_at && (
                                        <p className="mt-1">
                                            Verifikasi: {formatDateTime(user.email_verified_at)}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Latest Activity */}
                        {user.diagnoses.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Aktivitas Terakhir
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const latestDiagnosis = user.diagnoses[0];
                                        const ConfidenceIcon = getConfidenceIcon(latestDiagnosis.confidence_level);
                                        return (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-blue-900">
                                                            Diagnosis Terakhir
                                                        </span>
                                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                            {latestDiagnosis.mental_disorder.code}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-blue-800 mb-2">
                                                        {latestDiagnosis.mental_disorder.name}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-1">
                                                            <ConfidenceIcon className="h-3 w-3" />
                                                            <span className="text-xs">
                                                                {latestDiagnosis.confidence_level}%
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-blue-600">
                                                            {formatDate(latestDiagnosis.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}