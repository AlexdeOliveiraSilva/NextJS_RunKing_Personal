"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/global";

export default function Header() {
  const { config } = useContext(GlobalContext);

  const path = usePathname();
  const router = useRouter();

  return (
    <div
      className="greyBackground"
      style={{ flexDirection: "column", padding: "10px 0", height: "auto" }}
    >
      <img width={150} src="/images/logo-runking.png"></img>
      <div className="headerContent">
        <span className="headerTitle">credenciamento e dados médicos do atleta</span>
      </div>
    </div>
  );
}
