import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    History,
    User,
    Clock,
    CheckCircle,
    XCircle,
    PlayCircle,
    Brain,
    Activity,
    MessageSquare,
    TrendingUp,
    Mail,
    Calendar,
    Timer,
    Target,
    AlertCircle
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

interface UserDiagnosis {
    id: number;
    mental_disorder: MentalDisorder | null;
    confidence_level: number;
    recommendation?: string;
}

interface ConsultationStep {
    type: string;
    question?: string;
    answer?: any;
    symptom_code?: string;
    timestamp: string;
}

interface Consultation {
    id: number;
    user: User;
    consultation_flow: ConsultationStep[];
    status: 'in_progress' | 'completed' | 'abandoned';
    final_diagnosis: UserDiagnosis | null;
    created_at: string;
    updated_at: string;
}

interface ConsultationSummary {
    total_steps?: number;
    reported_symptoms?: string[];
    session_duration?: string;
    completion_rate?: number;
    symptoms_details?: any[];
    flow_analysis?: {
        questions_answered?: number;
        symptoms_identified?: number;
        decision_points?: number;
    };
    total_questions?: number;
    progress?: number;
    final_diagnosis?: UserDiagnosis;
    recommendations?: any;
    general_recommendations?: any;
}

interface ConsultationsShowProps {
    consultation: Consultation;
    summary: ConsultationSummary;
}

