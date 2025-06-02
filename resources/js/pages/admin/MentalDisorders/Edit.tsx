import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, AlertCircle, Info, Clock, Brain } from 'lucide-react';
import { FormEventHandler } from 'react';

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
    description: string;
    recommendation: string;
    created_at: string;
    updated_at: string;
}

interface EditMentalDisorderProps {
    disorder: MentalDisorder;
}

export default function EditMentalDisorder({ disorder }: EditMentalDisorderProps) {
    const { data, setData, put, processing, errors, progress } = useForm({
        code: disorder.code,
        name: disorder.name,
        description: disorder.description || '',
        recommendation: disorder.recommendation || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/mental-disorders/${disorder.id}`, {
            onSuccess: () => {
                // Redirect akan dilakukan otomatis oleh controller
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

    const currentCategory = data.code ? getCategoryInfo(data.code) : null;

    return (
        <AppLayout>
            <Head title={`Edit ${disorder.name}`} />
            
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
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight">Edit Gangguan Mental</h1>
                                <Badge variant="outline" className="font-mono">{disorder.code}</Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Edit informasi gangguan mental: {disorder.name}
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
                                    Form Edit Gangguan Mental
                                </CardTitle>
                                <CardDescription>
                                    Update detail gangguan mental
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

                                    {/* Current Category */}
                                    {currentCategory && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Kategori saat ini: 
                                                <Badge className={`ml-2 ${currentCategory.color}`}>
                                                    {currentCategory.title}
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
                                                Updating... {progress.percentage}%
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
                                            {processing ? 'Menyimpan...' : 'Update Gangguan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Informasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">ID</h4>
                                    <p className="text-sm text-muted-foreground">#{disorder.id}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Kode Lama</h4>
                                    <Badge variant="outline" className="font-mono">{disorder.code}</Badge>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Dibuat</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(disorder.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Terakhir Update</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(disorder.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Edit Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Panduan Edit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kode Gangguan</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Hati-hati mengubah kode karena dapat mempengaruhi aturan diagnosis yang sudah ada.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Nama Gangguan</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Pastikan nama sesuai dengan standar medis yang berlaku.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Dampak Perubahan</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Perubahan akan mempengaruhi diagnosis masa depan, namun tidak mengubah riwayat diagnosis yang sudah ada.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Reference */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Referensi Kategori</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Badge className="bg-pink-100 text-pink-800 mr-2">Gangguan Mood</Badge>
                                    <span className="text-xs">P1-P3</span>
                                </div>
                                <div>
                                    <Badge className="bg-purple-100 text-purple-800 mr-2">Gangguan Psikotik</Badge>
                                    <span className="text-xs">P4</span>
                                </div>
                                <div>
                                    <Badge className="bg-green-100 text-green-800 mr-2">Gangguan Perilaku</Badge>
                                    <span className="text-xs">P5, P7-P9</span>
                                </div>
                                <div>
                                    <Badge className="bg-orange-100 text-orange-800 mr-2">Gangguan Trauma</Badge>
                                    <span className="text-xs">P6</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Perhatian:</strong> Perubahan pada gangguan mental akan mempengaruhi sistem diagnosis. Pastikan semua informasi akurat dan sesuai standar medis.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}