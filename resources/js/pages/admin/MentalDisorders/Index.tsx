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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2,
    Brain,
    AlertCircle,
    FileText,
    Activity
} from 'lucide-react';
import { useState } from 'react';

interface MentalDisorder {
    id: number;
    code: string;
    name: string;
    description: string;
    recommendation: string;
    diagnosis_rules_count: number;
    user_diagnoses_count: number;
    created_at: string;
    updated_at: string;
}

interface PaginationData {
    current_page: number;
    data: MentalDisorder[];
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

interface MentalDisordersIndexProps {
    disorders: PaginationData;
}

export default function MentalDisordersIndex({ disorders }: MentalDisordersIndexProps) {
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDisorder, setSelectedDisorder] = useState<MentalDisorder | null>(null);

    const handleDeleteClick = (disorder: MentalDisorder) => {
        setSelectedDisorder(disorder);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedDisorder) {
            router.delete(`/admin/mental-disorders/${selectedDisorder.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedDisorder(null);
                },
                onError: () => {
                    // Error handling sudah dari controller
                }
            });
        }
    };

    const filteredDisorders = disorders.data.filter(disorder =>
        disorder.name.toLowerCase().includes(search.toLowerCase()) ||
        disorder.code.toLowerCase().includes(search.toLowerCase()) ||
        disorder.description.toLowerCase().includes(search.toLowerCase())
    );

    const canDelete = (disorder: MentalDisorder) => {
        return disorder.diagnosis_rules_count === 0 && disorder.user_diagnoses_count === 0;
    };

    // Tab filtering - similar to symptoms page
    const [activeTab, setActiveTab] = useState('Semua Gangguan');
    const tabs = [
    'Semua Gangguan',
    'Gangguan Kecemasan',
    'Gangguan Mood', 
    'Gangguan Psikotik',
    'Gangguan Obsesif',
    'Gangguan Trauma',
    'Gangguan Perilaku'
];

   const getDisorderCategory = (code: string) => {
    if (['P1'].includes(code)) return 'Gangguan Kecemasan';
    if (['P2', 'P3'].includes(code)) return 'Gangguan Mood';
    if (['P4'].includes(code)) return 'Gangguan Psikotik';
    if (['P5'].includes(code)) return 'Gangguan Obsesif';
    if (['P6'].includes(code)) return 'Gangguan Trauma';
    if (['P7', 'P8', 'P9'].includes(code)) return 'Gangguan Perilaku';
    return 'Lainnya';
};

    const filteredByTab = filteredDisorders.filter(disorder => {
        if (activeTab === 'Semua Gangguan') return true;
        return getDisorderCategory(disorder.code) === activeTab;
    });

    return (
        <AppLayout>
            <Head title="Gangguan Mental" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gangguan Mental</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola data gangguan kesehatan mental (P1-P9)
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/mental-disorders/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Gangguan Mental
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Gangguan Mental
                            </CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{disorders.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Jenis gangguan dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Gangguan Mood
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                       <CardContent>
    <div className="text-2xl font-bold">
        {disorders.data.filter(d => ['P2', 'P3'].includes(d.code)).length}
    </div>
    <p className="text-xs text-muted-foreground">
        Gangguan Mood
    </p>
</CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Aturan Diagnosis
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {disorders.data.reduce((sum, d) => sum + d.diagnosis_rules_count, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rules yang terkait
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Diagnosis
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {disorders.data.reduce((sum, d) => sum + d.user_diagnoses_count, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Diagnosis pengguna
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Gangguan Mental</CardTitle>
                        <CardDescription>
                            Kelola dan kategorisasi gangguan kesehatan mental
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Tabs - similar to symptoms page */}
                        <div className="mb-6">
                            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                                {tabs.map((tab) => (
                                    <Button
                                        key={tab}
                                        variant={activeTab === tab ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setActiveTab(tab)}
                                        className="text-xs"
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari gangguan mental..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Gangguan</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Terakhir Update</TableHead>
                                        <TableHead className="w-[70px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredByTab.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <Brain className="h-12 w-12 text-muted-foreground" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">Tidak ada gangguan mental ditemukan</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {search ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambah gangguan mental baru'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredByTab.map((disorder) => (
                                            <TableRow key={disorder.id}>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono">
                                                        {disorder.code}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {disorder.name}
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {disorder.description || 'Tidak ada deskripsi'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        className={
                                                            getDisorderCategory(disorder.code) === 'Gangguan Mood' ? 'bg-pink-100 text-pink-800' :
                                                            getDisorderCategory(disorder.code) === 'Gangguan Kecemasan' ? 'bg-yellow-100 text-yellow-800' :
                                                            getDisorderCategory(disorder.code) === 'Gangguan Perilaku' ? 'bg-green-100 text-green-800' :
                                                            getDisorderCategory(disorder.code) === 'Gangguan Trauma' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {getDisorderCategory(disorder.code)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(disorder.updated_at).toLocaleDateString('id-ID')}
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
                                                                <Link href={`/admin/mental-disorders/${disorder.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/mental-disorders/${disorder.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className={`text-red-600 ${!canDelete(disorder) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={() => canDelete(disorder) && handleDeleteClick(disorder)}
                                                                disabled={!canDelete(disorder)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {disorders.total > disorders.per_page && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {disorders.from} sampai {disorders.to} dari {disorders.total} gangguan mental
                                </div>
                                <div className="flex items-center space-x-2">
                                    {disorders.prev_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(disorders.prev_page_url!)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    
                                    {disorders.links
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
                                    
                                    {disorders.next_page_url && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.get(disorders.next_page_url!)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus gangguan mental "{selectedDisorder?.name}"?
                                <br />
                                <br />
                                {selectedDisorder && !canDelete(selectedDisorder) && (
                                    <span className="text-red-600 font-medium">
                                        ⚠️ Gangguan mental ini tidak dapat dihapus karena memiliki {selectedDisorder.diagnosis_rules_count} aturan diagnosis dan {selectedDisorder.user_diagnoses_count} riwayat diagnosis pengguna.
                                    </span>
                                )}
                                {selectedDisorder && canDelete(selectedDisorder) && (
                                    <span className="text-orange-600">
                                        Tindakan ini tidak dapat dibatalkan.
                                    </span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            {selectedDisorder && canDelete(selectedDisorder) && (
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Hapus
                                </AlertDialogAction>
                                )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}