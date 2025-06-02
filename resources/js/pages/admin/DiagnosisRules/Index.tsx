import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2,
    Zap,
    TestTube,
    Brain,
    AlertCircle,
    CheckCircle,
    Target,
    Activity
} from 'lucide-react';
import { useState } from 'react';

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
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

interface PaginationData {
    current_page: number;
    data: DiagnosisRule[];
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

interface DiagnosisRulesIndexProps {
    rules: PaginationData;
}

export default function DiagnosisRulesIndex({ rules }: DiagnosisRulesIndexProps) {
    const [search, setSearch] = useState('');
    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<DiagnosisRule | null>(null);
    const [testSymptoms, setTestSymptoms] = useState<string[]>([]);
    const [testResult, setTestResult] = useState<any>(null);

    const handleDelete = (rule: DiagnosisRule) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rule "${rule.rule_code}"?`)) {
            router.delete(`/admin/diagnosis-rules/${rule.id}`);
        }
    };

    const filteredRules = rules.data.filter(rule =>
        rule.rule_code.toLowerCase().includes(search.toLowerCase()) ||
        rule.mental_disorder.name.toLowerCase().includes(search.toLowerCase()) ||
        rule.mental_disorder.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleTestRule = async (rule: DiagnosisRule) => {
        setSelectedRule(rule);
        setTestSymptoms([]);
        setTestResult(null);
        setTestDialogOpen(true);
    };

    const runTest = async () => {
        if (!selectedRule || testSymptoms.length === 0) return;

        try {
            const response = await fetch(`/admin/diagnosis-rules/${selectedRule.id}/test`, {
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
        }
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

    const getRuleTypeIcon = (ruleCode: string) => {
        if (ruleCode.endsWith('A')) return Target;
        if (ruleCode.endsWith('B')) return Brain;
        return Activity;
    };

    return (
        <AppLayout>
            <Head title="Aturan Diagnosis" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Aturan Diagnosis</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola rules backward chaining untuk sistem expert
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/diagnosis-rules/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Rule
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Rules
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rules.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Rules diagnosis aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Primary Paths
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {rules.data.filter(r => r.rule_code.endsWith('A')).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Jalur utama diagnosis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Secondary Paths
                            </CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {rules.data.filter(r => r.rule_code.endsWith('B')).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Jalur alternatif diagnosis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg Symptoms
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {rules.data.length > 0 
                                    ? Math.round(rules.data.reduce((sum, r) => sum + r.symptom_codes.length, 0) / rules.data.length)
                                    : 0
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rata-rata gejala per rule
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Rules Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Rules Diagnosis</CardTitle>
                        <CardDescription>
                            Aturan untuk backward chaining dalam sistem expert
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari rule atau gangguan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rule Code</TableHead>
                                        <TableHead>Gangguan Mental</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Symptoms</TableHead>
                                        <TableHead>Gejala Required</TableHead>
                                        <TableHead>Update</TableHead>
                                        <TableHead className="w-[70px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRules.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <Zap className="h-12 w-12 text-muted-foreground" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">Tidak ada rule ditemukan</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {search ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambah rule diagnosis baru'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRules.map((rule) => {
                                            const RuleIcon = getRuleTypeIcon(rule.rule_code);
                                            return (
                                                <TableRow key={rule.id}>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-mono">
                                                            {rule.rule_code}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <Badge variant="secondary">
                                                                    {rule.mental_disorder.code}
                                                                </Badge>
                                                                <span className="text-sm">{rule.mental_disorder.name}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getRuleTypeColor(rule.rule_code)}>
                                                            <RuleIcon className="w-3 h-3 mr-1" />
                                                            {getRuleTypeBadge(rule.rule_code)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {rule.symptom_codes.length} gejala
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {rule.symptom_codes.slice(0, 3).map((code) => (
                                                                <Badge key={code} variant="outline" className="text-xs font-mono">
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
                                                        {new Date(rule.updated_at).toLocaleDateString('id-ID')}
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
                                                                    <Link href={`/admin/diagnosis-rules/${rule.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Lihat Detail
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {/* <DropdownMenuItem 
                                                                    onClick={() => handleTestRule(rule)}
                                                                >
                                                                    <TestTube className="mr-2 h-4 w-4" />
                                                                    Test Rule
                                                                </DropdownMenuItem> */}
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/diagnosis-rules/${rule.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => handleDelete(rule)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
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
                        {rules.total > rules.per_page && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {rules.from} sampai {rules.to} dari {rules.total} rules
                                </div>
                                <div className="flex items-center space-x-2">
                                    {rules.prev_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(rules.prev_page_url!)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    
                                    {rules.links
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
                                    
                                    {rules.next_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(rules.next_page_url!)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Test Rule Dialog */}
                <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <TestTube className="h-5 w-5" />
                                Test Rule Diagnosis
                            </DialogTitle>
                            <DialogDescription>
                                Test rule {selectedRule?.rule_code} untuk {selectedRule?.mental_disorder.name}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium mb-3 block">
                                    Required Symptoms for this rule:
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                                    {selectedRule?.symptom_codes.map((code) => (
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

                            <Button onClick={runTest} disabled={testSymptoms.length === 0} className="w-full">
                                <TestTube className="mr-2 h-4 w-4" />
                                Run Test
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
            </div>
        </AppLayout>
    );
}