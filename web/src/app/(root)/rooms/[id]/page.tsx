"use client";
import { Fragment } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();

  return <Fragment>{params.id}</Fragment>;
}
