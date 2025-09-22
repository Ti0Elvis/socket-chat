"use client";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    toast.success("Welcome");

    return () => {
      toast.success("Goodbye");
    };
  }, []);

  return <></>;
}
