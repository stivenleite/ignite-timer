import { HandPalm, Play } from 'phosphor-react'
import { HomeContainer, StartButton, StopButton } from './styles'
import { FormProvider, useForm } from 'react-hook-form'
import { useContext } from 'react';
import { CyclesContext } from '../../contexts/CyclesContext';
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';

interface NewCycleFormData {
    task: string;
    minutesAmount: number;
}

export function Home() {
    const { activeCycle, createNewCycle, stopCycle } = useContext(CyclesContext) 
    
    const newCycleForm = useForm<NewCycleFormData>({ defaultValues: { task: '',  minutesAmount: 0 } })
    const { handleSubmit, watch, reset } = newCycleForm

    const isSubmitDisabled = !watch('task')

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    function handleStopCycle() {
        stopCycle()
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <Countdown />

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