import { NextResponse } from 'next/server';
import { INITIAL_DESTINATIONS } from '@/lib/data';

let serverDestinations = [...INITIAL_DESTINATIONS];

export async function GET(_request, { params }) {
  const { id } = await params;
  const match = serverDestinations.find(
    (d) => d.id === id || d.slug.toLowerCase() === id.toLowerCase()
  );

  if (!match) {
    return NextResponse.json(
      { success: false, message: `Destination "${id}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: match });
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = serverDestinations.findIndex((d) => d.id === id || d.slug === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: `Destination "${id}" not found to update` },
        { status: 404 }
      );
    }

    serverDestinations[index] = {
      ...serverDestinations[index],
      ...body,
      price: body.price ? Number(body.price) : serverDestinations[index].price,
      durationDays: body.durationDays ? Number(body.durationDays) : serverDestinations[index].durationDays,
    };

    return NextResponse.json({
      success: true,
      message: 'Destination updated successfully',
      data: serverDestinations[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update destination', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const initialLen = serverDestinations.length;
  serverDestinations = serverDestinations.filter((d) => d.id !== id && d.slug !== id);

  if (serverDestinations.length === initialLen) {
    return NextResponse.json(
      { success: false, message: `Destination "${id}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Destination deleted successfully',
  });
}
