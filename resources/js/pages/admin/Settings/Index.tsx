import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
    Settings,
    Database,
    Server,
    Shield,
    Bell,
    Mail,
    Brain,
    Activity,
    Zap,
    HardDrive,
    Clock,
    Users,
    Save,
    RefreshCw,
    Download,
    Upload,
    AlertTriangle,
    CheckCircle,
    Info,
    Gauge
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DatabaseSize {
    diagnoses: number;
    consultations: number;
    users: number;
    symptoms: number;
    disorders: number;
    rules: number;
}

interface SystemInfo {
    total_disorders: number;
    total_symptoms: number;
    total_rules: number;
    database_size: DatabaseSize;
}

interface PerformanceMetrics {
    average_consultation_time: string;
    system_uptime: string;
    response_time: string;
    accuracy_rate: string;
}

interface AdminSettingsIndexProps {
    system_info: SystemInfo;
    performance_metrics: PerformanceMetrics;
}

export default function AdminSettingsIndex({ system_info, performance_metrics }: AdminSettingsIndexProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [systemMaintenance, setSystemMaintenance] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);
    const [confidenceThreshold, setConfidenceThreshold] = useState('60');
    const [maxConsultationTime, setMaxConsultationTime] = useState('30');

    const handleSaveSettings = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Show success message
        }, 2000);
    };

    const handleSystemBackup = () => {
        // Trigger system backup
        console.log('Starting system backup...');
    };

    const handleSystemOptimize = () => {
        // Trigger system optimization
        console.log('Starting system optimization...');
    };

    const getSystemHealthStatus = () => {
        // Simple health check based on metrics
        const uptime = parseFloat(performance_metrics.system_uptime.replace('%', ''));
        const responseTime = parseFloat(performance_metrics.response_time.replace('< ', '').replace('ms', ''));
        const accuracy = parseFloat(performance_metrics.accuracy_rate.replace('%', ''));

        if (uptime >= 99 && responseTime <= 100 && accuracy >= 85) {
            return { status: 'excellent', color: 'bg-green-100 text-green-800', icon: CheckCircle };
        } else if (uptime >= 95 && responseTime <= 200 && accuracy >= 75) {
            return { status: 'good', color: 'bg-blue-100 text-blue-800', icon: Info };
        } else {
            return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
        }
    };

    const systemHealth = getSystemHealthStatus();
    const HealthIcon = systemHealth.icon;

    const getTotalRecords = () => {
        const { database_size } = system_info;
        return database_size.diagnoses + database_size.consultations + database_size.users + 
               database_size.symptoms + database_size.disorders + database_size.rules;
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Sistem" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola konfigurasi dan pengaturan sistem kesehatan mental
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" onClick={handleSystemBackup}>
                            <Download className="mr-2 h-4 w-4" />
                            Backup
                        </Button>
                        <Button variant="outline" onClick={handleSystemOptimize}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Optimize
                        </Button>
                    </div>
                </div>

                {/* System Health Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gauge className="h-5 w-5" />
                            Status Sistem
                        </CardTitle>
                        <CardDescription>
                            Ringkasan kesehatan dan performa sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* System Health */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status Kesehatan</span>
                                    <Badge className={systemHealth.color}>
                                        <HealthIcon className="w-3 h-3 mr-1" />
                                        {systemHealth.status === 'excellent' && 'Sangat Baik'}
                                        {systemHealth.status === 'good' && 'Baik'}
                                        {systemHealth.status === 'warning' && 'Perhatian'}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Uptime</span>
                                        <p className="font-medium">{performance_metrics.system_uptime}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Response Time</span>
                                        <p className="font-medium">{performance_metrics.response_time}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Akurasi</span>
                                        <p className="font-medium">{performance_metrics.accuracy_rate}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Avg. Konsultasi</span>
                                        <p className="font-medium">{performance_metrics.average_consultation_time}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Data Sistem</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Brain className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="font-medium">{system_info.total_disorders}</p>
                                            <p className="text-muted-foreground">Gangguan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Activity className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="font-medium">{system_info.total_symptoms}</p>
                                            <p className="text-muted-foreground">Gejala</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Zap className="h-4 w-4 text-purple-600" />
                                        <div>
                                            <p className="font-medium">{system_info.total_rules}</p>
                                            <p className="text-muted-foreground">Rules</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Database className="h-4 w-4 text-orange-600" />
                                        <div>
                                            <p className="font-medium">{getTotalRecords()}</p>
                                            <p className="text-muted-foreground">Total Records</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* System Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Konfigurasi Sistem
                            </CardTitle>
                            <CardDescription>
                                Pengaturan dasar sistem expert
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="confidence-threshold">
                                        Threshold Confidence Level (%)
                                    </Label>
                                    <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih threshold" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="50">50%</SelectItem>
                                            <SelectItem value="60">60%</SelectItem>
                                            <SelectItem value="70">70%</SelectItem>
                                            <SelectItem value="80">80%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Minimum confidence level untuk diagnosis valid
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max-consultation">
                                        Maksimal Waktu Konsultasi (menit)
                                    </Label>
                                    <Input
                                        id="max-consultation"
                                        type="number"
                                        value={maxConsultationTime}
                                        onChange={(e) => setMaxConsultationTime(e.target.value)}
                                        placeholder="30"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Batas waktu maksimal untuk satu sesi konsultasi
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Mode Maintenance</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Nonaktifkan akses pengguna untuk pemeliharaan
                                            </p>
                                        </div>
                                        <Switch
                                            checked={systemMaintenance}
                                            onCheckedChange={setSystemMaintenance}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Auto Backup</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Backup otomatis database harian
                                            </p>
                                        </div>
                                        <Switch
                                            checked={autoBackup}
                                            onCheckedChange={setAutoBackup}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Pengaturan Notifikasi
                            </CardTitle>
                            <CardDescription>
                                Konfigurasi notifikasi sistem dan alert
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Kirim notifikasi ke admin via email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Email Admin</Label>
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        defaultValue="ahmad.ritonga@mhs.unsoed.ac.id"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notification-types">Jenis Notifikasi</Label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="new-diagnosis" defaultChecked />
                                            <Label htmlFor="new-diagnosis" className="text-sm">
                                                Diagnosis baru
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="system-errors" defaultChecked />
                                            <Label htmlFor="system-errors" className="text-sm">
                                                System errors
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="low-confidence" defaultChecked />
                                            <Label htmlFor="low-confidence" className="text-sm">
                                                Diagnosis confidence rendah
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="daily-report" />
                                            <Label htmlFor="daily-report" className="text-sm">
                                                Laporan harian
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Database Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Informasi Database
                        </CardTitle>
                        <CardDescription>
                            Detail ukuran dan struktur database sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tabel</TableHead>
                                        <TableHead>Jumlah Records</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-blue-600" />
                                                <span>users</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.users.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Data pengguna sistem
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Brain className="h-4 w-4 text-purple-600" />
                                                <span>user_diagnoses</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.diagnoses.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Hasil diagnosis pengguna
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-orange-600" />
                                                <span>consultations</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.consultations.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Riwayat sesi konsultasi
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Activity className="h-4 w-4 text-green-600" />
                                                <span>symptoms</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.symptoms.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Master data gejala
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Brain className="h-4 w-4 text-blue-600" />
                                                <span>mental_disorders</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.disorders.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Master data gangguan mental
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Zap className="h-4 w-4 text-purple-600" />
                                                <span>diagnosis_rules</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{system_info.database_size.rules.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Rules sistem expert
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* System Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Tindakan Sistem
                        </CardTitle>
                        <CardDescription>
                            Operasi maintenance dan administrasi sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-medium">Data Management</h4>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Database
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Import Data
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Optimize Database
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="font-medium">System Maintenance</h4>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <HardDrive className="mr-2 h-4 w-4" />
                                        Clear Cache
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Activity className="mr-2 h-4 w-4" />
                                        View System Logs
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Reset System
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Pengaturan Keamanan
                        </CardTitle>
                        <CardDescription>
                            Konfigurasi keamanan dan akses sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-medium">Authentication</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Google OAuth</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Izinkan login dengan Google
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Email Verification</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Wajibkan verifikasi email
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium">Access Control</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Rate Limiting</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Batasi request per pengguna
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>IP Whitelist</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Batasi akses admin berdasarkan IP
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center justify-end space-x-4">
                    <Button variant="outline">
                        Batal
                    </Button>
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Pengaturan
                            </>
                        )}
                    </Button>
                </div>

                {/* Warning Alert */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Perubahan pada pengaturan sistem dapat mempengaruhi performa dan keamanan. 
                        Pastikan untuk melakukan backup sebelum mengubah konfigurasi penting.
                    </AlertDescription>
                </Alert>
            </div>
        </AppLayout>
    );
}