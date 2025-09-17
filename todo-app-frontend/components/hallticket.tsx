"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function HallticketPage() {
  const { hallticket } = useParams();
  const [results, setResults] = useState<{ sem1?: any; sem2?: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/registration/${hallticket}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setResults(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [hallticket]);

  if (loading) return <p>Loading...</p>;

  if (!results.sem1 && !results.sem2) return <p>No results found</p>;

  return (
    <div>
      <h1>Results for {hallticket}</h1>
      {results.sem1 && (
        <div>
          <h2>Semester 1</h2>
          <p>M1: {results.sem1.m1}</p>
          <p>English: {results.sem1.eng}</p>
          <p>Chemistry: {results.sem1.che}</p>
          <p>BEE: {results.sem1.bee}</p>
        </div>
      )}
      {results.sem2 && (
        <div>
          <h2>Semester 2</h2>
          <p>M2: {results.sem2.m2}</p>
          <p>Physics: {results.sem2.phy}</p>
          <p>EG: {results.sem2.eg}</p>
          <p>CPP: {results.sem2.cpp}</p>
        </div>
      )}
    </div>
  );
}
