'use client'



export default function Loading() {
    return (
        <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-60 z-50"  style={{ position: "absolute", top: "0px" }} >
            <img className="loading-animation" width={40} src="/icons/loading.svg"></img>
        </div>
    )
}
