"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

async function geoCodeAddress(address: string) {
  // need google map's API -> Google cloud

  const apikey = process.env.GOOGLE_MAPS_API_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apikey}`
  );

  const data = await response.json();
  console.log("data::", data);
  const { lat, lng } = data.results[0].geometry.location;

  return { lat, lng };
}

export default async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();

  if (!address) {
    throw new Error("missing address");
  }

  const { lat, lng } = await geoCodeAddress(address);

  // to get the last location order count, so when user create another one it should be in the order.
  const count = await prisma.location.count({
    where: { tripId },
  });

  // here we don't need to add +1 in order, cauz we have added the default as 0 at primsa model.
  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
