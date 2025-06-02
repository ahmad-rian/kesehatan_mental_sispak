import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Brain, 
    Users, 
    Activity, 
    TrendingUp, 
    Zap,
    Settings,
    TestTube,
    Eye,
    ArrowUpRight,
    BarChart3
} from 'lucide-react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
    AreaChart,
    Area
} from 'recharts';

interface DashboardProps {
    stats: {
        total_diagnoses: number;
        total_consultations: number;
        completed_consultations: number;
        active_consultations: number;
        average_confidence: number | string | null;
        most_common_disorder: {
            disorder: {
                id: number;
                name: string;
                code: string;
            };
            count: number;
        } | null;
        most_reported_symptoms: Array<{
            code: string;
            description: string;
            count: number;
        }>;
        diagnosis_by_confidence: {
            high: number;
            medium: number;
            low: number;
        };
    };
    recent_activity: {
        diagnoses: Array<{
            id: number;
            user: {
                id: number;
                name: string;
                email: string;
            };
            mental_disorder: {
                id: number;
                name: string;
                code: string;
            };
            confidence_level: number;
            created_at: string;
        }>;
        consultations: Array<{
            id: number;
            user: {
                id: number;
                name: string;
                email: string;
            };
            status: string;
            created_at: string;
        }>;
    };
    chart_data: {
        daily_activity: Array<{
            date: string;
            label: string;
            diagnoses: number;
            consultations: number;
        }>;
        disorder_breakdown: Array<{
            name: string;
            count: number;
        }>;
        confidence_distribution: Array<{
            range: string;
            count: number;
        }>;
    };
    system_health: {
        rules_coverage: number | string | null;
        symptom_utilization: number | string | null;
        average_confidence: number | string | null;
        completion_rate: number | string | null;
        status: string;
    };
}