export default function ConsultationsShow({ consultation, summary }: ConsultationsShowProps) {
    // Safety check for props
    if (!consultation) {
        return (
            <AppLayout>
                <Head title="Konsultasi Tidak Ditemukan" />
                <div className="space-y-8 p-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Data konsultasi tidak ditemukan atau tidak valid.
                        </AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

    // Safe access helper functions
    const safeAccess = (obj: any, path: string, defaultValue: any = '') => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : defaultValue;
        }, obj);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'abandoned': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Selesai';
            case 'in_progress': return 'Berlangsung';
            case 'abandoned': return 'Dibatalkan';
            default: return status;
        }
    };

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getProgressPercentage = (): number => {
        const totalSteps = consultation?.consultation_flow?.length || 0;
        const expectedSteps = 10; // Estimasi jumlah pertanyaan maksimal
        return Math.min(100, (totalSteps / expectedSteps) * 100);
    };

    const getReportedSymptoms = (): string[] => {
        const symptoms: string[] = [];
        const flow = consultation?.consultation_flow || [];

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

    const getStepTypeLabel = (type: string): string => {
        switch (type) {
            case 'symptom_question': return 'Pertanyaan Gejala';
            case 'follow_up': return 'Pertanyaan Lanjutan';
            case 'clarification': return 'Klarifikasi';
            case 'diagnosis': return 'Proses Diagnosis';
            default: return type || 'Unknown';
        }
    };

    const getStepTypeColor = (type: string): string => {
        switch (type) {
            case 'symptom_question': return 'bg-blue-100 text-blue-800';
            case 'follow_up': return 'bg-purple-100 text-purple-800';
            case 'clarification': return 'bg-yellow-100 text-yellow-800';
            case 'diagnosis': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAnswer = (answer: any): string => {
        if (typeof answer === 'boolean') {
            return answer ? 'Ya' : 'Tidak';
        }
        if (typeof answer === 'string') {
            return answer;
        }
        if (Array.isArray(answer)) {
            return answer.join(', ');
        }
        if (answer === null || answer === undefined) {
            return '-';
        }
        return JSON.stringify(answer);
    };

    // Safe access to consultation data with fallbacks
    const consultationId = consultation?.id || 0;
    const userName = safeAccess(consultation, 'user.name', 'Unknown User');
    const userEmail = safeAccess(consultation, 'user.email', 'No email');
    const consultationStatus = consultation?.status || 'unknown';
    const consultationFlow = consultation?.consultation_flow || [];
    const finalDiagnosis = consultation?.final_diagnosis || summary?.final_diagnosis;

    const StatusIcon = getStatusIcon(consultationStatus);
    const progress = getProgressPercentage();
    const reportedSymptoms = getReportedSymptoms();

    // Safe access to summary data with complete fallbacks
    const summaryData = {
        total_steps: summary?.total_steps || consultationFlow.length,
        reported_symptoms: summary?.reported_symptoms || reportedSymptoms,
        completion_rate: summary?.completion_rate || progress,
        session_duration: summary?.session_duration || 'Tidak tersedia',
        symptoms_details: summary?.symptoms_details || [],
        total_questions: summary?.total_questions || consultationFlow.length,
        progress: summary?.progress || progress,
        flow_analysis: {
            questions_answered: summary?.flow_analysis?.questions_answered || consultationFlow.filter(s => s.type === 'symptom_question').length,
            symptoms_identified: summary?.flow_analysis?.symptoms_identified || reportedSymptoms.length,
            decision_points: summary?.flow_analysis?.decision_points || consultationFlow.filter(s => s.type === 'diagnosis').length
        }
    };

    return (
        <AppLayout>
            <Head title={`Konsultasi #${consultationId}`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/consultations">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Konsultasi #{consultationId}
                                </h1>
                                <Badge className={getStatusBadgeColor(consultationStatus)}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {getStatusLabel(consultationStatus)}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Detail konsultasi untuk {userName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Consultation Details */}
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
                                        <p className="font-medium">{userName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                            Email
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                Tanggal Konsultasi
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {new Date(consultation.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                                Durasi Sesi
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <Timer className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{summaryData.session_duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consultation Progress */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Progress Konsultasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Progress Keseluruhan</span>
                                        <span className="text-sm font-bold">{Math.round(summaryData.progress)}%</span>
                                    </div>
                                    <Progress value={summaryData.progress} className="h-3" />
                                    <p className="text-xs text-muted-foreground">
                                        {summaryData.total_steps} langkah konsultasi selesai
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {summaryData.flow_analysis.questions_answered}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Pertanyaan</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {summaryData.flow_analysis.symptoms_identified}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Gejala</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {summaryData.flow_analysis.decision_points}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Keputusan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consultation Steps Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Riwayat Langkah Konsultasi
                                </CardTitle>
                                <CardDescription>
                                    Urutan pertanyaan, jawaban, dan proses selama konsultasi berlangsung
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-md overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>Waktu</TableHead>
                                                <TableHead>Jenis Langkah</TableHead>
                                                <TableHead>Pertanyaan</TableHead>
                                                <TableHead>Jawaban</TableHead>
                                                <TableHead>Kode Gejala</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {consultationFlow.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <span className="text-muted-foreground">Belum ada langkah konsultasi</span>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                consultationFlow.map((step, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{idx + 1}</TableCell>
                                                        <TableCell>
                                                            {step.timestamp ? 
                                                                new Date(step.timestamp).toLocaleTimeString('id-ID', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit'
                                                                })
                                                                : '-'
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStepTypeColor(step.type)}`}>
                                                                {getStepTypeLabel(step.type)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-xs truncate" title={step.question || ''}>
                                                                {step.question || <span className="text-muted-foreground">-</span>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatAnswer(step.answer)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {step.symptom_code ? (
                                                                <Badge variant="outline" className="font-mono">{step.symptom_code}</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Summary & Diagnosis */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Ringkasan Konsultasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Total Langkah:</span>
                                        <span className="font-semibold">{summaryData.total_steps}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Gejala Teridentifikasi:</span>
                                        <span className="font-semibold">{summaryData.reported_symptoms.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Completion Rate:</span>
                                        <span className="font-semibold">{Math.round(summaryData.completion_rate)}%</span>
                                    </div>
                                </div>

                                {summaryData.reported_symptoms.length > 0 && (
                                    <div className="pt-3 border-t">
                                        <h4 className="text-sm font-medium mb-2">Gejala Terlapor:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {summaryData.reported_symptoms.slice(0, 6).map(code => (
                                                <Badge key={code} variant="secondary" className="text-xs font-mono">
                                                    {code}
                                                </Badge>
                                            ))}
                                            {summaryData.reported_symptoms.length > 6 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{summaryData.reported_symptoms.length - 6} lainnya
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                            <CardContent className="space-y-3">
                                {finalDiagnosis && finalDiagnosis.mental_disorder ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-blue-900">Gangguan Terdeteksi</h4>
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    {finalDiagnosis.mental_disorder.code}
                                                </Badge>
                                            </div>
                                            <p className="text-blue-800 font-medium">
                                                {finalDiagnosis.mental_disorder.name}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-muted-foreground">Confidence Level:</span>
                                                <Badge className={getConfidenceBadgeColor(finalDiagnosis.confidence_level)}>
                                                    {finalDiagnosis.confidence_level}%
                                                </Badge>
                                            </div>
                                        </div>

                                        {finalDiagnosis.recommendation && (
                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                <h4 className="font-medium text-amber-900 mb-2">Rekomendasi:</h4>
                                                <p className="text-amber-800 text-sm leading-relaxed">
                                                    {finalDiagnosis.recommendation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Konsultasi belum menghasilkan diagnosis akhir.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}