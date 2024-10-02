import { Users } from "@/components/users";
export default function Home() {

  return (
    <div>
      <main className="flex flex-col items-center sm:items-start h-screen">
        <Users />
      </main>
    </div>
  );
}
