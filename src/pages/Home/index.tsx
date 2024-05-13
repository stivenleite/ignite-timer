import { HandPalm, Play } from 'phosphor-react'
import { CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, StartButton, StopButton, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface NewCycleFormData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    stopDate?: Date;
    finishedDate?: Date;
}

export function Home() {
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({ defaultValues: { task: '',  minutesAmount: 0 } })
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)
 
    const isSubmitDisabled = !watch('task')

    function handleCreateNewCycle(data: NewCycleFormData) {
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

        reset()
    }

    function handleStopCycle() {
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

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - secondsAmountPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        let interval: number

        if(activeCycle){
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

                if (secondsDifference >= totalSeconds){
                    setCycles(state =>
                        state.map(cycle => {
                            if(cycle.id === activeCycleId) {
                                return { ...cycle, finishedDate: new Date () }
                            } else {
                                return cycle
                            }
                        })
                    )

                    clearInterval(interval)
                    setSecondsAmountPassed(totalSeconds)
                } else {
                    setSecondsAmountPassed(secondsDifference)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId])

    useEffect(() => {
        if(activeCycle){
            document.title = `Ignite Timer - ${minutes}:${seconds}`
        } else {
            document.title = 'Ingite Timer'
        }
    }, [minutes, seconds, activeCycle])

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor='task'>I will be working on</label>
                    <TaskInput id='task' list='task-suggestions' placeholder='Type your project name' disabled={!!activeCycle} {...register('task')}/>
                    <datalist id='task-suggestions'>
                        <option value="Task 1"/>
                        <option value="Task 2"/>
                        <option value="Task 3"/>
                    </datalist>

                    <label htmlFor='minutesAmount'>for</label>
                    <MinutesInput type='number' step={5} min={1} max={60} id='minutesAmount' placeholder='00' disabled={!!activeCycle} {...register('minutesAmount', { valueAsNumber: true })}/>

                    <span>minutes.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {
                    activeCycle ? (
                        <StopButton type='button' onClick={handleStopCycle}>
                            <HandPalm size={24} />
                            Stop
                        </StopButton>
                    ) : (
                        <StartButton type='submit' disabled={isSubmitDisabled}>
                            <Play size={24}/>
                            Start
                        </StartButton>
                    )
                }

            </form>
        </HomeContainer>
    )
}