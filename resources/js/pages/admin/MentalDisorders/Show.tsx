import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Clock, 
    Zap, 
    Users,
    Brain,
    AlertCircle,
    CheckCircle,
    FileText,
    Calendar,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';

interface DiagnosisRule {
    id: number;
    rule_code: string;
    symptom_codes: string[];
    created_at: string;
}

interface UserDiagnosis {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    confidence_level: number;
    created_at: string;
}

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
    description: string;
    recommendation: string;
    created_at: string;
    updated_at: string;
    diagnosis_rules: DiagnosisRule[];
    user_diagnoses: UserDiagnosis[];
}

interface ShowMentalDisorderProps {
    disorder: MentalDisorder;
}

export default function ShowMentalDisorder({ disorder }: ShowMentalDisorderProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const canDelete = () => {
        return disorder.diagnosis_rules.length === 0 && disorder.user_diagnoses.length === 0;
    };

    const handleDelete = () => {
        router.delete(`/admin/mental-disorders/${disorder.id}`, {
            onSuccess: () => {
                // Redirect akan dilakukan otomatis ke index
            }
        });
    };

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getRuleTypeColor = (ruleCode: string) => {
        if (ruleCode.endsWith('A')) return 'bg-blue-100 text-blue-800';
        if (ruleCode.endsWith('B')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getRuleTypeBadge = (ruleCode: string) => {
        if (ruleCode.endsWith('A')) return 'Primary';
        if (ruleCode.endsWith('B')) return 'Secondary';
        return 'Alternative';
    };

    const getCategoryInfo = (code: string) => {
    const categoryMapping = {
        'anxiety': {
            title: 'Gangguan Kecemasan',
            color: 'bg-yellow-100 text-yellow-800',
            codes: ['P1']
        },
        'mood': {
            title: 'Gangguan Mood',
            color: 'bg-pink-100 text-pink-800',
            codes: ['P2', 'P3'] // Depresi, Bipolar
        },
        'psychotic': {
            title: 'Gangguan Psikotik',
            color: 'bg-purple-100 text-purple-800',
            codes: ['P4'] // Skizofrenia
        },
        'obsessive': {
            title: 'Gangguan Obsesif',
            color: 'bg-blue-100 text-blue-800',
            codes: ['P5'] // OCD
        },
        'trauma': {
            title: 'Gangguan Trauma',
            color: 'bg-orange-100 text-orange-800',
            codes: ['P6'] // PTSD
        },
        'eating': {
            title: 'Gangguan Makan',
            color: 'bg-green-100 text-green-800',
            codes: ['P7', 'P8', 'P9'] // Anoreksia, Bulimia, BED
        }
    };

    for (const [key, category] of Object.entries(categoryMapping)) {
        if (category.codes.includes(code)) {
            return category;
        }
    }
    return { title: 'Lainnya', color: 'bg-gray-100 text-gray-800' };
};

    const categoryInfo = getCategoryInfo(disorder.code);

    return (
        <AppLayout>
            <Head title={`${disorder.name} - Detail`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/mental-disorders">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight">{disorder.name}</h1>
                                <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                                    {disorder.code}
                                </Badge>
                                <Badge className={categoryInfo.color}>
                                    {categoryInfo.title}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Detail informasi gangguan kesehatan mental
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/mental-disorders/${disorder.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    disabled={!canDelete()}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah Anda yakin ingin menghapus gangguan mental "{disorder.name}"?
                                        <br />
                                        <br />
                                        {!canDelete() ? (
                                            <span className="text-red-600 font-medium">
                                                ⚠️ Gangguan mental ini tidak dapat dihapus karena memiliki {disorder.diagnosis_rules.length} aturan diagnosis dan {disorder.user_diagnoses.length} riwayat diagnosis pengguna.
                                            </span>
                                        ) : (
                                            <span className="text-orange-600">
                                                Tindakan ini tidak dapat dibatalkan.
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    {canDelete() && (
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Hapus
                                        </AlertDialogAction>
                                    )}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Diagnosis Rules
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{disorder.diagnosis_rules.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Aturan diagnosis aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                User Diagnoses
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{disorder.user_diagnoses.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Total diagnosis pengguna
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
                                {disorder.user_diagnoses.length > 0 
                                    ? (disorder.user_diagnoses.reduce((sum, d) => sum + d.confidence_level, 0) / disorder.user_diagnoses.length).toFixed(1)
                                    : 0
                                }%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rata-rata tingkat keyakinan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status
                            </CardTitle>
                            {canDelete() ? (
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                            ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {canDelete() ? (
                                    <Badge variant="secondary">Tidak Digunakan</Badge>
                                ) : (
                                    <Badge className="bg-green-100 text-green-800">Aktif Digunakan</Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Status dalam sistem
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Deskripsi
                                </CardTitle>
                                <CardDescription>
                                    Penjelasan lengkap tentang gangguan mental ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disorder.description ? (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{disorder.description}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">Belum ada deskripsi</p>
                                        <Button variant="outline" size="sm" asChild className="mt-2">
                                            <Link href={`/admin/mental-disorders/${disorder.id}/edit`}>
                                                Tambah Deskripsi
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recommendation */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Rekomendasi Penanganan
                                </CardTitle>
                                <CardDescription>
                                    Saran penanganan awal untuk gangguan ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disorder.recommendation ? (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{disorder.recommendation}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">Belum ada rekomendasi</p>
                                        <Button variant="outline" size="sm" asChild className="mt-2">
                                            <Link href={`/admin/mental-disorders/${disorder.id}/edit`}>
                                                Tambah Rekomendasi
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Diagnosis Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Aturan Diagnosis
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/admin/diagnosis-rules" className="text-xs">
                                            Lihat Semua
                                        </Link>
                                    </Button>
                                </CardTitle>
                                <CardDescription>
                                    Rules yang menggunakan gangguan mental ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disorder.diagnosis_rules.length > 0 ? (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Rule Code</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Symptoms</TableHead>
                                                    <TableHead>Created</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {disorder.diagnosis_rules.map((rule) => (
                                                    <TableRow key={rule.id}>
                                                        <TableCell>
                                                            <Badge variant="outline" className="font-mono">
                                                                {rule.rule_code}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getRuleTypeColor(rule.rule_code)}>
                                                                {getRuleTypeBadge(rule.rule_code)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {rule.symptom_codes.slice(0, 3).map((code) => (
                                                                    <Badge key={code} variant="outline" className="text-xs">
                                                                        {code}
                                                                    </Badge>
                                                                ))}
                                                                {rule.symptom_codes.length > 3 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{rule.symptom_codes.length - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {new Date(rule.created_at).toLocaleDateString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Belum ada aturan diagnosis</p>
                                            <p className="text-xs text-muted-foreground">
                                                Buat aturan diagnosis untuk menghubungkan gejala dengan gangguan ini
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="mt-3">
                                            <Link href="/admin/diagnosis-rules/create">
                                                Buat Aturan Pertama
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent User Diagnoses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Diagnosis Terbaru
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/admin/user-diagnoses" className="text-xs">
                                            Lihat Semua
                                        </Link>
                                    </Button>
                                </CardTitle>
                                <CardDescription>
                                    10 diagnosis pengguna terbaru
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disorder.user_diagnoses.length > 0 ? (
                                    <div className="space-y-3">
                                        {disorder.user_diagnoses.slice(0, 10).map((diagnosis) => (
                                            <div key={diagnosis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-sm">{diagnosis.user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{diagnosis.user.email}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <Badge className={getConfidenceBadgeColor(diagnosis.confidence_level)}>
                                                        {diagnosis.confidence_level}%
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(diagnosis.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Belum ada diagnosis pengguna</p>
                                            <p className="text-xs text-muted-foreground">
                                                Diagnosis akan muncul setelah pengguna menyelesaikan tes
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-1">ID</h4>
                                    <p className="text-sm text-muted-foreground">#{disorder.id}</p>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-1">Kode</h4>
                                    <Badge variant="outline" className="font-mono">
                                        {disorder.code}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-1">Kategori</h4>
                                    <Badge className={categoryInfo.color}>
                                        {categoryInfo.title}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-1">Dibuat</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(disorder.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(disorder.created_at).toLocaleTimeString('id-ID')}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium mb-1">Terakhir Update</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(disorder.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(disorder.updated_at).toLocaleTimeString('id-ID')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href={`/admin/mental-disorders/${disorder.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Gangguan
                                    </Link>
                                </Button>
                                
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href={`/admin/diagnosis-rules/create?disorder=${disorder.id}`}>
                                        <Zap className="mr-2 h-4 w-4" />
                                        Buat Rule Diagnosis
                                    </Link>
                                </Button>
                                
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/test-system">
                                        <Brain className="mr-2 h-4 w-4" />
                                        Test di Expert System
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* System Impact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Impact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Dalam Rules</span>
                                    <Badge variant={disorder.diagnosis_rules.length > 0 ? "default" : "secondary"}>
                                        {disorder.diagnosis_rules.length > 0 ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Pernah Didiagnosis</span>
                                    <Badge variant={disorder.user_diagnoses.length > 0 ? "default" : "secondary"}>
                                        {disorder.user_diagnoses.length > 0 ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Dapat Dihapus</span>
                                    <Badge variant={canDelete() ? "destructive" : "secondary"}>
                                        {canDelete() ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}