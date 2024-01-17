'use client'
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global"


export default function Header() {
    const { config } = useContext(GlobalContext)

    const path = usePathname();
    const router = useRouter();


    return (
        <div className="greyBackground" style={{ flexDirection: "column", padding: "10px 0", height: "17vh" }}>
            <img src="/images/logo-runking.png"></img>
            <div className="headerContent">
                <div className="headerContent">


                </div>
            </div>
        </div>
    )
}
