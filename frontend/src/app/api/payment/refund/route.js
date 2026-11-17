import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, amount, reason } = body;

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully in Razorpay Test Mode.',
      refund: {
        id: `rfnd_test_${Date.now()}`,
        paymentId,
        amount,
        status: 'processed',
        reason: reason || 'Customer requested journey cancellation'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process refund.' },
      { status: 500 }
    );
  }
}
