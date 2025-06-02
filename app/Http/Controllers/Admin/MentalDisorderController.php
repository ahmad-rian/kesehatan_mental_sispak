<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MentalDisorder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MentalDisorderController extends Controller
{
    /**
     * Display a listing of mental disorders
     */
    public function index()
    {
        $disorders = MentalDisorder::withCount(['diagnosisRules', 'userDiagnoses'])
            ->orderBy('code')
            ->paginate(10);

        return Inertia::render('Admin/MentalDisorders/Index', [
            'disorders' => $disorders,
        ]);
    }

    /**
     * Show the form for creating a new mental disorder
     */
    public function create()
    {
        return Inertia::render('Admin/MentalDisorders/Create');
    }

    /**
     * Store a newly created mental disorder
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:mental_disorders,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recommendation' => 'nullable|string',
        ]);

        $disorder = MentalDisorder::create($request->all());

        return redirect()
            ->route('admin.mental-disorders.index')
            ->with('success', 'Gangguan mental berhasil ditambahkan.');
    }

    /**
     * Display the specified mental disorder
     */
    public function show(MentalDisorder $mentalDisorder)
    {
        $mentalDisorder->load([
            'diagnosisRules',
            'userDiagnoses' => function ($query) {
                $query->with('user')->latest()->take(10);
            }
        ]);

        return Inertia::render('Admin/MentalDisorders/Show', [
            'disorder' => $mentalDisorder,
        ]);
    }

    /**
     * Show the form for editing the mental disorder
     */
    public function edit(MentalDisorder $mentalDisorder)
    {
        return Inertia::render('Admin/MentalDisorders/Edit', [
            'disorder' => $mentalDisorder,
        ]);
    }

    /**
     * Update the specified mental disorder
     */
    public function update(Request $request, MentalDisorder $mentalDisorder)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:mental_disorders,code,' . $mentalDisorder->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recommendation' => 'nullable|string',
        ]);

        $mentalDisorder->update($request->all());

        return redirect()
            ->route('admin.mental-disorders.index')
            ->with('success', 'Gangguan mental berhasil diperbarui.');
    }

    /**
     * Remove the specified mental disorder
     */
    public function destroy(MentalDisorder $mentalDisorder)
    {
        // Check if has related diagnosis rules or user diagnoses
        if ($mentalDisorder->diagnosisRules()->exists() || $mentalDisorder->userDiagnoses()->exists()) {
            return redirect()
                ->route('admin.mental-disorders.index')
                ->with('error', 'Tidak dapat menghapus gangguan mental yang memiliki aturan diagnosis atau riwayat diagnosis pengguna.');
        }

        $mentalDisorder->delete();

        return redirect()
            ->route('admin.mental-disorders.index')
            ->with('success', 'Gangguan mental berhasil dihapus.');
    }

    /**
     * Get all mental disorders for API
     */
    public function api()
    {
        return response()->json([
            'data' => MentalDisorder::orderBy('code')->get()
        ]);
    }
}
