"use client";
import AuthButton from "../components/Authbutton";
import { useEffect, useState } from "react";

export default function test() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((result) => setData(result.data));
  }, []);

  return (
    <div>
      <AuthButton />
      {/* Other content */}
    </div>
  );
}
