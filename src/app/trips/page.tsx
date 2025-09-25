import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();
  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  // This gives the array of which trip has startDate more recent.
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  //upcoming Trips
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  // If session is not true or user is not authenticated then show this component instead of TripsPage.
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* {wrapped with the Link cause the this page is server component and using onClick on button won't work and it's better to use Link that will redirect us to another page where we can add the new trip} */}
        <Link href={"/trips/new"}>
          <Button>New Trip</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.user?.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p>
            {trips.length === 0
              ? "Start planning your first trip by clicking the button above."
              : `You have ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. ${
                  upcomingTrips.length > 0
                    ? `${upcomingTrips.length} upcoming.`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Recent Trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">Not Trips Yet.</h3>
              <p className="text-center mb-4 max-4-md">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href={"/trips/new"}>
                <Button>Create Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link href={`/trips/${trip.id}`} key={key}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                    <div className="text-sm">
                      {/* Dates (startDate and endDate) */}
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
