import { ReactNode, createContext, useState } from 'react';

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    secondsAmountPassed: number;
    createNewCycle: (data: NewCycleData) => void;
    stopCycle: () => void;
    setSecondsPassed: (seconds: number) => void;
    setCycleAsDone: () => void;
}

interface NewCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextProviderProps {
    children: ReactNode
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    stopDate?: Date;
    finishedDate?: Date;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setSecondsAmountPassed(seconds)
    }

    function createNewCycle(data: NewCycleData) {
        const id = String(cycles.length + 1)
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)
        setSecondsAmountPassed(0)
    }

    function stopCycle() {
        setCycles(state =>
            state.map(cycle => {
                if(cycle.id === activeCycleId) {
                    return { ...cycle, stopDate: new Date () }
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
    }

    function setCycleAsDone() {
        setCycles(state =>
            state.map(cycle => {
                if(cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date () }
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
        document.title = 'Ingite Timer - Finished'
        alert('Task finished!')
    }

    return (
       <CyclesContext.Provider value={{ 
            cycles, 
            activeCycle,
            activeCycleId,
            secondsAmountPassed,
            createNewCycle,
            stopCycle,
            setSecondsPassed,
            setCycleAsDone
        }}>
            {children}
       </CyclesContext.Provider> 
    )
}