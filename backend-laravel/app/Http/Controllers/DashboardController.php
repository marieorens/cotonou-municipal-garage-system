<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Payment;
use App\Models\Procedure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Provide statistics for the dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $stats = [
            'total_vehicles' => Vehicle::count(),
            'vehicles_impounded_count' => Vehicle::where('status', 'impounded')->count(),
            'total_revenue' => Payment::sum('amount'),
            'active_procedures_count' => Procedure::whereIn('status', ['pending', 'in_progress'])->count(),
            'recently_added_vehicles' => Vehicle::latest()->take(5)->get(),
            'procedures_nearing_deadline' => Procedure::where('deadline', '>', now())
                                                      ->where('deadline', '<=', now()->addDays(7))
                                                      ->with('vehicle:id,license_plate')
                                                      ->take(5)
                                                      ->get(),
        ];

        return response()->json(['data' => $stats]);
    }
}
