import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2,
    Activity,
    Heart,
    Brain,
    Users,
    Clock
} from 'lucide-react';
import { useState } from 'react';

interface Symptom {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface SymptomCategory {
    title: string;
    description: string;
    symptoms: Symptom[];
    priority: number;
}

interface PaginationData {
    current_page: number;
    data: Symptom[];
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

interface SymptomsIndexProps {
    symptoms: PaginationData;
    categories: Record<string, SymptomCategory>;
}

export default function SymptomsIndex({ symptoms, categories }: SymptomsIndexProps) {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const handleDelete = (symptom: Symptom) => {
        if (confirm(`Apakah Anda yakin ingin menghapus gejala "${symptom.description}"?`)) {
            router.delete(`/admin/symptoms/${symptom.id}`);
        }
    };

    // Filter symptoms for search (only for current page)
    const getFilteredSymptoms = () => {
        if (!search) return symptoms.data;
        
        return symptoms.data.filter(symptom =>
            symptom.description.toLowerCase().includes(search.toLowerCase()) ||
            symptom.code.toLowerCase().includes(search.toLowerCase())
        );
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

    const getSymptomCategory = (symptomCode: string) => {
        for (const [key, category] of Object.entries(categories)) {
            if (category.symptoms.some(s => s.code === symptomCode)) {
                return { key, ...category };
            }
        }
        return null;
    };

    const filteredSymptoms = getFilteredSymptoms();

    return (
        <AppLayout>
            <Head title="Gejala" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gejala</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola data gejala kesehatan mental (G1-G27)
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/symptoms/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Gejala
                        </Link>
                    </Button>
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
                            <div className="text-2xl font-bold">{symptoms.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Gejala dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    {Object.entries(categories).slice(0, 3).map(([key, category]) => {
                        const Icon = getCategoryIcon(key);
                        return (
                            <Card key={key}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {category.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{category.symptoms.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Gejala terkategori
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Gejala</CardTitle>
                        <CardDescription>
                            Kelola dan kategorisasi gejala kesehatan mental
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <div className="flex items-center justify-between mb-6">
                                <TabsList className="bg-muted p-1 rounded-lg">
                                    <TabsTrigger value="all" className="text-sm">Semua Gejala</TabsTrigger>
                                    {Object.entries(categories).map(([key, category]) => (
                                        <TabsTrigger key={key} value={key} className="text-sm">
                                            {category.title}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                
                                <div className="relative max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari gejala..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <TabsContent value="all" className="space-y-4">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Kode</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead>Terakhir Update</TableHead>
                                                <TableHead className="w-[70px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSymptoms.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8">
                                                        <div className="flex flex-col items-center space-y-3">
                                                            <Activity className="h-12 w-12 text-muted-foreground" />
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium">
                                                                    {search ? 'Tidak ada gejala yang ditemukan' : 'Belum ada gejala'}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {search ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambah gejala baru'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredSymptoms.map((symptom) => {
                                                    const category = getSymptomCategory(symptom.code);
                                                    return (
                                                        <TableRow key={symptom.id}>
                                                            <TableCell>
                                                                <Badge variant="outline" className="font-mono">
                                                                    {symptom.code}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="max-w-md">
                                                                <p className="text-sm leading-relaxed">
                                                                    {symptom.description}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>
                                                                {category && (
                                                                    <Badge className={getCategoryColor(category.key)}>
                                                                        {category.title}
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {new Date(symptom.updated_at).toLocaleDateString('id-ID')}
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
                                                                            <Link href={`/admin/symptoms/${symptom.id}`}>
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                Lihat Detail
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={`/admin/symptoms/${symptom.id}/edit`}>
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="text-red-600"
                                                                            onClick={() => handleDelete(symptom)}
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
                                {symptoms.total > symptoms.per_page && (
                                    <div className="flex items-center justify-between px-2 py-4">
                                        <div className="text-sm text-muted-foreground">
                                            Menampilkan {symptoms.from} sampai {symptoms.to} dari {symptoms.total} gejala
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {symptoms.prev_page_url && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => router.get(symptoms.prev_page_url!)}
                                                >
                                                    Previous
                                                </Button>
                                            )}
                                            
                                            {symptoms.links
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
                                            
                                            {symptoms.next_page_url && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => router.get(symptoms.next_page_url!)}
                                                >
                                                    Next
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {Object.entries(categories).map(([key, category]) => (
                                <TabsContent key={key} value={key}>
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                                            {(() => {
                                                const Icon = getCategoryIcon(key);
                                                return <Icon className="h-6 w-6" />;
                                            })()}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{category.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                                {category.symptoms.length} gejala
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid gap-4">
                                            {category.symptoms
                                                .filter(symptom => 
                                                    !search || 
                                                    symptom.description.toLowerCase().includes(search.toLowerCase()) ||
                                                    symptom.code.toLowerCase().includes(search.toLowerCase())
                                                )
                                                .map((symptom) => (
                                                    <div key={symptom.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                        <div className="space-y-2 flex-1">
                                                            <div className="flex items-center space-x-3">
                                                                <Badge variant="outline" className="font-mono">
                                                                    {symptom.code}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(symptom.updated_at).toLocaleDateString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm leading-relaxed">{symptom.description}</p>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/symptoms/${symptom.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Lihat Detail
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/symptoms/${symptom.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => handleDelete(symptom)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                ))}

                                            {category.symptoms
                                                .filter(symptom => 
                                                    !search || 
                                                    symptom.description.toLowerCase().includes(search.toLowerCase()) ||
                                                    symptom.code.toLowerCase().includes(search.toLowerCase())
                                                ).length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium">
                                                                {search ? 'Tidak ada gejala yang cocok dalam kategori ini' : 'Belum ada gejala dalam kategori ini'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {search ? 'Coba kata kunci yang berbeda' : 'Gejala akan muncul setelah ditambahkan'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}