// when user clicked on particular trip card then this will show as the UI

import { auth } from "@/auth";
import TripDetailClient from "@/components/TripDetail";
import { prisma } from "@/lib/prisma";

// Here next js automatically pass the params here
export default async function TripDetail({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await auth();

  if (!session) {
    return <div>Please Sign In!</div>;
  }

  // here tripId and Id in DB should match. Also under which user.
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return <div> Trip not Found!</div>;
  }

  return <TripDetailClient trip={trip} />;
}
