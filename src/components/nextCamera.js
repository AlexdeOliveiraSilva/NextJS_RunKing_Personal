import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import Loading from './loading';

const CameraComponent = ({ onCapture, authError }) => {
    const webcamRef = useRef(null);
    const [compressedImage, setCompressedImage] = useState("");
    const [isCompressLoading, setIsCompressLoading] = useState(false);

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const newCompressedImage = await compressImage(imageSrc);
        onCapture(newCompressedImage);
    }, [webcamRef, onCapture]);

    const compressImage = (base64String) => {
        return new Promise((resolve) => {
            var canvas = document.createElement('canvas');
            var maxWidth = 600;
            var maxHeight = 600;

            var image = new Image();
            image.src = base64String;

            image.onload = function () {
                var width = image.width;
                var height = image.height;

                if (width > maxWidth || height > maxHeight) {
                    var ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(image, 0, 0, width, height);

                var compressedBase64 = canvas.toDataURL('image/jpeg');

                setCompressedImage(compressedBase64);
                resolve(compressedBase64);
            };
        });
    };

    const onSubmitt = () => {
        setIsCompressLoading(true)
        capture();
        setIsCompressLoading(false)
    }

    return (
        <div className='cameraDiv'>
            <h5>Tire uma foto pegando todo o seu rosto...</h5>
            <Webcam
                className='webcamSize'
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            {authError && <p style={{ fontSize: "13px", color: "var(--red-primary)" }}>* Erro ao Autênticar a foto, tire outra e tente novamente.</p>}
            <button className="btnGreen btnCapture" onClick={() => onSubmitt()}>{isCompressLoading == true ? <Loading></Loading> : "Capturar Imagem"}</button>
        </div>
    );
};

export default CameraComponent;