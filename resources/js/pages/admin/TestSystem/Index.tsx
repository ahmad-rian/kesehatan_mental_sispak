import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
    TestTube, 
    Play, 
    RotateCcw, 
    Brain,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Activity,
    Heart,
    Users,
    Clock,
    Loader2,
    Zap,
    Target,
    Search
} from 'lucide-react';

// Mock data untuk demo
const mockSymptoms = [
    { id: 1, code: 'G1', description: 'Rasa Gelisah atau Tegang berlebihan' },
    { id: 2, code: 'G2', description: 'Ketegangan pada fisik' },
    { id: 3, code: 'G3', description: 'Kesulitan berkonsentrasi' },
    { id: 4, code: 'G9', description: 'Merasa diri tidak berguna, putus asa' },
    { id: 5, code: 'G10', description: 'Sedih dan murung berkelanjutan' },
    { id: 6, code: 'G12', description: 'Merasa bersemangat berlebihan' },
    { id: 7, code: 'G15', description: 'Delusi, memiliki keyakinan yang salah' },
    { id: 8, code: 'G16', description: 'Halusinasi' },
    { id: 9, code: 'G4', description: 'Gangguan Tidur' },
    { id: 10, code: 'G5', description: 'Perubahan nafsu makan' },
];

const mockTestCases = [
    {
        name: 'Gangguan Kecemasan - Basic Test',
        symptoms: ['G1', 'G2', 'G3'],
        expected_disorder: 'Gangguan Kecemasan',
    },
    {
        name: 'Depresi - Core Symptoms', 
        symptoms: ['G9', 'G10'],
        expected_disorder: 'Depresi',
    },
    {
        name: 'Bipolar - Mood Episodes',
        symptoms: ['G12', 'G9', 'G5'],
        expected_disorder: 'Gangguan Bipolar',
    },
    {
        name: 'Psikosis - Perceptual Symptoms',
        symptoms: ['G15', 'G16', 'G3'],
        expected_disorder: 'Gangguan Psikotik',
    }
];

const mockSymptomCategories = {
    mood_emotional: {
        title: 'Gejala Mood dan Emosional',
        description: 'Gejala yang berkaitan dengan perasaan dan suasana hati',
        symptoms: mockSymptoms.filter(s => ['G9', 'G10', 'G12'].includes(s.code)),
        priority: 1
    },
    cognitive: {
        title: 'Gejala Kognitif dan Persepsi',
        description: 'Gejala yang berkaitan dengan pemikiran dan persepsi',
        symptoms: mockSymptoms.filter(s => ['G3', 'G15', 'G16'].includes(s.code)),
        priority: 2
    },
    physical: {
        title: 'Gejala Fisik',
        description: 'Gejala yang berkaitan dengan kondisi tubuh',
        symptoms: mockSymptoms.filter(s => ['G1', 'G2', 'G4', 'G5'].includes(s.code)),
        priority: 3
    }
};

const loadingSteps = [
    { id: 1, title: 'Memvalidasi gejala...', duration: 800 },
    { id: 2, title: 'Menganalisis pola gejala...', duration: 1200 },
    { id: 3, title: 'Menjalankan backward chaining...', duration: 1500 },
    { id: 4, title: 'Menghitung confidence level...', duration: 1000 },
    { id: 5, title: 'Menyiapkan rekomendasi...', duration: 800 },
    { id: 6, title: 'Finalisasi hasil diagnosis...', duration: 500 }
];

