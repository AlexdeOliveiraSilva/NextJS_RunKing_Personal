'use client'

import Header from "@/components/header";
import Footer from "@/components/footer";
import ProfileContent from "@/components/profileContent";
import Separator from "@/components/separator";
import TakePicture from "@/components/takePicture";
import ModalTakePic from "@/components/modalTakePic";
import Loading from "@/components/loading";

import { useState, useEffect } from "react"
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation";


export default function Login() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState("")
  const [capturedImage, setCapturedImage] = useState(null);
  const [modalCapture, setModalCapture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [connectionError, setConnectionError] = useState(false);
  const [userError, setUserError] = useState(false);

  const USER_UUID = searchParams.get("uuid");
  const URL_API = "https://api.runking.com.br/"

  const getUserData = async () => {
    setConnectionError(false);
    setUserError(false);

    try {
      const response = await fetch(`${URL_API}checkinCallChamber/${USER_UUID}`);

      if (response.ok) {
        const data = await response.json();

        setUserData(data);
        localStorage.setItem("user_name", data?.name);
        localStorage.setItem("user_number", data?.number);
        localStorage.setItem("event_name", data?.number);
      } else if (response.status >= 500) {
        setConnectionError(true);
      } else {
        setUserError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setUserError(true);
    }
  };

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
    getUserData();
  }, [])


  return (
    <main className="fullContainer">
      {modalCapture == true && <ModalTakePic close={() => closeAndSave()} uuid={USER_UUID}></ModalTakePic>}
      <Header title="Login"></Header>
      <div className="homeContent">
        <div className="userContent">
          <ProfileContent
            status={!!connectionError ? 3 : !!userError ? 2 : 1}
            name={!!userData?.name ? userData?.name : "-"}
            number={!!userData?.number ? userData?.number : "-"}
            auth={!!image ? 1 : 0}
          ></ProfileContent>
          <TakePicture
            status={!!image ? true : false}
            img={image}></TakePicture>
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
