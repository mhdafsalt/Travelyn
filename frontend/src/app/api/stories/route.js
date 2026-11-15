import { NextResponse } from 'next/server';

let serverStorySettings = {
  sectionTag: "Swiss Alps",
  titlePrimary: "Feel the mountains",
  titleMuted: "before you go",
  stories: [
    {
      id: "story-1",
      tag: "Swiss Alps",
      title: "Mornings above the clouds",
      description: "Coffee on a wooden balcony, the valley still asleep below and snowy peaks catching the first light.",
      imageUrl: "https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg",
      buttonText: "Discover Swiss Alps",
      link: "/destinations/swiss-alps",
      reversed: false
    },
    {
      id: "story-2",
      tag: "Swiss Alps",
      title: "Evenings by the fire",
      description: "Wool blankets, crackling logs and fondue shared slowly while the snow falls outside the window.",
      imageUrl: "https://framerusercontent.com/images/Y5iOG5ie06PAZjqXQFJGD5em94.jpg",
      buttonText: "Discover Swiss Alps",
      link: "/destinations/swiss-alps",
      reversed: true
    }
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverStorySettings
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    serverStorySettings = {
      ...serverStorySettings,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'Stories section settings updated successfully',
      data: serverStorySettings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update story settings', error: error.message },
      { status: 500 }
    );
  }
}
