import Image from "next/image";
import { Users } from "@/components/users";
import { PgRepl } from "@/components/pgRep";
export default function Home() {

  return (
    <div>
      <main className="flex flex-col items-center sm:items-start h-screen">
        {/* <Users /> */}
        <PgRepl />
      </main>
    </div>
  );
}
