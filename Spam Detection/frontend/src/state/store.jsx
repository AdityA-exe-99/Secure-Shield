import { createContext, useContext, useState } from 'react'
const StoreContext = createContext(null)
export function StoreProvider({ children }){
  const [lastResult, setLastResult] = useState(null)
  const [history, setHistory] = useState([])
  const addResult = (r) => { setLastResult(r); setHistory(h=>[r,...h].slice(0,100)) }
  return <StoreContext.Provider value={{ lastResult, history, addResult }}>{children}</StoreContext.Provider>
}
export const useStore = () => useContext(StoreContext)