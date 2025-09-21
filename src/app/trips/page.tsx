import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();

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
      <div>
        <h1>Dashboard</h1>

        {/* {wrapped with the Link cause the this page is server component and using onClick on button won't work and it's better to use Link that will redirect us to another page where we can add the new trip} */}
        <Link href={"/trips/new"}>
          <Button>New Trip</Button>
        </Link>
      </div>
    </div>
  );
}
