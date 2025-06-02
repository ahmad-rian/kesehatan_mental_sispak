import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    BarChart3,
    TrendingUp,
    TrendingDown,
    Activity,
    Brain,
    Users,
    Calendar,
    Download,
    Filter,
    PieChart,
    LineChart,
    Target,
    Zap,
    AlertCircle,
    CheckCircle
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
    BarChart as RechartsBarChart,
    Bar,
    Legend
} from 'recharts';

interface DiagnosisTrend {
    date: string;
    count: number;
}

interface DisorderDistribution {
    mental_disorder_id: number;
    count: number;
    mental_disorder: {
        id: number;
        name: string;
        code: string;
    };
}

interface SymptomFrequency {
    code: string;
    description: string;
    count: number;
}

interface ConfidenceAnalysis {
    average: number;
    median: number;
    distribution: {
        high: number;
        medium: number;
        low: number;
    };
}

interface UserEngagement {
    total_users: number;
    active_users: number;
    returning_users: number;
    average_consultations_per_user: number;
}

interface ReportData {
    diagnosis_trends: DiagnosisTrend[];
    disorder_distribution: DisorderDistribution[];
    symptom_frequency: SymptomFrequency[];
    confidence_analysis: ConfidenceAnalysis;
    user_engagement: UserEngagement;
}

interface AdminReportsIndexProps {
    report_data: ReportData;
}

