'use client'
import Separator from "@/components/separator";


export default function ProfileContent({ status, name, number, auth }) {

    return (

        <div className="profileContent">
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <div className={status === 1 ? "iconGreenOut" : "iconRedOut"}>
                    <div className={status === 1 ? "iconGreenin" : "iconRedin"}></div>
                </div>
                <p style={{ margin: "0 30px 0 10px" }}>{status === 1 ? "Online" : "Offline"}</p>
                <div className={auth === 1 ? "iconGreenOut" : "iconRedOut"}>
                    <div className={auth === 1 ? "iconGreenin" : "iconRedin"}></div>
                </div>
                <p style={{ marginLeft: "10px" }}>{auth === 1 ? "Autênticado" : "Não Autênticado"}</p>
            </div>
            <Separator color={status === 1 ? "var(--green-dark)" : "var(--red-primary)"} width={"90%"} height={"1px"}></Separator>
            {status === 1 ?
                <>
                    <div className="profileItem"><h1>Nome: <span>{!!name ? name : "-"}</span></h1></div>
                    <div style={{ marginBottom: "20px" }} className="profileItem"><h1>Número de Peito: <span>{!!number ? number : "-"}</span></h1></div>
                </>
                :
                <p style={{ marginTop: "30px" }}>{status == 2 ? "Usuário Não Autênticado" : status == 3 ? "Falha na Conexão" : ""}</p>
            }
        </div>

    )
}
