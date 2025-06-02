<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiagnosisRule;
use App\Models\MentalDisorder;
use App\Models\Symptom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiagnosisRuleController extends Controller
{
    /**
     * Display a listing of diagnosis rules
     */
    public function index()
    {
        $rules = DiagnosisRule::with('mentalDisorder')
            ->orderBy('rule_code')
            ->paginate(10);

        return Inertia::render('Admin/DiagnosisRules/Index', [
            'rules' => $rules,
        ]);
    }

    /**
     * Show the form for creating a new diagnosis rule
     */
    public function create()
    {
        $disorders = MentalDisorder::orderBy('code')->get();
        $symptoms = Symptom::orderBy('code')->get();

        return Inertia::render('Admin/DiagnosisRules/Create', [
            'disorders' => $disorders,
            'symptoms' => $symptoms,
        ]);
    }

    /**
     * Store a newly created diagnosis rule
     */
    public function store(Request $request)
    {
        $request->validate([
            'rule_code' => 'required|string|max:10|unique:diagnosis_rules,rule_code',
            'mental_disorder_id' => 'required|exists:mental_disorders,id',
            'symptom_codes' => 'required|array|min:1',
            'symptom_codes.*' => 'exists:symptoms,code',
        ]);

        $rule = DiagnosisRule::create([
            'rule_code' => $request->rule_code,
            'mental_disorder_id' => $request->mental_disorder_id,
            'symptom_codes' => $request->symptom_codes,
        ]);

        return redirect()
            ->route('admin.diagnosis-rules.index')
            ->with('success', 'Aturan diagnosis berhasil ditambahkan.');
    }

    /**
     * Display the specified diagnosis rule
     */
    public function show(DiagnosisRule $diagnosisRule)
    {
        $diagnosisRule->load('mentalDisorder');

        // Get symptom details
        $symptomDetails = Symptom::getByCodes($diagnosisRule->symptom_codes);

        // Get test cases - sample user symptoms that match this rule
        $testCases = $this->generateTestCases($diagnosisRule);

        return Inertia::render('Admin/DiagnosisRules/Show', [
            'rule' => $diagnosisRule,
            'symptom_details' => $symptomDetails,
            'test_cases' => $testCases,
        ]);
    }

    /**
     * Show the form for editing the diagnosis rule
     */
    public function edit(DiagnosisRule $diagnosisRule)
    {
        $diagnosisRule->load('mentalDisorder');
        $disorders = MentalDisorder::orderBy('code')->get();
        $symptoms = Symptom::orderBy('code')->get();
        $symptomDetails = Symptom::getByCodes($diagnosisRule->symptom_codes);

        return Inertia::render('Admin/DiagnosisRules/Edit', [
            'rule' => $diagnosisRule,
            'disorders' => $disorders,
            'symptoms' => $symptoms,
            'symptom_details' => $symptomDetails,
        ]);
    }

    /**
     * Update the specified diagnosis rule
     */
    public function update(Request $request, DiagnosisRule $diagnosisRule)
    {
        $request->validate([
            'rule_code' => 'required|string|max:10|unique:diagnosis_rules,rule_code,' . $diagnosisRule->id,
            'mental_disorder_id' => 'required|exists:mental_disorders,id',
            'symptom_codes' => 'required|array|min:1',
            'symptom_codes.*' => 'exists:symptoms,code',
        ]);

        $diagnosisRule->update([
            'rule_code' => $request->rule_code,
            'mental_disorder_id' => $request->mental_disorder_id,
            'symptom_codes' => $request->symptom_codes,
        ]);

        return redirect()
            ->route('admin.diagnosis-rules.index')
            ->with('success', 'Aturan diagnosis berhasil diperbarui.');
    }

    /**
     * Remove the specified diagnosis rule
     */
    public function destroy(DiagnosisRule $diagnosisRule)
    {
        $diagnosisRule->delete();

        return redirect()
            ->route('admin.diagnosis-rules.index')
            ->with('success', 'Aturan diagnosis berhasil dihapus.');
    }

    /**
     * Test diagnosis rule with sample symptoms
     */
    public function test(Request $request, DiagnosisRule $diagnosisRule)
    {
        $request->validate([
            'test_symptoms' => 'required|array|min:1',
            'test_symptoms.*' => 'exists:symptoms,code',
        ]);

        $testSymptoms = $request->test_symptoms;
        $confidence = $diagnosisRule->calculateConfidence($testSymptoms);
        $matches = $diagnosisRule->matchesSymptoms($testSymptoms);
        $matchedSymptoms = $diagnosisRule->getMatchedSymptoms($testSymptoms);
        $missingSymptoms = $diagnosisRule->getMissingSymptoms($testSymptoms);

        return response()->json([
            'confidence' => $confidence,
            'matches' => $matches,
            'matched_symptoms' => $matchedSymptoms,
            'missing_symptoms' => $missingSymptoms,
            'matched_details' => Symptom::getByCodes($matchedSymptoms),
            'missing_details' => Symptom::getByCodes($missingSymptoms),
        ]);
    }

    /**
     * Get all rules for API
     */
    public function api()
    {
        $rules = DiagnosisRule::with('mentalDisorder')
            ->orderBy('rule_code')
            ->get();

        return response()->json([
            'data' => $rules
        ]);
    }

    /**
     * Get rules by disorder
     */
    public function byDisorder(MentalDisorder $disorder)
    {
        $rules = $disorder->diagnosisRules()
            ->orderBy('rule_code')
            ->get();

        return response()->json([
            'data' => $rules
        ]);
    }

    /**
     * Generate test cases for a rule
     */
    private function generateTestCases(DiagnosisRule $rule): array
    {
        $requiredSymptoms = $rule->symptom_codes;
        $allSymptoms = Symptom::pluck('code')->toArray();
        $additionalSymptoms = array_diff($allSymptoms, $requiredSymptoms);

        return [
            'exact_match' => [
                'name' => 'Exact Match (100%)',
                'symptoms' => $requiredSymptoms,
                'expected_confidence' => 100,
            ],
            'partial_match' => [
                'name' => 'Partial Match (~67%)',
                'symptoms' => array_slice($requiredSymptoms, 0, ceil(count($requiredSymptoms) * 0.67)),
                'expected_confidence' => 67,
            ],
            'with_extra_symptoms' => [
                'name' => 'With Extra Symptoms (100%+)',
                'symptoms' => array_merge(
                    $requiredSymptoms,
                    array_slice($additionalSymptoms, 0, 2)
                ),
                'expected_confidence' => 100,
            ],
            'minimal_match' => [
                'name' => 'Minimal Match (~33%)',
                'symptoms' => array_slice($requiredSymptoms, 0, 1),
                'expected_confidence' => 33,
            ],
        ];
    }

    /**
     * Bulk update rules (for admin convenience)
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'rules' => 'required|array',
            'rules.*.id' => 'required|exists:diagnosis_rules,id',
            'rules.*.symptom_codes' => 'required|array|min:1',
            'rules.*.symptom_codes.*' => 'exists:symptoms,code',
        ]);

        foreach ($request->rules as $ruleData) {
            $rule = DiagnosisRule::findOrFail($ruleData['id']);
            $rule->update(['symptom_codes' => $ruleData['symptom_codes']]);
        }

        return redirect()
            ->route('admin.diagnosis-rules.index')
            ->with('success', 'Aturan diagnosis berhasil diperbarui secara bulk.');
    }
}
