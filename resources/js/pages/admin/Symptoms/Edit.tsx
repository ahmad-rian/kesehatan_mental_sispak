import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, 
    Save, 
    Activity,
    AlertCircle,
    Info,
    Clock
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Symptom {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface SymptomEditProps {
    symptom: Symptom;
}

export default function SymptomEdit({ symptom }: SymptomEditProps) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        code: symptom.code,
        description: symptom.description,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.symptoms.update', symptom.id));
    };

    const getCategoryInfo = (code: string) => {
        const categoryMapping = {
            'mood_emotional': {
                title: 'Mood & Emosional',
                color: 'bg-pink-100 text-pink-800',
                codes: ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27']
            },
            'cognitive': {
                title: 'Kognitif',
                color: 'bg-purple-100 text-purple-800',
                codes: ['G3', 'G8', 'G15', 'G16', 'G17', 'G18']
            },
            'physical': {
                title: 'Fisik',
                color: 'bg-blue-100 text-blue-800',
                codes: ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24']
            },
            'behavioral': {
                title: 'Perilaku',
                color: 'bg-green-100 text-green-800',
                codes: ['G19', 'G22', 'G25', 'G26']
            },
            'trauma_related': {
                title: 'Trauma Terkait',
                color: 'bg-orange-100 text-orange-800',
                codes: ['G20', 'G21']
            }
        };

        for (const [key, category] of Object.entries(categoryMapping)) {
            if (category.codes.includes(code)) {
                return category;
            }
        }
        return null;
    };

    const currentCategory = getCategoryInfo(data.code);
    const originalCategory = getCategoryInfo(symptom.code);
    const categoryChanged = data.code !== symptom.code && currentCategory?.title !== originalCategory?.title;

    return (
        <AppLayout>
            <Head title={`Edit Gejala ${symptom.code}`} />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/symptoms">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Gejala {symptom.code}</h1>
                            <p className="text-muted-foreground mt-1">
                                Perbarui informasi gejala dalam sistem expert
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                            Dibuat: {new Date(symptom.created_at).toLocaleDateString('id-ID')}
                        </Badge>
                        <Badge variant="secondary">
                            Update: {new Date(symptom.updated_at).toLocaleDateString('id-ID')}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Form Edit Gejala
                                </CardTitle>
                                <CardDescription>
                                    Perbarui informasi gejala. Hati-hati saat mengubah kode karena 
                                    akan mempengaruhi aturan diagnosis yang terkait.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Code Change Warning */}
                                    {data.code !== symptom.code && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Peringatan:</strong> Mengubah kode gejala dapat 
                                                mempengaruhi aturan diagnosis yang menggunakan kode ini.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Category Change Warning */}
                                    {categoryChanged && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Kategori akan berubah dari{' '}
                                                <Badge className={`mx-1 ${originalCategory?.color || 'bg-gray-100 text-gray-800'}`}>
                                                    {originalCategory?.title}
                                                </Badge>
                                                ke{' '}
                                                <Badge className={`mx-1 ${currentCategory?.color || 'bg-gray-100 text-gray-800'}`}>
                                                    {currentCategory?.title}
                                                </Badge>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Code Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="code">
                                            Kode Gejala <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            placeholder="Contoh: G28"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            className={errors.code ? 'border-red-500' : ''}
                                            maxLength={10}
                                        />
                                        {errors.code && (
                                            <p className="text-sm text-red-600">{errors.code}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Format: G diikuti angka (contoh: G28, G29, dst.)
                                        </p>
                                    </div>

                                    {/* Current Category */}
                                    {currentCategory && (
                                        <div className="space-y-2">
                                            <Label>Kategori Saat Ini</Label>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={currentCategory.color}>
                                                    {currentCategory.title}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi Gejala <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Masukkan deskripsi lengkap gejala..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className={errors.description ? 'border-red-500' : ''}
                                            rows={4}
                                            maxLength={500}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {data.description.length}/500 karakter
                                        </p>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex items-center justify-end space-x-4 pt-4">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/admin/symptoms">
                                                Batal
                                            </Link>
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={processing || !isDirty}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Original Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Informasi Asli
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Kode Asli
                                    </Label>
                                    <p className="font-mono text-sm">{symptom.code}</p>
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Deskripsi Asli
                                    </Label>
                                    <p className="text-sm">{symptom.description}</p>
                                </div>
                                {originalCategory && (
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Kategori Asli
                                        </Label>
                                        <Badge className={originalCategory.color}>
                                            {originalCategory.title}
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Panduan Edit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kode Gejala</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Harus tetap dimulai dengan huruf "G"</li>
                                        <li>• Pastikan kode baru belum digunakan</li>
                                        <li>• Maksimal 10 karakter</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Deskripsi</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Perbarui jika ada informasi lebih akurat</li>
                                        <li>• Gunakan bahasa yang konsisten</li>
                                        <li>• Maksimal 500 karakter</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                Perubahan pada gejala dapat mempengaruhi akurasi sistem diagnosis. 
                                Pastikan perubahan yang dilakukan sudah dipertimbangkan dengan matang.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}