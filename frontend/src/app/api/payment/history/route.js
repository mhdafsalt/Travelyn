import { NextResponse } from 'next/server';

let serverTransactions = [
  {
    paymentId: 'pay-rzp_test_1731600100',
    razorpayPaymentId: 'pay_test_santo123456',
    razorpayOrderId: 'order_test_santo987',
    bookingId: 'bk-1731600100',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@luxury.travel',
    packageTitle: 'Santorini Caldera Retreat',
    amount: 570000,
    currency: 'INR',
    paymentType: 'full',
    paymentMethod: 'UPI / Google Pay',
    paymentStatus: 'Captured',
    transactionDate: '2026-11-12T14:32:00.000Z',
    isTest: true
  },
  {
    paymentId: 'pay-rzp_test_1731600200',
    razorpayPaymentId: 'pay_test_kyoto654321',
    razorpayOrderId: 'order_test_kyoto321',
    bookingId: 'bk-1731600200',
    customerName: 'Julian Sterling',
    customerEmail: 'sterling@vanguard.co',
    packageTitle: 'Kyoto Ancient Gardens & Ryokan',
    amount: 75000,
    currency: 'INR',
    paymentType: 'advance',
    paymentMethod: 'Razorpay Netbanking',
    paymentStatus: 'Pending',
    transactionDate: '2026-11-13T09:15:00.000Z',
    isTest: true
  },
  {
    paymentId: 'pay-rzp_test_1731600300',
    razorpayPaymentId: 'pay_test_maldiv888999',
    razorpayOrderId: 'order_test_maldiv456',
    bookingId: 'bk-1731600300',
    customerName: 'Clara Delacroix',
    customerEmail: 'clara.delacroix@artemis.fr',
    packageTitle: 'Maldives Overwater Haven',
    amount: 990000,
    currency: 'INR',
    paymentType: 'full',
    paymentMethod: 'Visa Credit Card',
    paymentStatus: 'Captured',
    transactionDate: '2026-11-14T11:45:00.000Z',
    isTest: true
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const email = searchParams.get('email');

  let list = [...serverTransactions];

  if (status && status !== 'all') {
    list = list.filter((p) => (p.paymentStatus || '').toLowerCase() === status.toLowerCase());
  }

  if (email) {
    list = list.filter((p) => (p.customerEmail || '').toLowerCase() === email.toLowerCase());
  }

  const totalRevenue = list
    .filter((p) => p.paymentStatus === 'Captured')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return NextResponse.json({
    success: true,
    total: list.length,
    totalRevenueINR: totalRevenue,
    payments: list
  });
}
