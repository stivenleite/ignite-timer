import { Play } from 'phosphor-react'
import { CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, StartButton, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import { useState } from 'react';

interface NewCycleFormData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
}

export function Home() {
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({ defaultValues: { task: '',  minutesAmount: 0 } })
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<{} | null>(null)
    const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)
 
    const isSubmitDisabled = !watch('task')

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(cycles.length + 1)
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)

        reset()
    }

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - secondsAmountPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor='task'>I will be working on</label>
                    <TaskInput id='task' list='task-suggestions' placeholder='Type your project name' {...register('task')}/>
                    <datalist id='task-suggestions'>
                        <option value="Task 1"/>
                        <option value="Task 2"/>
                        <option value="Task 3"/>
                    </datalist>

                    <label htmlFor='minutesAmount'>for</label>
                    <MinutesInput type='number' step={5} min={5} max={60} id='minutesAmount' placeholder='00' {...register('minutesAmount', { valueAsNumber: true })}/>

                    <span>minutes.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                <StartButton type='submit' disabled={isSubmitDisabled}>
                    <Play size={24}/>
                    Start
                </StartButton>
            </form>
        </HomeContainer>
    )
}