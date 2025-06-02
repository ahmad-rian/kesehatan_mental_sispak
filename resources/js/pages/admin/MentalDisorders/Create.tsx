import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Info, Brain } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function CreateMentalDisorder() {
    const { data, setData, post, processing, errors, progress } = useForm({
        code: '',
        name: '',
        description: '',
        recommendation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/mental-disorders', {
            onSuccess: () => {
                
            }
        });
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

    const predictedCategory = data.code ? getCategoryInfo(data.code) : null;

    return (
        <AppLayout>
            <Head title="Tambah Gangguan Mental" />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Gangguan Mental</h1>
                            <p className="text-muted-foreground mt-1">
                                Tambahkan jenis gangguan kesehatan mental baru ke sistem
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
                                    <Brain className="h-5 w-5" />
                                    Form Tambah Gangguan Mental
                                </CardTitle>
                                <CardDescription>
                                    Masukkan detail gangguan mental yang akan ditambahkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="code">
                                                Kode Gangguan <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="code"
                                                type="text"
                                                placeholder="P10"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                className={errors.code ? 'border-red-500' : ''}
                                                maxLength={10}
                                            />
                                            {errors.code && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.code}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Format: P + nomor (contoh: P10, P11)
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Gangguan <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Nama gangguan mental"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={errors.name ? 'border-red-500' : ''}
                                                maxLength={255}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Predicted Category */}
                                    {predictedCategory && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Berdasarkan kode, gangguan ini akan masuk kategori: 
                                                <Badge className={`ml-2 ${predictedCategory.color}`}>
                                                    {predictedCategory.title}
                                                </Badge>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Deskripsi lengkap gangguan mental..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className={errors.description ? 'border-red-500' : ''}
                                            rows={4}
                                            maxLength={1000}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {data.description.length}/1000 karakter - Jelaskan karakteristik dan ciri-ciri gangguan mental ini
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="recommendation">Rekomendasi Penanganan</Label>
                                        <Textarea
                                            id="recommendation"
                                            placeholder="Rekomendasi penanganan untuk gangguan ini..."
                                            value={data.recommendation}
                                            onChange={(e) => setData('recommendation', e.target.value)}
                                            className={errors.recommendation ? 'border-red-500' : ''}
                                            rows={5}
                                            maxLength={1500}
                                        />
                                        {errors.recommendation && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.recommendation}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {data.recommendation.length}/1500 karakter - Saran penanganan awal yang dapat diberikan kepada pengguna
                                        </p>
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

                                    <div className="flex items-center justify-end space-x-4 pt-4">
                                        <Button variant="outline" type="button" asChild>
                                            <Link href="/admin/mental-disorders">
                                                Batal
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Gangguan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Panduan Pengisian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Kode Gangguan</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Gunakan format P + nomor urut</li>
                                        <li>• Pastikan kode unik dan belum digunakan</li>
                                        <li>• Maksimal 10 karakter</li>
                                        <li>• Contoh: P10, P11, P12</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Nama Gangguan</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Nama resmi gangguan mental sesuai standar psikologi/psikiatri</li>
                                        <li>• Gunakan terminologi yang tepat</li>
                                        <li>• Maksimal 255 karakter</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Deskripsi</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Jelaskan definisi, karakteristik utama, dan ciri-ciri gangguan</li>
                                        <li>• Gunakan bahasa yang mudah dipahami</li>
                                        <li>• Sertakan gejala-gejala utama</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Rekomendasi</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Berikan saran penanganan awal yang aman dan umum</li>
                                        <li>• Fokus pada langkah-langkah praktis</li>
                                        <li>• Hindari diagnosis medis spesifik</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Reference */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Referensi Kategori</CardTitle>
                                <CardDescription>
                                    Gangguan akan dikategorikan otomatis berdasarkan kode
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Badge className="bg-pink-100 text-pink-800 mr-2">Gangguan Mood</Badge>
                                    <span className="text-xs">P1-P3 (Kecemasan, Depresi, Bipolar)</span>
                                </div>
                                <div>
                                    <Badge className="bg-purple-100 text-purple-800 mr-2">Gangguan Psikotik</Badge>
                                    <span className="text-xs">P4 (Skizofrenia)</span>
                                </div>
                                <div>
                                    <Badge className="bg-green-100 text-green-800 mr-2">Gangguan Perilaku</Badge>
                                    <span className="text-xs">P5, P7-P9 (OCD, Anoreksia, Bulimia, BED)</span>
                                </div>
                                <div>
                                    <Badge className="bg-orange-100 text-orange-800 mr-2">Gangguan Trauma</Badge>
                                    <span className="text-xs">P6 (PTSD)</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Example Disorders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contoh Gangguan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm">P1 - Gangguan Kecemasan</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Gangguan yang ditandai dengan perasaan cemas berlebihan...
                                    </p>
                                </div>
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm">P2 - Depresi</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Gangguan mood dengan perasaan sedih berkepanjangan...
                                    </p>
                                </div>
                                <div className="p-3 border rounded">
                                    <div className="font-medium text-sm">P3 - Bipolar</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Gangguan mood dengan perubahan suasana hati ekstrem...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Tips:</strong> Pastikan semua informasi akurat karena akan digunakan dalam sistem diagnosis dan mempengaruhi hasil tes pengguna.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}