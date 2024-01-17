import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const CameraComponent = ({ onCapture, authError }) => {
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc);
    }, [webcamRef, onCapture]);

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
            <button className="btnGreen btnCapture" onClick={capture}>Capturar Imagem</button>
        </div>
    );
};

export default CameraComponent;