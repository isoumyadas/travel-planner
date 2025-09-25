import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        Login To Travel A Plan
      </div>
    );
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {`Welcome To Travel Planner`}
    </div>
  );
}
