import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    ArrowLeft, 
    Save, 
    Zap,
    AlertCircle,
    Info,
    Brain,
    Target,
    Activity,
    CheckCircle
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

interface DiagnosisRulesCreateProps {
    disorders: MentalDisorder[];
    symptoms: Symptom[];
}

export default function DiagnosisRulesCreate({ disorders, symptoms }: DiagnosisRulesCreateProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
        rule_code: '',
        mental_disorder_id: '',
        symptom_codes: [] as string[],
    });

    const [selectedDisorder, setSelectedDisorder] = useState<MentalDisorder | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/diagnosis-rules', {
            onSuccess: () => {
                // Redirect akan dilakukan otomatis oleh controller
            }
        });
    };

    const handleSymptomToggle = (symptomCode: string, checked: boolean) => {
        if (checked) {
            setData('symptom_codes', [...data.symptom_codes, symptomCode]);
        } else {
            setData('symptom_codes', data.symptom_codes.filter(code => code !== symptomCode));
        }
    };

    const handleDisorderChange = (disorderId: string) => {
        setData('mental_disorder_id', disorderId);
        const disorder = disorders.find(d => d.id.toString() === disorderId);
        setSelectedDisorder(disorder || null);
        
        // Auto-generate rule code suggestion based on existing pattern
        if (disorder) {
            const existingRules = 9; // This should come from props ideally
            const nextRuleNumber = existingRules + 1;
            const suggestedCode = `R${nextRuleNumber}`;
            setData('rule_code', suggestedCode);
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

    const complexityInfo = getRuleComplexity(data.symptom_codes.length);

    const getCategorySymptoms = (categoryKey: string) => {
        const categoryMapping = {
            'mood_emotional': ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27'],
            'cognitive': ['G3', 'G8', 'G15', 'G16', 'G17', 'G18'],
            'physical': ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24'],
            'behavioral': ['G19', 'G22', 'G25', 'G26'],
            'trauma_related': ['G20', 'G21']
        };

        const codes = categoryMapping[categoryKey as keyof typeof categoryMapping] || [];
        return symptoms.filter(s => codes.includes(s.code));
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

    const categories = [
        { key: 'mood_emotional', title: 'Mood & Emosional', color: 'bg-pink-100 text-pink-800', icon: Activity },
        { key: 'cognitive', title: 'Kognitif', color: 'bg-purple-100 text-purple-800', icon: Brain },
        { key: 'physical', title: 'Fisik', color: 'bg-blue-100 text-blue-800', icon: Activity },
        { key: 'behavioral', title: 'Perilaku', color: 'bg-green-100 text-green-800', icon: Target },
        { key: 'trauma_related', title: 'Trauma Terkait', color: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    ];

    return (
        <AppLayout>
            <Head title="Tambah Aturan Diagnosis" />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Aturan Diagnosis</h1>
                            <p className="text-muted-foreground mt-1">
                                Buat rule baru untuk backward chaining sistem expert
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Form Aturan Diagnosis
                                </CardTitle>
                                <CardDescription>
                                    Masukkan informasi rule yang akan digunakan dalam sistem diagnosis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Rule Code Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="rule_code">
                                            Kode Rule <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="rule_code"
                                            type="text"
                                            placeholder="Contoh: R10"
                                            value={data.rule_code}
                                            onChange={(e) => setData('rule_code', e.target.value.toUpperCase())}
                                            className={errors.rule_code ? 'border-red-500' : ''}
                                            maxLength={10}
                                        />
                                        {errors.rule_code && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.rule_code}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Format: R + nomor urut (contoh: R10, R11, R12)
                                        </p>
                                    </div>

                                    {/* Rule Complexity Info */}
                                    {data.symptom_codes.length > 0 && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Tingkat kompleksitas rule: 
                                                <Badge className={`ml-2 ${complexityInfo.color}`}>
                                                    <complexityInfo.icon className="w-3 h-3 mr-1" />
                                                    {complexityInfo.level}
                                                </Badge>
                                                <span className="block mt-1 text-sm">{complexityInfo.description}</span>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Mental Disorder Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mental_disorder_id">
                                            Gangguan Mental <span className="text-red-500">*</span>
                                        </Label>
                                        <Select onValueChange={handleDisorderChange}>
                                            <SelectTrigger className={errors.mental_disorder_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih gangguan mental" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {disorders.map((disorder) => (
                                                    <SelectItem key={disorder.id} value={disorder.id.toString()}>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge className={getDisorderCategoryColor(disorder.code)}>
                                                                {disorder.code}
                                                            </Badge>
                                                            <span>{disorder.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.mental_disorder_id && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.mental_disorder_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Selected Disorder Info */}
                                    {selectedDisorder && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <h4 className="font-medium text-blue-900 mb-2">Gangguan Dipilih:</h4>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={`${getDisorderCategoryColor(selectedDisorder.code)} border-blue-300`}>
                                                    {selectedDisorder.code}
                                                </Badge>
                                                <span className="text-blue-800 font-medium">{selectedDisorder.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Symptoms Selection */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label>
                                                Gejala yang Diperlukan <span className="text-red-500">*</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Pilih gejala yang harus ada untuk rule ini (minimal 1 gejala)
                                            </p>
                                        </div>

                                        {errors.symptom_codes && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.symptom_codes}
                                            </p>
                                        )}

                                        {/* Selected Symptoms Summary */}
                                        {data.symptom_codes.length > 0 && (
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                <h4 className="font-medium text-green-900 mb-3">
                                                    Gejala Dipilih ({data.symptom_codes.length}):
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.symptom_codes.map((code) => (
                                                        <Badge key={code} className="bg-green-100 text-green-800">
                                                            {code}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Symptoms by Category */}
                                        <div className="space-y-6">
                                            {categories.map((category) => {
                                                const categorySymptoms = getCategorySymptoms(category.key);
                                                if (categorySymptoms.length === 0) return null;

                                                const CategoryIcon = category.icon;

                                                return (
                                                    <div key={category.key} className="border rounded-lg p-6">
                                                        <div className="flex items-center space-x-3 mb-4">
                                                            <CategoryIcon className="h-5 w-5" />
                                                            <Badge className={category.color}>
                                                                {category.title}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground">
                                                                ({categorySymptoms.length} gejala)
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="grid gap-3">
                                                            {categorySymptoms.map((symptom) => (
                                                                <div key={symptom.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                                    <Checkbox
                                                                        id={`symptom-${symptom.id}`}
                                                                        checked={data.symptom_codes.includes(symptom.code)}
                                                                        onCheckedChange={(checked) => 
                                                                            handleSymptomToggle(symptom.code, checked as boolean)
                                                                        }
                                                                        className="mt-1"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <Label 
                                                                            htmlFor={`symptom-${symptom.id}`}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center space-x-2 mb-1">
                                                                                <Badge variant="outline" className="font-mono text-xs">
                                                                                    {symptom.code}
                                                                                </Badge>
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                                                {symptom.description}
                                                                            </p>
                                                                        </Label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {progress && (
                                        <div className="space-y-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Uploading... {progress.percentage}%
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Buttons */}
                                    <div className="flex items-center justify-end space-x-4 pt-4">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/admin/diagnosis-rules">
                                                Batal
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Rule'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Panduan Pembuatan Rule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kode Rule</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Format: R + nomor urut</li>
                                        <li>• Gunakan nomor berurutan: R1, R2, R3...</li>
                                        <li>• Maksimal 10 karakter</li>
                                        <li>• Harus unik dan belum digunakan</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Pemilihan Gejala</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Minimal 1 gejala harus dipilih</li>
                                        <li>• Pilih gejala yang paling karakteristik</li>
                                        <li>• Kombinasi gejala menentukan akurasi</li>
                                        <li>• Lebih banyak gejala = lebih spesifik</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Tingkat Kompleksitas</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Simple: 1-3 gejala (mudah didiagnosis)</li>
                                        <li>• Standard: 4-6 gejala (diagnosis menengah)</li>
                                        <li>• Complex: 7+ gejala (diagnosis detail)</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rule Types */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Jenis Kompleksitas Rule</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <Badge className="bg-green-100 text-green-800 mb-2">Simple Rule</Badge>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Rule dengan 1-3 gejala utama yang mudah diidentifikasi
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <Badge className="bg-blue-100 text-blue-800 mb-2">Standard Rule</Badge>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Rule dengan 4-6 gejala untuk diagnosis yang lebih akurat
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                                    <div>
                                        <Badge className="bg-purple-100 text-purple-800 mb-2">Complex Rule</Badge>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Rule dengan 7+ gejala untuk diagnosis yang sangat detail dan spesifik
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Example Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contoh Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">R1</Badge>
                                        <Badge className="bg-yellow-100 text-yellow-800">P1</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Rule untuk Gangguan Kecemasan dengan 6 gejala utama
                                    </p>
                                </div>
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">R2</Badge>
                                        <Badge className="bg-pink-100 text-pink-800">P2</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Rule untuk Depresi dengan 7 gejala karakteristik
                                    </p>
                                </div>
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">R5</Badge>
                                        <Badge className="bg-blue-100 text-blue-800">P5</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Rule untuk OCD dengan 3 gejala utama (simple rule)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Tips:</strong> Pastikan rule yang dibuat memiliki logika yang tepat dan tidak
                                bertentangan dengan rule lain. Test rule setelah dibuat untuk memastikan akurasi.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}