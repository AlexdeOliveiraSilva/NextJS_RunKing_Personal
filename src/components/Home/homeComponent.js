'use client'

import Header from "@/components/header";
import Footer from "@/components/footer";
import ProfileContent from "@/components/profileContent";
import Separator from "@/components/separator";
import TakePicture from "@/components/takePicture";
import ModalTakePic from "@/components/modalTakePic";
import Loading from "@/components/loading";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function HomeComponent({ path }) {
    const router = useRouter();
    const [image, setImage] = useState("")
    const [capturedImage, setCapturedImage] = useState(null);
    const [modalCapture, setModalCapture] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handleCapture = (imageSrc) => {
        setModalCapture(true)
        setCapturedImage(imageSrc);
    };


    const signOut = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.clear("user_image")
            setImage("")
            setIsLoading(false);
        }, 1000)
    };

    const closeAndSave = () => {
        setTimeout(() => {
            setImage(localStorage.getItem("user_image"))
            setModalCapture(false)
            setIsLoading(false);
        }, 1000)
    };

    useEffect(() => {
        setImage(localStorage.getItem("user_image"))
    }, [])

    console.log("aa", path)
    return (
        <main className="fullContainer">
            {modalCapture == true && <ModalTakePic close={() => closeAndSave()}></ModalTakePic>}
            <Header title="Login"></Header>
            <div className="homeContent">
                <div className="userContent">
                    <ProfileContent status={!!image ? true : false} name={!!image ? "Rafael Oliveira" : "-"} number={!!image ? "10015441" : "-"}></ProfileContent>
                    <TakePicture status={!!image ? true : false} img={image}></TakePicture>
                </div>
                {!image ?
                    <button

                        onClick={() => handleCapture()}
                        className="btnGreen profileBtn">{isLoading == true ? <Loading></Loading> : "Tirar Foto"}</button>
                    :
                    <button

                        onClick={() => signOut()}
                        className="btnRed profileBtn">{isLoading == true ? <Loading></Loading> : "Deslogar"}</button>
                }
            </div>
            <Footer></Footer>
        </main >
    )
}
