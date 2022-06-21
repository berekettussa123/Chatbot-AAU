import { createContext, useReducer } from "react";
import IsopenReducer from "./isopenReducer";

const INITIAL_STATE = {
    isOpen: false,
  };

  export const IsopenContext = createContext(INITIAL_STATE);

  export const IsopenContextProvider = ({children}) =>{
      const [state,dispatch] = useReducer(IsopenReducer,INITIAL_STATE)
      return(
          <IsopenContext.Provider value={{isOpen:state.isOpen, dispatch}}>
            {children}
          </IsopenContext.Provider>
      )
  }