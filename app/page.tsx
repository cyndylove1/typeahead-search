import Image from "next/image";
import CountrySearch from "./components/countrySearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <CountrySearch />
    </main>
  );
}
