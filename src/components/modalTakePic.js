'use client'
import React, { useState } from 'react';
import CameraComponent from '@/components/nextCamera';
import Loading from "@/components/loading";


export default function ModalTakePic({ close, uuid, setError }) {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isYesLoading, setIsYesLoading] = useState(false)
    const [isNoLoading, setIsNoLoading] = useState(false)
    const [authError, setAuthError] = useState(false)

    const USER_UUID = uuid;
    const URL_API = "https://api.runking.com.br/";

    const handleCapture = (imageSrc) => {
        setCapturedImage(imageSrc);
    };


    // ****************** FALTA TERMINAR DE AJUSTAR
    const saveImage = async () => {
        setIsYesLoading(true);

        try {
            const response = await fetch(`${URL_API}checkinCallChamber/${USER_UUID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photo1Rekognition: capturedImage,
                }),
            });

            if (response.ok) {
                setAuthError(false);
                setTimeout(() => {
                    localStorage.setItem('user_image', capturedImage);
                    setIsYesLoading(false);
                    close();
                }, 1000);
            } else {
                console.log('1');
                setIsYesLoading(false);
                setCapturedImage(null);
                setAuthError(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setIsYesLoading(false);
            setCapturedImage(null);
            setAuthError(true);
        }
    };

    return (
        <div className="containerModals">
            {capturedImage ? (
                <div className='confirmDivContent'>
                    <img src={capturedImage} alt="img-captured" />
                    <div className="confirmDivBtn">
                        <button
                            onClick={() => saveImage()}
                            className="btnGreen btnCapture">{isYesLoading == true ? <Loading></Loading> : "Ficou boa"}</button>
                        <button
                            onClick={() => setCapturedImage(null)}
                            className="btnRed btnCapture">{isNoLoading == true ? <Loading></Loading> : "Tirar outra"}</button>
                    </div>
                </div>
            ) : (
                <CameraComponent onCapture={handleCapture} authError={authError} />
            )}
        </div>
    )
}
