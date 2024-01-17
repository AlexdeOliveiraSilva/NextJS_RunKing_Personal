'use client'



export default function Loading() {
    return (
        <div className="flex justify-center items-center" style={{ position: "absolute" }}>
            <img className="loading-animation" src="/icons/loading.svg"></img>
        </div>
    )
}
