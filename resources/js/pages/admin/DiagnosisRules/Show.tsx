import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    ArrowLeft, 
    Edit, 
    Trash2,
    Zap,
    TestTube,
    Brain,
    Target,
    BarChart3,
    CheckCircle,
    AlertCircle,
    Clock,
    Activity,
    FileText,
    Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

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

interface DiagnosisRule {
    id: number;
    rule_code: string;
    mental_disorder_id: number;
    mental_disorder: MentalDisorder;
    symptom_codes: string[];
    created_at: string;
    updated_at: string;
}

interface DiagnosisRulesShowProps {
    rule: DiagnosisRule;
    symptom_details: Symptom[];
}

export default function DiagnosisRulesShow({ 
    rule, 
    symptom_details
}: DiagnosisRulesShowProps) {
    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [testSymptoms, setTestSymptoms] = useState<string[]>([]);
    const [testResult, setTestResult] = useState<any>(null);
    const [isRunningTest, setIsRunningTest] = useState(false);

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus rule "${rule.rule_code}"?`)) {
            router.delete(`/admin/diagnosis-rules/${rule.id}`);
        }
    };

    const getRuleCategory = (rule: DiagnosisRule) => {
        const disorderCode = rule.mental_disorder.code;
        const symptomCount = rule.symptom_codes.length;
        
        // Primary: Simple rules with fewer symptoms (3-5) for common disorders
        if (['P1', 'P2'].includes(disorderCode) && symptomCount <= 5) {
            return 'primary';
        }
        
        // Complex: Rules with many symptoms (6+) or complex disorders
        if (symptomCount >= 6 || ['P3', 'P4', 'P8', 'P9'].includes(disorderCode)) {
            return 'complex';
        }
        
        // Standard: Medium complexity rules
        return 'standard';
    };

    const getRuleTypeColor = (rule: DiagnosisRule) => {
        const category = getRuleCategory(rule);
        switch (category) {
            case 'primary':
                return 'bg-blue-100 text-blue-800';
            case 'complex':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getRuleTypeBadge = (rule: DiagnosisRule) => {
        const category = getRuleCategory(rule);
        switch (category) {
            case 'primary':
                return 'Primary';
            case 'complex':
                return 'Complex';
            default:
                return 'Standard';
        }
    };

    const getRuleTypeIcon = (rule: DiagnosisRule) => {
        const category = getRuleCategory(rule);
        switch (category) {
            case 'primary':
                return Target;
            case 'complex':
                return Brain;
            default:
                return Activity;
        }
    };

    const getRuleComplexity = (symptomCount: number) => {
        if (symptomCount <= 3) {
            return { 
                level: 'Simple', 
                color: 'bg-green-100 text-green-800', 
                description: 'Rule sederhana dengan sedikit gejala',
                icon: Target 
            };
        }
        if (symptomCount <= 6) {
            return { 
                level: 'Standard', 
                color: 'bg-blue-100 text-blue-800', 
                description: 'Rule standar dengan kompleksitas menengah',
                icon: Activity 
            };
        }
        return { 
            level: 'Complex', 
            color: 'bg-purple-100 text-purple-800', 
            description: 'Rule kompleks dengan banyak gejala',
            icon: Brain 
        };
    };

    const currentComplexity = getRuleComplexity(rule.symptom_codes.length);
    const ComplexityIcon = currentComplexity.icon;
    const RuleIcon = getRuleTypeIcon(rule);

    const runTest = async () => {
        if (testSymptoms.length === 0) return;
        
        setIsRunningTest(true);
        try {
            const response = await fetch(`/admin/diagnosis-rules/${rule.id}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    test_symptoms: testSymptoms
                }),
            });

            const result = await response.json();
            setTestResult(result);
        } catch (error) {
            console.error('Error testing rule:', error);
        } finally {
            setIsRunningTest(false);
        }
    };

    const getDisorderCategoryColor = (code: string) => {
        if (['P1'].includes(code)) return 'bg-yellow-100 text-yellow-800';
        if (['P2', 'P3'].includes(code)) return 'bg-pink-100 text-pink-800';
        if (['P4'].includes(code)) return 'bg-purple-100 text-purple-800';
        if (['P5'].includes(code)) return 'bg-blue-100 text-blue-800';
        if (['P6'].includes(code)) return 'bg-orange-100 text-orange-800';
        if (['P7', 'P8', 'P9'].includes(code)) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

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
            <Head title={`Rule ${rule.rule_code}`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/diagnosis-rules">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Rule {rule.rule_code}
                                </h1>
                                <Badge className={getRuleTypeColor(rule)}>
                                    <RuleIcon className="w-3 h-3 mr-1" />
                                    {getRuleTypeBadge(rule)}
                                </Badge>
                                {/* <Badge className={currentComplexity.color}>
                                    <ComplexityIcon className="w-3 h-3 mr-1" />
                                    {currentComplexity.level}
                                </Badge> */}
                            </div>
                            <p className="text-muted-foreground">
                                Detail aturan diagnosis untuk {rule.mental_disorder.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Dibuat: {new Date(rule.created_at).toLocaleDateString('id-ID')}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Update: {new Date(rule.updated_at).toLocaleDateString('id-ID')}
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Gejala
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rule.symptom_codes.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Gejala yang diperlukan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kategori Rule
                            </CardTitle>
                            <RuleIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getRuleTypeBadge(rule)}</div>
                            <p className="text-xs text-muted-foreground">
                                Jenis aturan diagnosis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kompleksitas
                            </CardTitle>
                            <ComplexityIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentComplexity.level}</div>
                            <p className="text-xs text-muted-foreground">
                                Tingkat kompleksitas rule
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Aktif</div>
                            <p className="text-xs text-muted-foreground">
                                Rule tersedia untuk diagnosis
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Informasi Rule
                                </CardTitle>
                                <CardDescription>
                                    Detail lengkap aturan diagnosis dalam sistem expert
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Kode Rule
                                        </h3>
                                        <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                                            {rule.rule_code}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Kategori
                                        </h3>
                                        <Badge className={getRuleTypeColor(rule)}>
                                            <RuleIcon className="w-3 h-3 mr-1" />
                                            {getRuleTypeBadge(rule)}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-3">
                                        Gangguan Mental Target
                                    </h3>
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Badge className={getDisorderCategoryColor(rule.mental_disorder.code)}>
                                            {rule.mental_disorder.code}
                                        </Badge>
                                        <span className="font-semibold">{rule.mental_disorder.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-3">
                                        Kompleksitas Rule
                                    </h3>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                                        <Badge className={currentComplexity.color}>
                                            <ComplexityIcon className="w-3 h-3 mr-1" />
                                            {currentComplexity.level}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{currentComplexity.description}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Dibuat
                                        </h3>
                                        <p className="text-sm flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {new Date(rule.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                            Terakhir Update
                                        </h3>
                                        <p className="text-sm flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {new Date(rule.updated_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Required Symptoms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Gejala yang Diperlukan ({rule.symptom_codes.length})
                                </CardTitle>
                                <CardDescription>
                                    Daftar gejala yang harus ada untuk memenuhi rule ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                            {symptom_details.map((symptom) => {
                                                const categoryInfo = getCategoryInfo(symptom.code);
                                                return (
                                                    <TableRow key={symptom.id}>
                                                        <TableCell>
                                                            <Badge variant="outline" className="font-mono">
                                                                {symptom.code}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {symptom.description}
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* <Button 
                                    className="w-full justify-start" 
                                    variant="outline"
                                    onClick={() => setTestDialogOpen(true)}
                                >
                                    <TestTube className="mr-2 h-4 w-4" />
                                    Test Rule
                                </Button> */}
                                
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href={`/admin/diagnosis-rules/${rule.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Rule
                                    </Link>
                                </Button>

                                <Button 
                                    className="w-full justify-start" 
                                    variant="destructive" 
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Rule
                                </Button>

                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/diagnosis-rules/create">
                                        <Zap className="mr-2 h-4 w-4" />
                                        Buat Rule Baru
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Rule Info Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Ringkasan Rule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kode Rule:</h4>
                                    <Badge variant="outline" className="font-mono">{rule.rule_code}</Badge>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Gangguan Mental:</h4>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={getDisorderCategoryColor(rule.mental_disorder.code)}>
                                            {rule.mental_disorder.code}
                                        </Badge>
                                        <span className="text-sm">{rule.mental_disorder.name}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Gejala Required ({rule.symptom_codes.length}):</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {rule.symptom_codes.slice(0, 6).map(code => (
                                            <Badge key={code} variant="outline" className="font-mono text-xs">{code}</Badge>
                                        ))}
                                        {rule.symptom_codes.length > 6 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{rule.symptom_codes.length - 6}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium">Dibuat:</span>
                                            <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(rule.created_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Update:</span>
                                            <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(rule.updated_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Info Rule</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kategori Rule</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {getRuleTypeBadge(rule)} rule untuk diagnosis {rule.mental_disorder.name}.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kompleksitas</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {currentComplexity.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Penggunaan</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Rule ini digunakan dalam sistem backward chaining untuk mendiagnosis gangguan mental berdasarkan gejala yang ada.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <strong>Catatan:</strong> Rule ini aktif dan digunakan dalam sistem diagnosis. 
                                Perubahan akan mempengaruhi akurasi diagnosis selanjutnya.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>

            {/* Test Rule Dialog */}
            <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5" />
                            Test Rule Diagnosis
                        </DialogTitle>
                        <DialogDescription>
                            Test rule {rule.rule_code} untuk {rule.mental_disorder.name}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-medium mb-3 block">
                                Required Symptoms for this rule:
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                                {rule.symptom_codes.map((code) => (
                                    <Badge key={code} variant="outline" className="font-mono">
                                        {code}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-3 block">
                                Test Symptoms (masukkan kode gejala, pisahkan dengan koma):
                            </label>
                            <Input
                                placeholder="G1, G2, G3"
                                onChange={(e) => {
                                    const symptoms = e.target.value
                                        .split(',')
                                        .map(s => s.trim().toUpperCase())
                                        .filter(s => s.length > 0);
                                    setTestSymptoms(symptoms);
                                }}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Contoh: G1, G2, G3 atau gunakan gejala yang diperlukan di atas
                            </p>
                        </div>

                        <Button onClick={runTest} disabled={isRunningTest || testSymptoms.length === 0} className="w-full">
                            <TestTube className="mr-2 h-4 w-4" />
                            {isRunningTest ? 'Testing...' : 'Run Test'}
                        </Button>

                        {testResult && (
                            <div className="border rounded-lg p-6 space-y-4 bg-gradient-to-r from-gray-50 to-blue-50">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Test Results:
                                </h4>
                                
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                                        <span className="font-medium">Confidence Level:</span>
                                        <Badge className={
                                            testResult.confidence >= 80 ? 'bg-green-100 text-green-800' :
                                            testResult.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }>
                                            {testResult.confidence}%
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                                        <span className="font-medium">Rule Matches:</span>
                                        {testResult.matches ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Yes
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-800">
                                                <AlertCircle className="mr-1 h-3 w-3" />
                                                No
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="p-3 bg-white rounded border">
                                        <span className="text-sm font-medium mb-2 block">Matched Symptoms:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {testResult.matched_symptoms.map((code: string) => (
                                                <Badge key={code} className="bg-green-100 text-green-800 font-mono">
                                                    {code}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {testResult.missing_symptoms.length > 0 && (
                                        <div className="p-3 bg-white rounded border">
                                            <span className="text-sm font-medium mb-2 block">Missing Symptoms:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {testResult.missing_symptoms.map((code: string) => (
                                                    <Badge key={code} className="bg-red-100 text-red-800 font-mono">
                                                        {code}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}