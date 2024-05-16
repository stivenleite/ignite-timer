import { FormContainer, MinutesInput, TaskInput } from "./styles";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">I will be working on</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Type your project name"
        disabled={!!activeCycle}
        {...register('task')}
      />
      <datalist id="task-suggestions">
        <option value="Task 1" />
        <option value="Task 2" />
        <option value="Task 3" />
      </datalist>

      <label htmlFor="minutesAmount">for</label>
      <MinutesInput
        type="number"
        step={5}
        min={1}
        max={60}
        id="minutesAmount"
        placeholder="00"
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutes.</span>
    </FormContainer>
  )
}