export default function TestExpertSystem() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [testResult, setTestResult] = useState<any>(null);
    const [testing, setTesting] = useState(false);
    const [activeTab, setActiveTab] = useState<'manual' | 'test-cases'>('manual');
    const [error, setError] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const handleSymptomToggle = (symptomCode: string) => {
        setSelectedSymptoms(prev => 
            prev.includes(symptomCode)
                ? prev.filter(code => code !== symptomCode)
                : [...prev, symptomCode]
        );
        setError(null);
    };

    const simulateLoadingSteps = async () => {
        let totalProgress = 0;
        const stepIncrement = 100 / loadingSteps.length;

        for (let i = 0; i < loadingSteps.length; i++) {
            setLoadingStep(i);
            
            // Animate progress for current step
            const startProgress = totalProgress;
            const endProgress = (i + 1) * stepIncrement;
            const duration = loadingSteps[i].duration;
            const stepTime = 50; // Update every 50ms
            const progressIncrement = (endProgress - startProgress) / (duration / stepTime);

            let currentProgress = startProgress;
            
            while (currentProgress < endProgress) {
                currentProgress = Math.min(currentProgress + progressIncrement, endProgress);
                setLoadingProgress(currentProgress);
                await new Promise(resolve => setTimeout(resolve, stepTime));
            }
            
            totalProgress = endProgress;
        }
    };

    const runTest = async (testSymptoms = selectedSymptoms) => {
        if (testSymptoms.length === 0) {
            setError('Pilih minimal 1 gejala untuk test');
            return;
        }

        setTesting(true);
        setError(null);
        setLoadingStep(0);
        setLoadingProgress(0);
        
        try {
            // Start loading simulation
            const loadingPromise = simulateLoadingSteps();
            
            // Simulate actual processing time
            const processingPromise = new Promise(resolve => setTimeout(resolve, 6000));
            
            // Wait for both to complete
            await Promise.all([loadingPromise, processingPromise]);
            
            // Determine mock diagnosis based on symptoms
            let diagnosis = null;
            let confidence = 50;
            
            // Enhanced logic for mock diagnosis
            if (testSymptoms.includes('G1') && testSymptoms.includes('G2') && testSymptoms.includes('G3')) {
                diagnosis = {
                    mental_disorder: {
                        id: 1,
                        code: 'P1',
                        name: 'Gangguan Kecemasan',
                        description: 'Gangguan yang ditandai dengan perasaan cemas, gelisah, dan khawatir berlebihan yang mengganggu aktivitas sehari-hari.',
                        recommendation: 'Lakukan teknik relaksasi pernapasan, konsultasi dengan psikolog untuk terapi kognitif-behavioral, dan pertimbangkan dukungan kelompok.'
                    },
                    confidence: 85,
                    matched_symptoms: ['G1', 'G2', 'G3'],
                    missing_symptoms: ['G4'],
                    path_type: 'primary'
                };
                confidence = 85;
            } else if (testSymptoms.includes('G9') && testSymptoms.includes('G10')) {
                diagnosis = {
                    mental_disorder: {
                        id: 2,
                        code: 'P2',
                        name: 'Gangguan Depresi Mayor',
                        description: 'Gangguan mood yang ditandai dengan perasaan sedih yang persisten, kehilangan minat, dan gangguan fungsi sosial.',
                        recommendation: 'Konsultasi segera dengan psikiater untuk evaluasi komprehensif, pertimbangkan terapi farmakologi dan psikoterapi.'
                    },
                    confidence: 82,
                    matched_symptoms: ['G9', 'G10'],
                    missing_symptoms: ['G5'],
                    path_type: 'primary'
                };
                confidence = 82;
            } else if (testSymptoms.includes('G12') && (testSymptoms.includes('G9') || testSymptoms.includes('G10'))) {
                diagnosis = {
                    mental_disorder: {
                        id: 3,
                        code: 'P3',
                        name: 'Gangguan Bipolar',
                        description: 'Gangguan mood yang ditandai dengan episode mania dan depresi yang bergantian.',
                        recommendation: 'Evaluasi menyeluruh oleh psikiater, stabilisasi mood dengan mood stabilizer, dan monitoring ketat.'
                    },
                    confidence: 78,
                    matched_symptoms: testSymptoms.filter(s => ['G12', 'G9', 'G10', 'G5'].includes(s)),
                    missing_symptoms: [],
                    path_type: 'primary'
                };
                confidence = 78;
            } else if (testSymptoms.includes('G15') || testSymptoms.includes('G16')) {
                diagnosis = {
                    mental_disorder: {
                        id: 4,
                        code: 'P4',
                        name: 'Gangguan Spektrum Skizofrenia',
                        description: 'Gangguan yang ditandai dengan gejala psikotik seperti delusi, halusinasi, dan disorganisasi pikiran.',
                        recommendation: 'Rujukan segera ke psikiater untuk evaluasi dan penanganan komprehensif, pertimbangkan rawat inap jika diperlukan.'
                    },
                    confidence: 88,
                    matched_symptoms: testSymptoms.filter(s => ['G15', 'G16', 'G3'].includes(s)),
                    missing_symptoms: [],
                    path_type: 'primary'
                };
                confidence = 88;
            } else {
                diagnosis = {
                    mental_disorder: {
                        id: 5,
                        code: 'P5',
                        name: 'Sindrom Gejala Campuran',
                        description: 'Kombinasi gejala yang memerlukan evaluasi lebih mendalam untuk diagnosis yang akurat.',
                        recommendation: 'Konsultasi komprehensif dengan profesional kesehatan mental untuk klarifikasi diagnosis dan rencana penanganan.'
                    },
                    confidence: 65,
                    matched_symptoms: testSymptoms,
                    missing_symptoms: [],
                    path_type: 'secondary'
                };
                confidence = 65;
            }
            
            // Mock successful response
            const mockResult = {
                success: true,
                test_symptoms: testSymptoms,
                symptoms_details: mockSymptoms.filter(s => testSymptoms.includes(s.code)),
                diagnosis_result: {
                    status: confidence >= 80 ? 'high_confidence' : confidence >= 60 ? 'medium_confidence' : 'low_confidence',
                    diagnosis: diagnosis,
                    all_possibilities: [
                        {
                            mental_disorder: { code: diagnosis.mental_disorder.code, name: diagnosis.mental_disorder.name },
                            confidence: confidence
                        },
                        {
                            mental_disorder: { code: 'P6', name: 'Gangguan Adaptasi' },
                            confidence: Math.max(25, confidence - 35)
                        },
                        {
                            mental_disorder: { code: 'P7', name: 'Gangguan Campuran Anxietas-Depresi' },
                            confidence: Math.max(20, confidence - 45)
                        }
                    ],
                    message: confidence >= 80 ? 'Diagnosis dibuat dengan tingkat keyakinan tinggi.' : 
                             confidence >= 60 ? 'Diagnosis dibuat dengan tingkat keyakinan sedang.' : 
                             'Diagnosis memerlukan evaluasi lebih lanjut.'
                },
                recommendations: {
                    immediate: confidence < 60 ? ['Segera hubungi profesional kesehatan mental', 'Cari dukungan dari keluarga dan teman'] : ['Tetap tenang dan cari dukungan dari keluarga'],
                    lifestyle: ['Lakukan teknik relaksasi dan mindfulness', 'Olahraga ringan secara teratur', 'Pertahankan pola tidur yang baik', 'Hindari alkohol dan substansi'],
                    professional: confidence >= 70 ? ['Konsultasi dengan psikolog untuk psikoterapi'] : ['Evaluasi komprehensif oleh psikiater', 'Pertimbangkan terapi kombinasi'],
                    emergency: confidence < 50 ? ['Jika ada pikiran untuk menyakiti diri, segera hubungi hotline krisis'] : []
                },
                validation: {
                    valid: testSymptoms,
                    invalid: [],
                    is_valid: true,
                    count: testSymptoms.length,
                    message: `Semua ${testSymptoms.length} gejala berhasil divalidasi`
                },
                suggested_questions: [
                    {
                        code: 'G4',
                        description: 'Apakah Anda mengalami gangguan tidur (sulit tidur, sering terbangun, atau tidur berlebihan)?',
                        priority: 85,
                        potential_disorder: diagnosis.mental_disorder.name,
                        category: 'physical'
                    },
                    {
                        code: 'G5',
                        description: 'Apakah ada perubahan signifikan pada nafsu makan atau berat badan?',
                        priority: 80,
                        potential_disorder: diagnosis.mental_disorder.name,
                        category: 'physical'
                    },
                    {
                        code: 'G13',
                        description: 'Apakah Anda merasa mudah tersinggung atau marah tanpa alasan jelas?',
                        priority: 75,
                        potential_disorder: 'Gangguan Mood',
                        category: 'mood_emotional'
                    }
                ],
                processing_time: '6.2 seconds',
                system_version: '2.1.0'
            };

            setTestResult(mockResult);
        } catch (error) {
            setError('Terjadi error saat menjalankan test. Silakan coba lagi.');
        } finally {
            setTesting(false);
            setLoadingProgress(100);
        }
    };

    const runTestCase = (testCase: typeof mockTestCases[0]) => {
        setSelectedSymptoms(testCase.symptoms);
        runTest(testCase.symptoms);
        setActiveTab('manual');
    };

    const resetTest = () => {
        setSelectedSymptoms([]);
        setTestResult(null);
        setError(null);
        setLoadingStep(0);
        setLoadingProgress(0);
    };

    const getCategoryIcon = (categoryKey: string) => {
        const icons: Record<string, any> = {
            mood_emotional: Heart,
            cognitive: Brain,
            physical: Activity,
            behavioral: Users,
            trauma_related: Clock,
        };
        return icons[categoryKey] || Activity;
    };

    const getCategoryColor = (categoryKey: string) => {
        const colors: Record<string, string> = {
            mood_emotional: 'bg-pink-100 text-pink-800',
            cognitive: 'bg-purple-100 text-purple-800',
            physical: 'bg-blue-100 text-blue-800',
            behavioral: 'bg-green-100 text-green-800',
            trauma_related: 'bg-orange-100 text-orange-800',
        };
        return colors[categoryKey] || 'bg-gray-100 text-gray-800';
    };

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <AppLayout>
            <Head title="Test Expert System" />
            
            {/* Loading Modal */}
            <Dialog open={testing} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 animate-pulse text-blue-600" />
                            Menjalankan Diagnosis Expert System
                        </DialogTitle>
                        <DialogDescription>
                            Sistem sedang menganalisis gejala yang dipilih menggunakan algoritma backward chaining
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Progress</span>
                                <span className="text-muted-foreground">{Math.round(loadingProgress)}%</span>
                            </div>
                            <Progress value={loadingProgress} className="h-2" />
                        </div>

                        {/* Current Step */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex-shrink-0">
                                    {loadingStep < loadingSteps.length ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-blue-900">
                                        {loadingStep < loadingSteps.length 
                                            ? loadingSteps[loadingStep].title 
                                            : 'Selesai!'
                                        }
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Langkah {Math.min(loadingStep + 1, loadingSteps.length)} dari {loadingSteps.length}
                                    </p>
                                </div>
                            </div>

                            {/* Step List */}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {loadingSteps.map((step, index) => (
                                    <div 
                                        key={step.id} 
                                        className={`flex items-center gap-3 p-2 rounded ${
                                            index < loadingStep ? 'bg-green-50 text-green-800' :
                                            index === loadingStep ? 'bg-blue-50 text-blue-800' :
                                            'bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <div className="flex-shrink-0">
                                            {index < loadingStep ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : index === loadingStep ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                        <span className="text-sm">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Processing Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{selectedSymptoms.length}</div>
                                <div className="text-xs text-muted-foreground">Gejala dianalisis</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600">
                                    {Math.round(loadingProgress / 100 * 6.2 * 10) / 10}s
                                </div>
                                <div className="text-xs text-muted-foreground">Waktu proses</div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Test Expert System</h1>
                        <p className="text-muted-foreground mt-1">
                            Test dan validasi sistem pakar dengan berbagai kombinasi gejala
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                            onClick={() => runTest()} 
                            disabled={selectedSymptoms.length === 0 || testing}
                            className="min-w-[120px]"
                        >
                            {testing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Testing...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Test
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={resetTest} disabled={testing}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Success Alert for completed test */}
                {testResult && !testing && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            <strong>Test berhasil diselesaikan!</strong> Hasil diagnosis telah dianalisis dengan {testResult.validation.count} gejala.
                            Processing time: {testResult.processing_time}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Test Interface */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Panel - Symptom Selection */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TestTube className="h-5 w-5" />
                                    Symptom Selection
                                </CardTitle>
                                <CardDescription>
                                    Pilih gejala untuk test sistem expert
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                                        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="manual" className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                            <span className="text-sm font-medium">Selected Symptoms:</span>
                                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                                {selectedSymptoms.length} gejala
                                            </Badge>
                                        </div>

                                        {Object.entries(mockSymptomCategories).map(([key, category]) => {
                                            const Icon = getCategoryIcon(key);
                                            return (
                                                <div key={key} className="space-y-4">
                                                    <div className="flex items-center space-x-3 pb-2 border-b">
                                                        <Icon className="h-5 w-5" />
                                                        <h4 className="font-semibold text-lg">{category.title}</h4>
                                                        <Badge className={getCategoryColor(key)}>
                                                            {category.symptoms.length} gejala
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="grid gap-3 pl-8">
                                                        {category.symptoms.map((symptom) => (
                                                            <div key={symptom.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                                <Checkbox
                                                                    id={symptom.code}
                                                                    checked={selectedSymptoms.includes(symptom.code)}
                                                                    onCheckedChange={() => handleSymptomToggle(symptom.code)}
                                                                    className="mt-0.5"
                                                                    disabled={testing}
                                                                />
                                                                <label
                                                                    htmlFor={symptom.code}
                                                                    className="text-sm cursor-pointer flex-1 leading-relaxed"
                                                                >
                                                                    <Badge variant="outline" className="mr-3 text-xs font-mono">
                                                                        {symptom.code}
                                                                    </Badge>
                                                                    {symptom.description}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </TabsContent>

                                    <TabsContent value="test-cases" className="space-y-6">
                                        <Alert>
                                            <TestTube className="h-4 w-4" />
                                            <AlertDescription>
                                                Pre-defined test cases untuk validasi sistem dengan hasil yang diharapkan
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-4">
                                            {mockTestCases.map((testCase, index) => (
                                                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-lg">{testCase.name}</h4>
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => runTestCase(testCase)}
                                                            disabled={testing}
                                                        >
                                                            {testing ? (
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Play className="mr-2 h-4 w-4" />
                                                            )}
                                                            Run Test
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-sm font-medium mb-2 block">Symptoms:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {testCase.symptoms.map((code) => (
                                                                    <Badge key={code} variant="outline" className="text-xs font-mono">
                                                                        {code}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium mb-2 block">Expected Result:</span>
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                {testCase.expected_disorder}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Current Selection & Quick Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Current Selection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedSymptoms.length > 0 ? (
                                    <>
                                        <div className="space-y-3">
                                            <div className="text-sm font-medium">
                                                Selected Symptoms ({selectedSymptoms.length}):
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSymptoms.map((code) => (
                                                    <Badge key={code} variant="outline" className="text-xs font-mono">
                                                        {code}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            className="w-full" 
                                            onClick={() => runTest()}
                                            disabled={testing}
                                        >
                                            {testing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Testing...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Run Diagnosis
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <TestTube className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada gejala yang dipilih
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-4 w-4" />
                                    Test Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="font-medium text-sm mb-3 block">Confidence Levels:</span>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-green-100 text-green-800 text-xs">≥80%</Badge>
                                            <span className="text-xs text-muted-foreground">High Confidence</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">60-79%</Badge>
                                            <span className="text-xs text-muted-foreground">Medium Confidence</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-red-100 text-red-800 text-xs">&lt;60%</Badge>
                                            <span className="text-xs text-muted-foreground">Low Confidence</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <span className="font-medium text-sm mb-3 block">Testing Tips:</span>
                                    <ul className="text-xs text-muted-foreground space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            Pilih 3-5 gejala untuk test optimal
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            Kombinasi gejala dari berbagai kategori
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            Test cases memberikan hasil yang diharapkan
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            Periksa confidence level untuk akurasi
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        {testResult && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Processing Time</span>
                                        <Badge variant="outline">{testResult.processing_time}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Confidence</span>
                                        <Badge className={getConfidenceBadgeColor(testResult.diagnosis_result.diagnosis.confidence)}>
                                            {testResult.diagnosis_result.diagnosis.confidence}%
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <Badge variant="secondary">
                                            {testResult.diagnosis_result.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Test Results */}
                {testResult && !testing && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Test Results
                            </CardTitle>
                            <CardDescription>
                                Hasil diagnosis dari sistem expert berdasarkan gejala yang dipilih
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Validation Results */}
                            <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Symptom Validation
                                </h4>
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        {testResult.validation.message}
                                    </AlertDescription>
                                </Alert>
                            </div>

                            {/* Diagnosis Results */}
                            <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <Brain className="h-4 w-4" />
                                    Diagnosis Results
                                </h4>
                                {testResult.diagnosis_result.status === 'inconclusive' ? (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {testResult.diagnosis_result.message}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-6">
                                        {testResult.diagnosis_result.diagnosis && (
                                            <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h5 className="font-semibold text-lg">Primary Diagnosis</h5>
                                                    <Badge className={`${getConfidenceBadgeColor(testResult.diagnosis_result.diagnosis.confidence)} text-sm px-3 py-1`}>
                                                        {testResult.diagnosis_result.diagnosis.confidence}% confidence
                                                    </Badge>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="text-sm">
                                                            {testResult.diagnosis_result.diagnosis.mental_disorder.code}
                                                        </Badge>
                                                        <span className="font-semibold text-lg">
                                                            {testResult.diagnosis_result.diagnosis.mental_disorder.name}
                                                        </span>
                                                        <Badge className={
                                                            testResult.diagnosis_result.diagnosis.path_type === 'primary' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-green-100 text-green-800'
                                                        }>
                                                            {testResult.diagnosis_result.diagnosis.path_type} path
                                                        </Badge>
                                                    </div>
                                                    
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {testResult.diagnosis_result.diagnosis.mental_disorder.description}
                                                    </p>
                                                    
                                                    <div>
                                                        <span className="text-sm font-medium mb-2 block">Matched Symptoms:</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {testResult.diagnosis_result.diagnosis.matched_symptoms.map((code: string) => (
                                                                <Badge key={code} className="bg-green-100 text-green-800 text-xs">
                                                                    {code}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    {testResult.diagnosis_result.diagnosis.missing_symptoms && 
                                                     testResult.diagnosis_result.diagnosis.missing_symptoms.length > 0 && (
                                                        <div>
                                                            <span className="text-sm font-medium mb-2 block">Missing Symptoms:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {testResult.diagnosis_result.diagnosis.missing_symptoms.map((code: string) => (
                                                                    <Badge key={code} className="bg-red-100 text-red-800 text-xs">
                                                                        {code}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Recommendation */}
                                                    <div className="pt-4 border-t">
                                                        <span className="text-sm font-medium mb-2 block">Clinical Recommendation:</span>
                                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                            <p className="text-amber-800 text-sm leading-relaxed">
                                                                {testResult.diagnosis_result.diagnosis.mental_disorder.recommendation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Alternative Possibilities */}
                                        {testResult.diagnosis_result.all_possibilities.length > 1 && (
                                            <div>
                                                <h5 className="font-medium mb-4">Alternative Possibilities</h5>
                                                <div className="space-y-3">
                                                    {testResult.diagnosis_result.all_possibilities
                                                        .slice(1, 4)
                                                        .map((possibility: any, index: number) => (
                                                            <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge variant="outline">
                                                                            {possibility.mental_disorder.code}
                                                                        </Badge>
                                                                        <span className="font-medium">
                                                                            {possibility.mental_disorder.name}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="secondary">
                                                                        {possibility.confidence}%
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    Recommendations
                                </h4>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {testResult.recommendations.emergency.length > 0 && (
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-red-600 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4" />
                                                Emergency
                                            </h5>
                                            <ul className="text-sm space-y-2">
                                                {testResult.recommendations.emergency.map((rec: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {testResult.recommendations.immediate.length > 0 && (
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-orange-600 flex items-center gap-2">
                                                <Zap className="h-4 w-4" />
                                                Immediate Care
                                            </h5>
                                            <ul className="text-sm space-y-2">
                                                {testResult.recommendations.immediate.map((rec: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                                        <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {testResult.recommendations.lifestyle.length > 0 && (
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-blue-600 flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Lifestyle
                                            </h5>
                                            <ul className="text-sm space-y-2">
                                                {testResult.recommendations.lifestyle.map((rec: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                        <Activity className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {testResult.recommendations.professional.length > 0 && (
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-purple-600 flex items-center gap-2">
                                                <Brain className="h-4 w-4" />
                                                Professional Help
                                            </h5>
                                            <ul className="text-sm space-y-2">
                                                {testResult.recommendations.professional.map((rec: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                                        <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Suggested Next Questions */}
                            {testResult.suggested_questions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <Search className="h-4 w-4" />
                                        Suggested Next Questions
                                    </h4>
                                    <Alert className="mb-4">
                                        <Search className="h-4 w-4" />
                                        <AlertDescription>
                                            Pertanyaan strategis yang bisa diajukan untuk meningkatkan akurasi diagnosis
                                        </AlertDescription>
                                    </Alert>
                                    <div className="space-y-4">
                                        {testResult.suggested_questions.slice(0, 3).map((question: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Badge variant="outline" className="font-mono">{question.code}</Badge>
                                                    <Badge variant="secondary">
                                                        Priority: {question.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-medium mb-2">{question.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Potential for: <span className="font-medium">{question.potential_disorder}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* System Status */}
                            <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    System Status
                                </h4>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                                        <span className="text-sm font-medium">Status</span>
                                        <Badge className={
                                            testResult.diagnosis_result.status === 'high_confidence' ? 'bg-green-100 text-green-800' :
                                            testResult.diagnosis_result.status === 'medium_confidence' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }>
                                            {testResult.diagnosis_result.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-green-50">
                                        <span className="text-sm font-medium">Symptoms Tested</span>
                                        <Badge variant="outline">{testResult.test_symptoms.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-purple-50">
                                        <span className="text-sm font-medium">Possibilities Found</span>
                                        <Badge variant="outline">{testResult.diagnosis_result.all_possibilities.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-orange-50">
                                        <span className="text-sm font-medium">System Version</span>
                                        <Badge variant="outline">{testResult.system_version}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}