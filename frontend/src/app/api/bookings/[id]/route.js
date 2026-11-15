import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, confirmed, or cancelled.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${id} status updated to ${status}`,
      data: { id, status },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update booking status', error: error.message },
      { status: 500 }
    );
  }
}

