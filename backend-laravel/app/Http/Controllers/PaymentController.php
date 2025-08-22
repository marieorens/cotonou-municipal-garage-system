<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * @OA\Get(
     *      path="/payments",
     *      operationId="getPaymentsList",
     *      tags={"Payments"},
     *      summary="Get list of payments",
     *      description="Returns list of payments",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="search", in="query", description="Search by reference or license plate", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="status", in="query", description="Filter by status", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="payment_method", in="query", description="Filter by payment method", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter(name="date_from", in="query", description="Filter by start date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Parameter(name="date_to", in="query", description="Filter by end date", required=false, @OA\Schema(type="string", format="date")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/PaymentResource"))
     *       ),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function index(Request $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Post(
     *      path="/payments",
     *      operationId="storePayment",
     *      tags={"Payments"},
     *      summary="Store new payment",
     *      description="Returns payment data",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/StorePaymentRequest")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/PaymentResource")
     *       ),
     *      @OA\Response(response=400, description="Bad Request"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function store(StorePaymentRequest $request)
    {
// ... existing code ...
    }

    /**
     * @OA\Get(
     *      path="/payments/{id}",
     *      operationId="getPaymentById",
     *      tags={"Payments"},
     *      summary="Get payment information",
     *      description="Returns payment data",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", description="ID of payment", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/PaymentResource")
     *       ),
     *      @OA\Response(response=404, description="Not Found"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     * )
     */
    public function show(Payment $payment)
    {
// ... existing code ...
    }
}
