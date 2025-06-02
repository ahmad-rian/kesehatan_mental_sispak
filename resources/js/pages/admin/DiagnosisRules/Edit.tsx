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
    Clock,
    Target,
    Brain,
    Activity
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

interface DiagnosisRulesEditProps {
    rule: DiagnosisRule;
    disorders: MentalDisorder[];
    symptoms: Symptom[];
    symptom_details: Symptom[];
}

export default function DiagnosisRulesEdit({ 
    rule, 
    disorders, 
    symptoms, 
    symptom_details 
}: DiagnosisRulesEditProps) {
    const { data, setData, put, processing, errors, progress, isDirty } = useForm({
        rule_code: rule.rule_code,
        mental_disorder_id: rule.mental_disorder_id.toString(),
        symptom_codes: rule.symptom_codes,
    });

    const [selectedDisorder, setSelectedDisorder] = useState<MentalDisorder>(rule.mental_disorder);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/diagnosis-rules/${rule.id}`, {
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
        setSelectedDisorder(disorder || rule.mental_disorder);
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

    const currentComplexity = getRuleComplexity(data.symptom_codes.length);
    const originalComplexity = getRuleComplexity(rule.symptom_codes.length);
    const complexityChanged = currentComplexity.level !== originalComplexity.level;

    const getDisorderCategoryColor = (code: string) => {
        if (['P1'].includes(code)) return 'bg-yellow-100 text-yellow-800';
        if (['P2', 'P3'].includes(code)) return 'bg-pink-100 text-pink-800';
        if (['P4'].includes(code)) return 'bg-purple-100 text-purple-800';
        if (['P5'].includes(code)) return 'bg-blue-100 text-blue-800';
        if (['P6'].includes(code)) return 'bg-orange-100 text-orange-800';
        if (['P7', 'P8', 'P9'].includes(code)) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

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

    const categories = [
        { key: 'mood_emotional', title: 'Mood & Emosional', color: 'bg-pink-100 text-pink-800', icon: Activity },
        { key: 'cognitive', title: 'Kognitif', color: 'bg-purple-100 text-purple-800', icon: Brain },
        { key: 'physical', title: 'Fisik', color: 'bg-blue-100 text-blue-800', icon: Activity },
        { key: 'behavioral', title: 'Perilaku', color: 'bg-green-100 text-green-800', icon: Target },
        { key: 'trauma_related', title: 'Trauma Terkait', color: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    ];

    const addedSymptoms = data.symptom_codes.filter(code => !rule.symptom_codes.includes(code));
    const removedSymptoms = rule.symptom_codes.filter(code => !data.symptom_codes.includes(code));

    return (
        <AppLayout>
            <Head title={`Edit Rule ${rule.rule_code}`} />
            
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
                                <h1 className="text-3xl font-bold tracking-tight">Edit Rule {rule.rule_code}</h1>
                                <Badge className={originalComplexity.color}>
                                    <originalComplexity.icon className="w-3 h-3 mr-1" />
                                    {originalComplexity.level}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Perbarui aturan diagnosis untuk sistem expert
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

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Form Edit Rule
                                </CardTitle>
                                <CardDescription>
                                    Perbarui informasi rule diagnosis. Hati-hati dengan perubahan yang dapat mempengaruhi akurasi sistem.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Complexity Change Warning */}
                                    {complexityChanged && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Peringatan:</strong> Kompleksitas rule akan berubah dari{' '}
                                                <Badge className={`mx-1 ${originalComplexity.color}`}>
                                                    {originalComplexity.level}
                                                </Badge>
                                                ke{' '}
                                                <Badge className={`mx-1 ${currentComplexity.color}`}>
                                                    {currentComplexity.level}
                                                </Badge>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Symptoms Changes Alert */}
                                    {(addedSymptoms.length > 0 || removedSymptoms.length > 0) && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                <div className="space-y-3">
                                                    {addedSymptoms.length > 0 && (
                                                        <div>
                                                            <strong>Gejala Ditambahkan:</strong>
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {addedSymptoms.map(code => (
                                                                    <Badge key={code} className="bg-green-100 text-green-800">{code}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {removedSymptoms.length > 0 && (
                                                        <div>
                                                            <strong>Gejala Dihapus:</strong>
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {removedSymptoms.map(code => (
                                                                    <Badge key={code} className="bg-red-100 text-red-800">{code}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AlertDescription>
                                        </Alert>
                                    )}

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

                                    {/* Current Complexity */}
                                    <div className="space-y-2">
                                        <Label>Kompleksitas Rule Saat Ini</Label>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={currentComplexity.color}>
                                                <currentComplexity.icon className="w-3 h-3 mr-1" />
                                                {currentComplexity.level}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {currentComplexity.description}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mental Disorder Select */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mental_disorder_id">
                                            Gangguan Mental <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.mental_disorder_id}
                                            onValueChange={handleDisorderChange}
                                        >
                                            <SelectTrigger id="mental_disorder_id" className={errors.mental_disorder_id ? 'border-red-500' : ''}>
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

                                    {/* Current Disorder Info */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-900 mb-2">Gangguan Mental:</h4>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={`${getDisorderCategoryColor(selectedDisorder.code)} border-blue-300`}>
                                                {selectedDisorder.code}
                                            </Badge>
                                            <span className="text-blue-800 font-medium">{selectedDisorder.name}</span>
                                        </div>
                                    </div>

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
                                                                                {addedSymptoms.includes(symptom.code) && (
                                                                                    <Badge className="bg-green-100 text-green-800 text-xs">Baru</Badge>
                                                                                )}
                                                                                {rule.symptom_codes.includes(symptom.code) && !data.symptom_codes.includes(symptom.code) && (
                                                                                    <Badge className="bg-red-100 text-red-800 text-xs">Dihapus</Badge>
                                                                                )}
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
                                                Updating... {progress.percentage}%
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end space-x-4 pt-4">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/admin/diagnosis-rules">
                                                Batal
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={processing || !isDirty}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Update Rule'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Info Rule
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
                                        <Badge className={getDisorderCategoryColor(selectedDisorder.code)}>
                                            {selectedDisorder.code}
                                        </Badge>
                                        <span className="text-sm">{selectedDisorder.name}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Gejala Asli ({rule.symptom_codes.length}):</h4>
                                    <div className="space-y-2">
                                        {rule.symptom_codes.map(code => {
                                            const detail = symptom_details.find(s => s.code === code);
                                            return (
                                                <div key={code} className="text-sm">
                                                    <Badge variant="outline" className="font-mono mr-2">{code}</Badge>
                                                    {detail && <span className="text-muted-foreground text-xs">{detail.description.slice(0, 50)}...</span>}
                                                </div>
                                            );
                                        })}
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

                        {/* Edit Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Panduan Edit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Perubahan Kode</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Hati-hati mengubah kode rule karena dapat mempengaruhi sistem diagnosis.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Gejala</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Perubahan gejala akan mempengaruhi akurasi diagnosis. Test rule setelah edit.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kompleksitas</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Simple (1-3), Standard (4-6), Complex (7+) gejala menentukan tingkat akurasi.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Dampak</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Perubahan akan berlaku untuk diagnosis selanjutnya, tidak mempengaruhi riwayat.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <strong>Peringatan:</strong> Perubahan pada rule akan mempengaruhi akurasi sistem diagnosis. 
                                Pastikan untuk menguji rule setelah melakukan perubahan.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}