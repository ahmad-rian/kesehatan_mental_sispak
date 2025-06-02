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
    Heart,
    Brain,
    Users,
    Clock
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SymptomCategory {
    title: string;
    description: string;
    symptoms: any[];
    priority: number;
}

interface SymptomCreateProps {
    categories: Record<string, SymptomCategory>;
}

export default function SymptomCreate({ categories }: SymptomCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.symptoms.store'), {
            onSuccess: () => reset(),
        });
    };

    const getCategoryIcon = (categoryKey: string) => {
        const icons = {
            mood_emotional: Heart,
            cognitive: Brain,
            physical: Activity,
            behavioral: Users,
            trauma_related: Clock,
        };
        return icons[categoryKey as keyof typeof icons] || Activity;
    };

    const getCategoryColor = (categoryKey: string) => {
        const colors = {
            mood_emotional: 'bg-pink-100 text-pink-800',
            cognitive: 'bg-purple-100 text-purple-800',
            physical: 'bg-blue-100 text-blue-800',
            behavioral: 'bg-green-100 text-green-800',
            trauma_related: 'bg-orange-100 text-orange-800',
        };
        return colors[categoryKey as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

    const predictedCategory = data.code ? getCategoryInfo(data.code) : null;

    return (
        <AppLayout>
            <Head title="Tambah Gejala Baru" />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Gejala Baru</h1>
                            <p className="text-muted-foreground mt-1">
                                Tambahkan gejala baru ke dalam sistem expert
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
                                    <Activity className="h-5 w-5" />
                                    Form Tambah Gejala
                                </CardTitle>
                                <CardDescription>
                                    Masukkan informasi gejala yang akan ditambahkan ke database
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
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

                                    {/* Predicted Category */}
                                    {predictedCategory && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Berdasarkan kode, gejala ini akan masuk kategori: 
                                                <Badge className={`ml-2 ${predictedCategory.color}`}>
                                                    {predictedCategory.title}
                                                </Badge>
                                            </AlertDescription>
                                        </Alert>
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
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Gejala'}
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
                                <CardTitle className="text-lg">Panduan Pengisian</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kode Gejala</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Harus dimulai dengan huruf "G"</li>
                                        <li>• Diikuti dengan angka (contoh: G28)</li>
                                        <li>• Harus unik dan belum pernah digunakan</li>
                                        <li>• Maksimal 10 karakter</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Deskripsi</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Jelaskan gejala dengan jelas dan spesifik</li>
                                        <li>• Gunakan bahasa yang mudah dipahami</li>
                                        <li>• Maksimal 500 karakter</li>
                                        <li>• Hindari singkatan yang tidak umum</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Reference */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Referensi Kategori</CardTitle>
                                <CardDescription>
                                    Gejala akan dikategorikan otomatis berdasarkan kode
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {categories && Object.entries(categories).length > 0 ? (
                                    Object.entries(categories).map(([key, category]) => {
                                        const Icon = getCategoryIcon(key);
                                        const color = getCategoryColor(key);

                                        return (
                                            <div key={key} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Icon className="h-4 w-4" />
                                                    <Badge className={color}>
                                                        {category.title}
                                                    </Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {category.symptoms.length} gejala
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-muted-foreground">Belum ada data kategori.</span>
                                )}
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                Pastikan gejala yang ditambahkan relevan dengan sistem diagnosis 
                                kesehatan mental dan belum ada dalam database.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}