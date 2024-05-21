import { HistoryContainer, HistoryList, Status } from './styles';
import { CyclesContext } from '../../contexts/CyclesContext';
import { useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function History() {
    const { cycles } = useContext(CyclesContext)

    return(
        <HistoryContainer>
            <h1>My history</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cycles.map(cycle => {
                                return(
                                    <tr key={cycle.id}>
                                        <td>{cycle.task}</td>
                                        <td>{cycle.minutesAmount}</td>
                                        <td>{formatDistanceToNow(new Date(cycle.startDate), {addSuffix:true})}</td>
                                        { cycle.stopDate && <td><Status statusColor='red'>Stopped</Status></td> }
                                        { cycle.finishedDate && <td><Status statusColor='green'>Done</Status></td> }
                                        { (!cycle.stopDate && !cycle.finishedDate) && <td><Status statusColor='yellow'>In progress</Status></td> }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}