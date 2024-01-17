'use client'


export default function TakePicture({ status, img }) {

    if (status === true) {
        return (
            <div className="picture">
                <img src={img}></img>
            </div>
        )
    }
}
