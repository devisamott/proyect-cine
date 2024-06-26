import { useContext, useState, useEffect } from "react"
import { DataContext } from "../provider"
import { getChairFromJson } from "../getDataFromApi";
import { ChairSvg } from "../chairSvg";
import  "./ChairRender.css" 

export function ChairRender () {
    const [ chairs, setChairs] = useState([]);

    const { handleClick, day, hour, chairsReservations, colorByStatus } = useContext(DataContext)

    const chairCounter = chairs.filter(({ id }) => !chairsReservations?.[day]?.[hour]?.[id]).length;

    useEffect (()  => {
        dataChair()
    },[day, hour])
    
    const dataChair = async () => {
        const result = await getChairFromJson()
        setChairs(result);
    };

 
    return (
        <div className='container'>
        <h2 className='counterChair'>{chairCounter} sillas disponibles</h2>
        <div className='chair'>
            {chairs.map(({id}) => (
                <div 
                    key={id}
                    onClick={()=> handleClick(id, day, hour)}
                > 
                    <ChairSvg color={colorByStatus(day, hour, id)}/>
                </div>
            ))}
        </div>
    </div>
    )
}