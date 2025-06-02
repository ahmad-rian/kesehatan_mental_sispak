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
    FileText,
    Brain,
    User,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Lightbulb,
    History,
    Mail
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface Symptom {
    id: number;
    code: string;
    description: string;
}

interface Consultation {
    id: number;
    status: string;
    created_at: string;
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
    consultations: Consultation[];
}

interface UserDiagnosesShowProps {
    diagnosis: UserDiagnosis;
    symptoms_details: Symptom[];
}

export default function UserDiagnosesShow({ diagnosis, symptoms_details }: UserDiagnosesShowProps) {
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

    const getConfidenceLevel = (confidence: number) => {
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

    const ConfidenceIcon = getConfidenceIcon(diagnosis.confidence_level);

    const getCategoryInfo = (symptomCode: string) => {
        const categoryMapping = {
            'mood_emotional': { title: 'Mood & Emosional', color: 'bg-pink-100 text-pink-800' },
            'cognitive': { title: 'Kognitif', color: 'bg-purple-100 text-purple-800' },
            'physical': { title: 'Fisik', color: 'bg-blue-100 text-blue-800' },
            'behavioral': { title: 'Perilaku', color: 'bg-green-100 text-green-800' },
            'trauma_related': { title: 'Trauma Terkait', color: 'bg-orange-100 text-orange-800' }
        };

        const categories = {
            'mood_emotional': ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27'],
            'cognitive': ['G3', 'G8', 'G15', 'G16', 'G17', 'G18'],
            'physical': ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24'],
            'behavioral': ['G19', 'G22', 'G25', 'G26'],
            'trauma_related': ['G20', 'G21']
        };

        for (const [key, codes] of Object.entries(categories)) {
            if (codes.includes(symptomCode)) {
                return categoryMapping[key as keyof typeof categoryMapping];
            }
        }
        return { title: 'Lainnya', color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <AppLayout>
            <Head title={`Diagnosis ${diagnosis.user.name}`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/user-diagnoses">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Diagnosis #{diagnosis.id}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Detail diagnosis untuk {diagnosis.user.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getConfidenceBadgeColor(diagnosis.confidence_level)}>
                            <ConfidenceIcon className="w-3 h-3 mr-1" />
                            {getConfidenceLevel(diagnosis.confidence_level)}
                        </Badge>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Diagnosis Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* User Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Pengguna
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                            Nama Lengkap
                                        </h3>
                                        <p className="font-medium">{diagnosis.user.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                            Email
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{diagnosis.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t">
                                    <p className="text-sm text-muted-foreground">
                                        ID Pengguna: {diagnosis.user.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Diagnosis Result */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Hasil Diagnosis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {diagnosis.mental_disorder ? (
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium text-blue-900">Gangguan Terdeteksi</h3>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {diagnosis.mental_disorder.code}
                                            </Badge>
                                        </div>
                                        <p className="text-blue-800 font-medium text-lg">
                                            {diagnosis.mental_disorder.name}
                                        </p>
                                    </div>
                                ) : (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Tidak ada gangguan mental spesifik yang terdeteksi berdasarkan gejala yang dilaporkan.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Tingkat Keyakinan
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <ConfidenceIcon className="h-5 w-5" />
                                            <Badge className={getConfidenceBadgeColor(diagnosis.confidence_level)}>
                                                {diagnosis.confidence_level}%
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                ({getConfidenceLevel(diagnosis.confidence_level)})
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Tanggal Diagnosis
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {new Date(diagnosis.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reported Symptoms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Gejala yang Dilaporkan ({diagnosis.symptoms_reported?.length || 0})
                                </CardTitle>
                                <CardDescription>
                                    Daftar gejala yang dialami pengguna
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {symptoms_details.length > 0 ? (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Kode</TableHead>
                                                    <TableHead>Deskripsi</TableHead>
                                                    <TableHead>Kategori</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {symptoms_details.map((symptom) => {
                                                    const categoryInfo = getCategoryInfo(symptom.code);
                                                    return (
                                                        <TableRow key={symptom.id}>
                                                            <TableCell>
                                                                <Badge variant="outline" className="font-mono">
                                                                    {symptom.code}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="max-w-md">
                                                                <p className="text-sm leading-relaxed">
                                                                    {symptom.description}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className={categoryInfo.color}>
                                                                    {categoryInfo.title}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">
                                            Tidak ada gejala yang tercatat
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recommendation */}
                        {diagnosis.recommendation && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5" />
                                        Rekomendasi
                                    </CardTitle>
                                    <CardDescription>
                                        Saran dan tindak lanjut berdasarkan hasil diagnosis
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <p className="text-amber-800 leading-relaxed">
                                            {diagnosis.recommendation}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Statistik Diagnosis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {diagnosis.confidence_level}%
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Confidence Level
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {diagnosis.symptoms_reported?.length || 0}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Gejala Dilaporkan
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {diagnosis.consultations?.length || 0}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Konsultasi Terkait
                                    </p>
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
                                    <Link href={`/admin/users/${diagnosis.user.id}`}>
                                        <User className="mr-2 h-4 w-4" />
                                        Lihat Profil User
                                    </Link>
                                </Button>
                                
                                {diagnosis.mental_disorder && (
                                    <Button className="w-full justify-start" variant="outline" asChild>
                                        <Link href={`/admin/mental-disorders/${diagnosis.mental_disorder.id}`}>
                                            <Brain className="mr-2 h-4 w-4" />
                                            Detail Gangguan
                                        </Link>
                                    </Button>
                                )}

                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/user-diagnoses">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Semua Diagnosis
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Related Consultations */}
                        {diagnosis.consultations && diagnosis.consultations.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Konsultasi Terkait
                                    </CardTitle>
                                    <CardDescription>
                                        Riwayat konsultasi yang berkaitan dengan diagnosis ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {diagnosis.consultations.map((consultation) => (
                                            <div key={consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">
                                                        Konsultasi #{consultation.id}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(consultation.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusBadgeColor(consultation.status)}>
                                                    {getStatusLabel(consultation.status)}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Diagnosis Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Diagnosis Dibuat</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(diagnosis.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {diagnosis.updated_at !== diagnosis.created_at && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Terakhir Diupdate</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(diagnosis.updated_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Confidence Level Guide */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Panduan Confidence Level</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <div>
                                        <Badge className="bg-green-100 text-green-800">Tinggi (≥80%)</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Diagnosis sangat yakin
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <div>
                                        <Badge className="bg-yellow-100 text-yellow-800">Sedang (60-79%)</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Diagnosis cukup yakin
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <div>
                                        <Badge className="bg-red-100 text-red-800">Rendah (&lt;60%)</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Perlu evaluasi lebih lanjut
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
