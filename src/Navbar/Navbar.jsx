import { useContext } from "react";
import { IsopenContext } from "../context/isopenContext";
import "./navbar.css"

export default function Navbar() {
    const { dispatch } = useContext(IsopenContext);
  return (
    <div className="background">
      
    <div className="navbar">
      <div className="btn" onClick={()=>dispatch({type:"TOGGLE"})}>
          አስተያየቶን ያስገቡ
      </div>
    </div>
    </div>
  )
}
