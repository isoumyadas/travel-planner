"use client";

import { Location, Trip } from "@/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "@/components/Map";
import SortableItinerary from "./SortableItinerary";

type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  // using this for tabs
  const [activeTab, setActiveTab] = useState("overview");
  console.log(activeTab);
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-76 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            {trip.title}
          </h1>

          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {trip.startDate.toLocaleDateString()} -
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button>
              Add Location <Plus className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {/* Given value here, so when selecting it one should know on which tab it's on */}
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 ">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} -
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round(
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`}
                      </p>
                    </div>
                  </div>
                  {/* destinations & locations */}
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p>Destinations</p>
                      <p>
                        {trip.locations.length}
                        {trip.locations.length === 1
                          ? " Location"
                          : " Locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Map */}
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
              {trip.locations.length === 0 && (
                <div className="text-center p-4 flex flex-col gap-3">
                  <p>Add Locations! to see them on map</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      Add Location <Plus className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed">
                  {trip.description}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold mb-3"> Full Itinerary </h2>
              {trip.locations.length === 0 ? (
                <div className="text-center p-4 flex flex-col gap-3">
                  <p>Add Locations! to see them on itinerary</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      Add Location <Plus className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary
                  locations={trip.locations}
                  tripId={trip.id}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6 ">
            <div className="">
              {/* Map */}
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
              {trip.locations.length === 0 && (
                <div className="text-center p-4 flex flex-col gap-3">
                  <p>Add Locations! to see them on map</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      Add Location <Plus className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
              {/* Description */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* buttons */}

      <div className="text-center">
        <Link href={`/trips`}>
          <Button>Back to Trips</Button>
        </Link>
      </div>
    </div>
  );
}