export default function AdminDashboard({ 
    stats, 
    recent_activity, 
    chart_data, 
    system_health
}: DashboardProps) {
    // Helper function to safely convert to number and format
    const safeToFixed = (value: number | string | null | undefined, decimals: number = 1): string => {
        if (value === null || value === undefined) return '0';
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        return isNaN(numValue) ? '0' : numValue.toFixed(decimals);
    };

    // Helper function to safely convert to number
    const safeToNumber = (value: number | string | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        return isNaN(numValue) ? 0 : numValue;
    };

    // Colors for charts
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    // System info fallback (you can get this from actual API later)
    const system_info = {
        total_disorders: 9, // P1-P9
        total_symptoms: 27, // G1-G27  
        total_rules: chart_data?.disorder_breakdown?.length || 10 // Estimate from available data
    };
    
    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 text-green-800';
        if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    // Prepare chart data
    const prepareActivityData = () => {
        if (!chart_data?.daily_activity) return [];
        return chart_data.daily_activity.map(item => ({
            label: item.label,
            total: item.diagnoses + item.consultations
        }));
    };

    const prepareDisorderData = () => {
        if (!chart_data?.disorder_breakdown) return [];
        return chart_data.disorder_breakdown.slice(0, 4).map((item, index) => ({
            name: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
            value: item.count,
            color: COLORS[index]
        }));
    };

    const prepareConfidenceData = () => {
        if (!stats?.diagnosis_by_confidence) return [];
        return [
            { name: 'Tinggi', value: stats.diagnosis_by_confidence.high || 0, color: '#10B981' },
            { name: 'Sedang', value: stats.diagnosis_by_confidence.medium || 0, color: '#F59E0B' },
            { name: 'Rendah', value: stats.diagnosis_by_confidence.low || 0, color: '#EF4444' }
        ];
    };

    const activityData = prepareActivityData();
    const disorderData = prepareDisorderData();
    const confidenceData = prepareConfidenceData();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-blue-600">Total: {payload[0]?.value || 0}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Overview sistem pakar kesehatan mental
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-3">
                        <Button asChild>
                            <Link href="/admin/test-system">
                                <TestTube className="mr-2 h-4 w-4" />
                                Test Sistem
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/reports">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Reports
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* System Info Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Gangguan Mental
                                <Brain className="h-4 w-4 text-blue-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{system_info.total_disorders}</div>
                            <p className="text-xs text-muted-foreground">Total penyakit (P1-P9)</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Gejala
                                <Activity className="h-4 w-4 text-green-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{system_info.total_symptoms}</div>
                            <p className="text-xs text-muted-foreground">Total gejala (G1-G27)</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Rules Diagnosis
                                <Zap className="h-4 w-4 text-purple-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{system_info.total_rules}</div>
                            <p className="text-xs text-muted-foreground">Aturan backward chaining</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Total Diagnosis
                                <TrendingUp className="h-4 w-4 text-orange-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats?.total_diagnoses || 0}</div>
                            <p className="text-xs text-muted-foreground">Hasil diagnosis pengguna</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Activity Trend */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Aktivitas 7 Hari Terakhir</CardTitle>
                            <CardDescription>Tren diagnosis dan konsultasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="label" fontSize={12} tick={{ fill: '#6B7280' }} />
                                        <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#3B82F6"
                                            fill="url(#totalGradient)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Disorders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Top Gangguan</CardTitle>
                            <CardDescription>4 gangguan paling sering</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={disorderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {disorderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-1 mt-2">
                                {disorderData.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                            <span>{entry.name}</span>
                                        </div>
                                        <span className="font-medium">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Confidence Analysis & System Status */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Analisis Confidence</CardTitle>
                            <CardDescription>Distribusi tingkat akurasi diagnosis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {confidenceData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full" 
                                                    style={{ 
                                                        backgroundColor: item.color,
                                                        width: `${confidenceData.length > 0 ? (item.value / Math.max(...confidenceData.map(d => d.value))) * 100 : 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold w-8">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {safeToFixed(stats?.average_confidence)}%
                                    </div>
                                    <p className="text-sm text-blue-700">Rata-rata Akurasi</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Status Sistem</CardTitle>
                            <CardDescription>Kesehatan dan performa sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Completion Rate</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        {safeToFixed(system_health?.completion_rate)}%
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Konsultasi Aktif</span>
                                        <span className="text-sm font-medium">{stats?.active_consultations || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${Math.min((safeToNumber(stats?.active_consultations) / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Symptom Utilization</span>
                                        <span className="text-sm font-medium">{safeToFixed(system_health?.symptom_utilization)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${safeToNumber(system_health?.symptom_utilization)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                Diagnosis Terbaru
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/admin/user-diagnoses">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_activity?.diagnoses && recent_activity.diagnoses.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_activity.diagnoses.slice(0, 3).map((diagnosis) => (
                                        <div key={diagnosis.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium">{diagnosis.user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {diagnosis.mental_disorder.code} - {diagnosis.mental_disorder.name.substring(0, 20)}
                                                </p>
                                            </div>
                                            <Badge className={getConfidenceBadgeColor(diagnosis.confidence_level)}>
                                                {diagnosis.confidence_level}%
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">Belum ada diagnosis</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <Button className="justify-start" variant="outline" asChild>
                                    <Link href="/admin/mental-disorders">
                                        <Brain className="mr-2 h-4 w-4" />
                                        Kelola Gangguan Mental
                                    </Link>
                                </Button>
                                <Button className="justify-start" variant="outline" asChild>
                                    <Link href="/admin/symptoms">
                                        <Activity className="mr-2 h-4 w-4" />
                                        Kelola Gejala
                                    </Link>
                                </Button>
                                <Button className="justify-start" variant="outline" asChild>
                                    <Link href="/admin/diagnosis-rules">
                                        <Zap className="mr-2 h-4 w-4" />
                                        Kelola Rules
                                    </Link>
                                </Button>
                                <Button className="justify-start" variant="outline" asChild>
                                    <Link href="/admin/users">
                                        <Users className="mr-2 h-4 w-4" />
                                        Manajemen Users
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Summary */}
                {stats?.most_common_disorder && (
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-900">Gangguan Paling Umum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-700">
                                        {stats.most_common_disorder.disorder.name}
                                    </h3>
                                    <p className="text-blue-600">
                                        {stats.most_common_disorder.count} diagnosis ({stats.most_common_disorder.disorder.code})
                                    </p>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href={`/admin/mental-disorders/${stats.most_common_disorder.disorder.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Detail
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}