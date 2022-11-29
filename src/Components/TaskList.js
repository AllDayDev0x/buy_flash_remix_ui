import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import GasTracker from "./GasTracker";

const TaskList = (props) => {

	const { activeIdx, setActiveIdx,taskStatus, setTaskStatus, setList, list, AddNewTask, removeTask } = useAppContext();
	const [taskName, setTaskName] = useState('');
	useEffect(() => {
		const items = JSON.parse(window.localStorage.getItem('task-list'));
		if (items) {
			setList(items);
		}

	}, [setList]);
	const removeStatus=(idx)=>{
		let _status=[...taskStatus];
		_status.splice(idx,1)
		
		setTaskStatus(_status)
	}
	const addNewTask = async() => {
		if (!taskName) return;
		
		 AddNewTask(taskName);
		let _states=[...taskStatus];
		_states.push([1,1,1]);
		
		setTaskName('');
		setTaskStatus(_states)
	};
	//console.log(taskStatus," taskstatus in TaskList")
	return (
		<div className="wallet--panel-block panel-tasklist">
			<div className="wallet--task-create-group">
				<GasTracker/>
				<div className="wallet--input-group align-items-end mt-3">
					<div className="input-group">
						<input className="form-control" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
					</div>
					<button className="btn green mt-2" onClick={addNewTask}>new task</button>
				</div>
				<div className="wallet--task-list mt-3">
					{
						list.map((item, idx) => {
							return (
								<div className="wallet--task-item" key={idx}>
									<span
										className="remove-btn"
										onClick={() => {removeTask(idx);removeStatus(idx)}}
									><i className="fa fa-times fa-2x text-muted"/></span>
									<span
										className={`tab ${activeIdx == idx ?taskStatus[activeIdx]&&taskStatus[activeIdx].includes(0) ? "start-status-list active":"active" :taskStatus[idx]&&taskStatus[idx].includes(0)?"start-status-list":""}`}
										onClick={() => { setActiveIdx(idx)}}
									>{item.taskName ? item.taskName : "Task " + (idx + 1)}</span>
								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default TaskList;