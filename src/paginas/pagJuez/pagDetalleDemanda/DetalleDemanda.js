import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../../UserContext";

import BannerJuez from "../../../components/BannerJuez";
import BoxDetalleDemanda from "./infoGeneral/BoxInfGen";
import InfoDetalleDemanda from "./InfoDetalleDemanda";
import BoxInfDemandate from "./infoPersona/BoxInfDemandante";
import BoxInfDemandado from "./infoPersona/BoxInfDemandado";

export default function DetalleDemanda(props) {
    const { user } = useContext(UserContext);
    const func = props.func;
    const { id } = useParams();
    const req = {"id": id};

    const [info, setInfo] = useState({
        Juez: {
            id: -1
        }
    });
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3001/get-demand", {
                method: 'POST', 
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(req)
            });
            if (!response.ok) {
                throw new Error('La solicitud no se completó con éxito.');
            }
            const data = await response.json();
            if(data !== null){
                setInfo(data);
                setIsLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function errorDetalleDemanda(){
        if(info.Juez.id === -1){
            return(
                <p>
                    No existe una demanda asociada al id de número de demanda: {id}
                </p> 
            )
        } else if (info.Juez.id !== user.id){
            return(
                <p>
                    La demanda con el número de demanda {id} no está asociada al usuario actualmente en sesión.
                </p> 
            )
        }

    }

    return (
        <>
            <BannerJuez func={func} />
            <div className="Contenido">
                <h1>
                    Demanda <InfoDetalleDemanda solicitud={id} />
                </h1>

                { info.Juez.id === user.id ? 
                    <>
                        <p>
                            En esta pestaña encontrará toda la información referida a la
                            demanda <InfoDetalleDemanda solicitud={id} />.
                        </p>
                        {isLoaded && (
                            <>
                                <BoxDetalleDemanda infoDemanda={info}/>
                                <div className="InfDemandante">
                                    <BoxInfDemandate infoPersona={info.PersonaNatural}/>
                                </div>
                                <div className="InfDemandado">
                                    <BoxInfDemandado infoPersona={info.Demandado}/>
                                </div>
                            </>
                        )}
                    </>
                    :
                    errorDetalleDemanda()
                }
            </div>
        </>
    );
}
