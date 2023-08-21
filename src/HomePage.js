import { useEffect, useState } from "react"

export const Page = () => {
    
   let [data,setdata] = useState(null)
   let [userop,setUserop] = useState(false)
    async function getdata(){
        let json = await fetch("https://jsonplaceholder.typicode.com/todos/1")
        let abc = await json.json() 
        setdata(abc)
    }
    if(userop){
        getdata()
        setUserop(false)
    }
    return (
        <div>
            <button onClick={()=> setUserop(true)}>Fetch!</button>
            {data ? <><div className="elemname">Employee Name: {data.title}</div>
            <div className="elemsal">Employee Status: {data.completed ? "Online": "Offline"}</div></>
            :
            <div>Loading...Hehe</div>}
        </div>
    )
}