export default function AdminReportsIndex({ report_data }: AdminReportsIndexProps) {
    const [timeRange, setTimeRange] = useState('30');
    const [exportFormat, setExportFormat] = useState('pdf');

    // Colors for charts
    const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6', '#F97316'];
    
    const getConfidenceColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEngagementRate = () => {
        if (report_data.user_engagement.total_users === 0) return 0;
        return Math.round((report_data.user_engagement.active_users / report_data.user_engagement.total_users) * 100);
    };

    const getRetentionRate = () => {
        if (report_data.user_engagement.active_users === 0) return 0;
        return Math.round((report_data.user_engagement.returning_users / report_data.user_engagement.active_users) * 100);
    };

    const getTotalDiagnoses = () => {
        return report_data.diagnosis_trends.reduce((sum, trend) => sum + trend.count, 0);
    };

    const getMostCommonDisorder = () => {
        if (report_data.disorder_distribution.length === 0) return null;
        return report_data.disorder_distribution.reduce((prev, current) => 
            (prev.count > current.count) ? prev : current
        );
    };

    const getAverageConfidenceText = (average: number) => {
        if (average >= 80) return 'Tinggi';
        if (average >= 60) return 'Sedang';
        return 'Rendah';
    };

    // Calculate trend direction for diagnosis
    const getDiagnosisTrend = () => {
        if (report_data.diagnosis_trends.length < 2) return 'stable';
        const recent = report_data.diagnosis_trends.slice(-7);
        const older = report_data.diagnosis_trends.slice(-14, -7);
        
        const recentAvg = recent.reduce((sum, d) => sum + d.count, 0) / recent.length;
        const olderAvg = older.length > 0 ? older.reduce((sum, d) => sum + d.count, 0) / older.length : recentAvg;
        
        if (recentAvg > olderAvg * 1.1) return 'up';
        if (recentAvg < olderAvg * 0.9) return 'down';
        return 'stable';
    };

    // Prepare data for charts
    const prepareLineChartData = () => {
        return report_data.diagnosis_trends.map(trend => ({
            date: new Date(trend.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            diagnoses: trend.count,
            dateObj: new Date(trend.date)
        })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    };

    const preparePieChartData = () => {
        const totalDiagnoses = getTotalDiagnoses();
        return report_data.disorder_distribution.slice(0, 6).map((disorder, index) => ({
            name: disorder.mental_disorder.code,
            fullName: disorder.mental_disorder.name,
            value: disorder.count,
            percentage: Math.round((disorder.count / totalDiagnoses) * 100),
            color: COLORS[index % COLORS.length]
        }));
    };

    const prepareConfidenceChartData = () => {
        return [
            {
                name: 'Tinggi (≥80%)',
                value: report_data.confidence_analysis.distribution.high,
                color: '#10B981'
            },
            {
                name: 'Sedang (60-79%)',
                value: report_data.confidence_analysis.distribution.medium,
                color: '#F59E0B'
            },
            {
                name: 'Rendah (<60%)',
                value: report_data.confidence_analysis.distribution.low,
                color: '#EF4444'
            }
        ];
    };

    const diagnosisTrend = getDiagnosisTrend();
    const mostCommonDisorder = getMostCommonDisorder();
    const lineChartData = prepareLineChartData();
    const pieChartData = preparePieChartData();
    const confidenceChartData = prepareConfidenceChartData();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{`Tanggal: ${label}`}</p>
                    <p className="text-sm text-blue-600">
                        {`Diagnosis: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{data.fullName}</p>
                    <p className="text-sm text-gray-600">
                        {`${data.value} diagnosis (${data.percentage}%)`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout>
            <Head title="Laporan & Analytics" />
            
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan & Analytics</h1>
                        <p className="text-muted-foreground mt-2">
                            Analisis mendalam tentang performa dan tren sistem kesehatan mental
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">7 Hari</SelectItem>
                                <SelectItem value="30">30 Hari</SelectItem>
                                <SelectItem value="90">3 Bulan</SelectItem>
                                <SelectItem value="365">1 Tahun</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Diagnosis
                            </CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalDiagnoses()}</div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                {diagnosisTrend === 'up' && (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-green-600">Meningkat</span>
                                    </>
                                )}
                                {diagnosisTrend === 'down' && (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                        <span className="text-red-600">Menurun</span>
                                    </>
                                )}
                                {diagnosisTrend === 'stable' && (
                                    <>
                                        <Activity className="h-3 w-3 text-blue-600" />
                                        <span className="text-blue-600">Stabil</span>
                                    </>
                                )}
                                <span>vs periode sebelumnya</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Engagement Rate
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getEngagementRate()}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {report_data.user_engagement.active_users} dari {report_data.user_engagement.total_users} pengguna
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg. Confidence
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round(report_data.confidence_analysis.average)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getAverageConfidenceText(report_data.confidence_analysis.average)} ({report_data.confidence_analysis.median}% median)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Retention Rate
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getRetentionRate()}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {report_data.user_engagement.returning_users} pengguna kembali
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Diagnosis Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LineChart className="h-5 w-5" />
                                Tren Diagnosis
                            </CardTitle>
                            <CardDescription>
                                Jumlah diagnosis harian dalam {timeRange} hari terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis 
                                            dataKey="date" 
                                            fontSize={12}
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <YAxis 
                                            fontSize={12}
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="diagnoses" 
                                            stroke="#3B82F6" 
                                            strokeWidth={2}
                                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                                        />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disorder Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Distribusi Gangguan
                            </CardTitle>
                            <CardDescription>
                                Persentase diagnosis berdasarkan jenis gangguan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center">
                                <div className="w-1/2">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className="space-y-2">
                                        {pieChartData.map((entry, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: entry.color }}
                                                ></div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-medium">{entry.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {entry.value} ({entry.percentage}%)
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Confidence Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Analisis Confidence Level
                        </CardTitle>
                        <CardDescription>
                            Distribusi tingkat keyakinan diagnosis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Bar Chart */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={confidenceChartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis 
                                            dataKey="name" 
                                            fontSize={11}
                                            tick={{ fill: '#6B7280' }}
                                            interval={0}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis 
                                            fontSize={12}
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <Tooltip 
                                            formatter={(value: any) => [`${value} diagnosis`, 'Jumlah']}
                                            labelStyle={{ color: '#374151' }}
                                        />
                                        <Bar 
                                            dataKey="value" 
                                            radius={[4, 4, 0, 0]}
                                        >
                                            {confidenceChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Statistics Cards */}
                            <div className="space-y-3">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center justify-center mb-2">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {report_data.confidence_analysis.distribution.high}
                                    </div>
                                    <p className="text-sm text-green-600 font-medium">Tinggi (≥80%)</p>
                                    <p className="text-xs text-green-600 mt-1">
                                        {Math.round((report_data.confidence_analysis.distribution.high / getTotalDiagnoses()) * 100)}% dari total
                                    </p>
                                </div>

                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center justify-center mb-2">
                                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-700">
                                        {report_data.confidence_analysis.distribution.medium}
                                    </div>
                                    <p className="text-sm text-yellow-600 font-medium">Sedang (60-79%)</p>
                                    <p className="text-xs text-yellow-600 mt-1">
                                        {Math.round((report_data.confidence_analysis.distribution.medium / getTotalDiagnoses()) * 100)}% dari total
                                    </p>
                                </div>

                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center justify-center mb-2">
                                        <AlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-red-700">
                                        {report_data.confidence_analysis.distribution.low}
                                    </div>
                                    <p className="text-sm text-red-600 font-medium">Rendah (&lt;60%)</p>
                                    <p className="text-xs text-red-600 mt-1">
                                        {Math.round((report_data.confidence_analysis.distribution.low / getTotalDiagnoses()) * 100)}% dari total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Top Disorders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Gangguan Paling Sering
                            </CardTitle>
                            <CardDescription>
                                Top 5 gangguan mental yang paling banyak didiagnosis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Gangguan</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead>Persentase</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report_data.disorder_distribution.slice(0, 5).map((disorder, index) => (
                                            <TableRow key={disorder.mental_disorder_id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="outline">
                                                                {disorder.mental_disorder.code}
                                                            </Badge>
                                                            {index === 0 && (
                                                                <Badge className="bg-gold-100 text-gold-800">
                                                                    #1
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {disorder.mental_disorder.name}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {disorder.count}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full" 
                                                                style={{
                                                                    width: `${(disorder.count / getTotalDiagnoses()) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {Math.round((disorder.count / getTotalDiagnoses()) * 100)}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Symptoms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Gejala Paling Sering
                            </CardTitle>
                            <CardDescription>
                                Top 5 gejala yang paling sering dilaporkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Gejala</TableHead>
                                            <TableHead>Frekuensi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report_data.symptom_frequency.slice(0, 5).map((symptom, index) => (
                                            <TableRow key={symptom.code}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="outline" className="font-mono">
                                                                {symptom.code}
                                                            </Badge>
                                                            {index === 0 && (
                                                                <Badge className="bg-purple-100 text-purple-800">
                                                                    Most Common
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm">
                                                            {symptom.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{symptom.count}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            kali dilaporkan
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Engagement Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Analisis Engagement Pengguna
                        </CardTitle>
                        <CardDescription>
                            Metrik keterlibatan dan aktivitas pengguna
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {report_data.user_engagement.total_users}
                                </div>
                                <p className="text-sm text-muted-foreground">Total Pengguna</p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {report_data.user_engagement.active_users}
                                </div>
                                <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
                                <p className="text-xs text-green-600 mt-1">
                                    {getEngagementRate()}% engagement rate
                                </p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {report_data.user_engagement.returning_users}
                                </div>
                                <p className="text-sm text-muted-foreground">Pengguna Kembali</p>
                                <p className="text-xs text-purple-600 mt-1">
                                    {getRetentionRate()}% retention rate
                                </p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {report_data.user_engagement.average_consultations_per_user.toFixed(1)}
                                </div>
                                <p className="text-sm text-muted-foreground">Avg. Konsultasi/User</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Insight & Rekomendasi
                        </CardTitle>
                        <CardDescription>
                            Analisis otomatis dan rekomendasi berdasarkan data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mostCommonDisorder && (
                                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-medium text-blue-900 mb-2">Gangguan Paling Umum</h4>
                                    <p className="text-blue-800 text-sm">
                                        <strong>{mostCommonDisorder.mental_disorder.name}</strong> adalah gangguan yang paling sering didiagnosis 
                                        dengan {mostCommonDisorder.count} kasus ({Math.round((mostCommonDisorder.count / getTotalDiagnoses()) * 100)}% dari total diagnosis).
                                    </p>
                                </div>
                            )}
                            
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h4 className="font-medium text-green-900 mb-2">Akurasi Sistem</h4>
                                <p className="text-green-800 text-sm">
                                    Rata-rata confidence level adalah {Math.round(report_data.confidence_analysis.average)}%, 
                                    menunjukkan tingkat akurasi yang {getAverageConfidenceText(report_data.confidence_analysis.average).toLowerCase()}. 
                                    {report_data.confidence_analysis.distribution.high} diagnosis memiliki confidence tinggi (≥80%).
                                </p>
                            </div>
                            
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                <h4 className="font-medium text-purple-900 mb-2">Engagement Pengguna</h4>
                                <p className="text-purple-800 text-sm">
                                    {getEngagementRate()}% pengguna aktif menggunakan sistem dengan retention rate {getRetentionRate()}%. 
                                    Rata-rata setiap pengguna melakukan {report_data.user_engagement.average_consultations_per_user.toFixed(1)} konsultasi.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}