import HeaderCoord from "./1Componentes/HeaderCoordenacao";
import SidebarMenu from "./1Componentes/SidebarMenu";
import { useState } from "react";

function Mensagem() {
    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setMensagem(e.target.value);
    }

    const handleEnviar = () => {
        alert("Mensagem enviada: " + mensagem);
        setMensagem("");
    }

    return (
        <>
            <HeaderCoord />

            <div className="main-container">
                <div className='sidebar'>
                    <SidebarMenu />
                </div>

                <main className='content'>
                    <h2>Mensagem</h2>

                    <div>
                        <textarea
                            value={mensagem}
                            onChange={handleChange}
                            placeholder='Digite sua mensagem aqui'
                            style={{ width: "100%", height: "100px", padding: "10px", resize: "none" }}
                        />

                        <button className='botao' onClick={handleEnviar}>
                            Enviar
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Mensagem;
