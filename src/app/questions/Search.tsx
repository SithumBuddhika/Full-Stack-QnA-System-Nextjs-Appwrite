// "use client";

// import { Input } from "@/components/ui/input";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React from "react";

// const Search = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [search, setSearch] = React.useState(searchParams.get("search") || "");

//   React.useEffect(() => {
//     setSearch(() => searchParams.get("search") || "");
//   }, [searchParams]);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const newSearchParams = new URLSearchParams(searchParams);
//     newSearchParams.set("search", search);
//     router.push(`${pathname}?${newSearchParams}`);
//   };

//   return (
//     <form className="flex w-full flex-row gap-4" onSubmit={handleSearch}>
//       <Input
//         type="text"
//         placeholder="Search questions"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
//         Search
//       </button>
//     </form>
//   );
// };

// export default Search;

// "use client";

// import { Input } from "@/components/ui/input";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React from "react";

// const Search = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [search, setSearch] = React.useState(searchParams.get("search") || "");

//   React.useEffect(() => {
//     setSearch(searchParams.get("search") || "");
//   }, [searchParams]);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const newSearchParams = new URLSearchParams(searchParams);
//     const trimmedSearch = search.trim();

//     if (trimmedSearch) {
//       newSearchParams.set("search", trimmedSearch);
//     } else {
//       newSearchParams.delete("search");
//     }

//     const queryString = newSearchParams.toString();
//     router.push(queryString ? `${pathname}?${queryString}` : pathname);
//   };

//   return (
//     <form
//       className="flex w-full flex-col gap-4 sm:flex-row"
//       onSubmit={handleSearch}
//     >
//       <Input
//         type="text"
//         placeholder="Search questions"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="min-w-0 flex-1"
//       />

//       <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
//         Search
//       </button>
//     </form>
//   );
// };

// export default Search;

"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = React.useState(searchParams.get("search") || "");

  React.useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams);
    const trimmed = search.trim();

    if (trimmed) {
      newSearchParams.set("search", trimmed);
    } else {
      newSearchParams.delete("search");
    }

    const qs = newSearchParams.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <form
      className="flex w-full flex-col gap-4 sm:flex-row"
      onSubmit={handleSearch}
    >
      <Input
        type="text"
        placeholder="Search questions"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="min-w-0 flex-1"
      />

      <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
        Search
      </button>
    </form>
  );
};

export default Search;
