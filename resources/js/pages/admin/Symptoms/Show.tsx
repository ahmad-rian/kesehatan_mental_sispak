import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Edit, 
    Trash2,
    Activity,
    Brain,
    Users,
    BarChart3,
    AlertTriangle,
    CheckCircle,
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

interface RelatedRule {
    id: number;
    rule_code: string;
    mental_disorder: {
        id: number;
        code: string;
        name: string;
    };
    symptom_codes: string[];
}

interface SymptomShowProps {
    symptom: Symptom;
    related_rules: RelatedRule[];
    usage_count: number;
    category: string;
}

export default function SymptomShow({ 
    symptom, 
    related_rules, 
    usage_count, 
    category 
}: SymptomShowProps) {
    const handleDelete = () => {
        if (related_rules.length > 0) {
            alert('Tidak dapat menghapus gejala yang masih digunakan dalam aturan diagnosis.');
            return;
        }

        if (usage_count > 0) {
            alert('Tidak dapat menghapus gejala yang sudah digunakan dalam diagnosis pengguna.');
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus gejala "${symptom.description}"?`)) {
            router.delete(route('admin.symptoms.destroy', symptom.id));
        }
    };

    const getCategoryInfo = (categoryKey: string) => {
        const categories = {
            'mood_emotional': {
                title: 'Mood & Emosional',
                color: 'bg-pink-100 text-pink-800 border-pink-200',
                description: 'Gejala yang berkaitan dengan perubahan mood dan kondisi emosional'
            },
            'cognitive': {
                title: 'Kognitif',
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                description: 'Gejala yang berkaitan dengan proses berpikir dan persepsi'
            },
            'physical': {
                title: 'Fisik',
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                description: 'Gejala yang bermanifestasi secara fisik'
            },
            'behavioral': {
                title: 'Perilaku',
                color: 'bg-green-100 text-green-800 border-green-200',
                description: 'Gejala yang berkaitan dengan perubahan perilaku'
            },
            'trauma_related': {
                title: 'Trauma Terkait',
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                description: 'Gejala yang berkaitan dengan trauma dan kenangan masa lalu'
            }
        };

        return categories[categoryKey as keyof typeof categories] || {
            title: 'Lainnya',
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            description: 'Kategori tidak terdefinisi'
        };
    };

    const categoryInfo = getCategoryInfo(category);
    const canDelete = related_rules.length === 0 && usage_count === 0;

    return (
        <AppLayout>
            <Head title={`Gejala ${symptom.code}`} />
            
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
                            <div className="flex items-center space-x-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Gejala {symptom.code}
                                </h1>
                                <Badge className={categoryInfo.color}>
                                    {categoryInfo.title}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Detail informasi dan statistik penggunaan gejala
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.symptoms.edit', symptom.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={!canDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Warning for non-deletable items */}
                {!canDelete && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Gejala ini tidak dapat dihapus karena{' '}
                            {related_rules.length > 0 && `digunakan dalam ${related_rules.length} aturan diagnosis`}
                            {related_rules.length > 0 && usage_count > 0 && ' dan '}
                            {usage_count > 0 && `sudah digunakan dalam ${usage_count} diagnosis pengguna`}.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Main Info & Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Basic Information */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Informasi Gejala
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                        Kode Gejala
                                    </h3>
                                    <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                                        {symptom.code}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                        Deskripsi
                                    </h3>
                                    <p className="text-base leading-relaxed">
                                        {symptom.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                        Kategori
                                    </h3>
                                    <div className="flex items-start space-x-3">
                                        <Badge className={categoryInfo.color}>
                                            {categoryInfo.title}
                                        </Badge>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {categoryInfo.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                            Dibuat
                                        </h3>
                                        <p className="text-sm flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {new Date(symptom.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                            Terakhir Update
                                        </h3>
                                        <p className="text-sm flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {new Date(symptom.updated_at).toLocaleDateString('id-ID', {
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
                    </div>

                    {/* Statistics */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Statistik Penggunaan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {usage_count}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Diagnosis
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {related_rules.length}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Aturan Terkait
                                    </p>
                                </div>

                                {(usage_count > 0 || related_rules.length > 0) && (
                                    <div className="pt-2 border-t">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">Aktif Digunakan</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href={route('admin.symptoms.edit', symptom.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Gejala
                                    </Link>
                                </Button>
                                
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <Link href="/admin/symptoms/create">
                                        <Activity className="mr-2 h-4 w-4" />
                                        Tambah Gejala Baru
                                    </Link>
                                </Button>

                                {related_rules.length > 0 && (
                                    <Button className="w-full justify-start" variant="outline" asChild>
                                        <Link href="/admin/diagnosis-rules">
                                            <Brain className="mr-2 h-4 w-4" />
                                            Lihat Aturan Terkait
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Related Rules */}
                {related_rules.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Aturan Diagnosis Terkait ({related_rules.length})
                            </CardTitle>
                            <CardDescription>
                                Aturan diagnosis yang menggunakan gejala ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Rule</TableHead>
                                            <TableHead>Gangguan Mental</TableHead>
                                            <TableHead>Total Gejala</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {related_rules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono">
                                                        {rule.rule_code}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">
                                                            {rule.mental_disorder.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {rule.mental_disorder.code}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {rule.symptom_codes.length} gejala
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('admin.diagnosis-rules.show', rule.id)}>
                                                            Lihat Detail
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Usage Warning */}
                {usage_count === 0 && related_rules.length === 0 && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Gejala ini belum digunakan dalam aturan diagnosis maupun diagnosis pengguna. 
                            Pertimbangkan untuk menambahkan aturan diagnosis yang menggunakan gejala ini 
                            atau menghapus gejala jika tidak relevan.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}