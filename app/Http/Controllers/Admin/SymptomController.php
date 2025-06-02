<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Symptom;
use App\Services\BackwardChainingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SymptomController extends Controller
{
    public function __construct(
        private BackwardChainingService $backwardChainingService
    ) {}

    /**
     * Display a listing of symptoms
     */
    public function index()
    {
        $symptoms = Symptom::orderBy('code')->paginate(15);

        $categories = $this->backwardChainingService->getSymptomCategories();

        return Inertia::render('Admin/Symptoms/Index', [
            'symptoms' => $symptoms,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new symptom
     */
    public function create()
    {
        return Inertia::render('Admin/Symptoms/Create');
    }

    /**
     * Store a newly created symptom
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:symptoms,code',
            'description' => 'required|string|max:500',
        ]);

        $symptom = Symptom::create($request->all());

        return redirect()
            ->route('admin.symptoms.index')
            ->with('success', 'Gejala berhasil ditambahkan.');
    }

    /**
     * Display the specified symptom
     */
    public function show(Symptom $symptom)
    {
        // Get rules that use this symptom
        $relatedRules = \App\Models\DiagnosisRule::whereJsonContains('symptom_codes', $symptom->code)
            ->with('mentalDisorder')
            ->get();

        // Get usage statistics
        $usageStats = \App\Models\UserDiagnosis::whereJsonContains('symptoms_reported', $symptom->code)
            ->count();

        return Inertia::render('Admin/Symptoms/Show', [
            'symptom' => $symptom,
            'related_rules' => $relatedRules,
            'usage_count' => $usageStats,
            'category' => $this->getSymptomCategory($symptom->code),
        ]);
    }

    /**
     * Show the form for editing the symptom
     */
    public function edit(Symptom $symptom)
    {
        return Inertia::render('Admin/Symptoms/Edit', [
            'symptom' => $symptom,
        ]);
    }

    /**
     * Update the specified symptom
     */
    public function update(Request $request, Symptom $symptom)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:symptoms,code,' . $symptom->id,
            'description' => 'required|string|max:500',
        ]);

        $symptom->update($request->all());

        return redirect()
            ->route('admin.symptoms.index')
            ->with('success', 'Gejala berhasil diperbarui.');
    }

    /**
     * Remove the specified symptom
     */
    public function destroy(Symptom $symptom)
    {
        // Check if symptom is used in diagnosis rules
        $usedInRules = \App\Models\DiagnosisRule::whereJsonContains('symptom_codes', $symptom->code)
            ->exists();

        if ($usedInRules) {
            return redirect()
                ->route('admin.symptoms.index')
                ->with('error', 'Tidak dapat menghapus gejala yang digunakan dalam aturan diagnosis.');
        }

        $symptom->delete();

        return redirect()
            ->route('admin.symptoms.index')
            ->with('success', 'Gejala berhasil dihapus.');
    }

    /**
     * Get all symptoms for API
     */
    public function api()
    {
        return response()->json([
            'data' => Symptom::orderBy('code')->get()
        ]);
    }

    /**
     * Get symptoms by category for API
     */
    public function byCategory()
    {
        $categories = $this->backwardChainingService->getSymptomCategories();

        return response()->json([
            'data' => $categories
        ]);
    }

    private function getSymptomCategory(string $symptomCode): string
    {
        $categories = [
            'mood_emotional' => ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27'],
            'cognitive' => ['G3', 'G8', 'G15', 'G16', 'G17', 'G18'],
            'physical' => ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24'],
            'behavioral' => ['G19', 'G22', 'G25', 'G26'],
            'trauma_related' => ['G20', 'G21']
        ];

        foreach ($categories as $category => $symptoms) {
            if (in_array($symptomCode, $symptoms)) {
                return $category;
            }
        }

        return 'other';
    }
}
