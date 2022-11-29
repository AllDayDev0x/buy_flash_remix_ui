import { useEffect, useState } from "react";
import axios from "axios"
import { webVital } from '../reportWebVitals';
import { useAppContext } from "../context";
import { rpc_eth, rpc_bsc, my_accounts } from '../config/config';
import General from './General';
import SwapExactETHForTokens from './SwapExactETHForTokens';
import SwapETHForExactTokens from './SwapETHForExactTokens';

const Task = (props) => {

	// const [hashlist,setHashlist]=useState(start_hash)
	const { activeIdx, updateTaks, list, wss, taskStatus, setTaskStatus, } = useAppContext();
	// console.log(list)
	const [gatewayState, setGatewayState] = useState({});
	const [gas, setGas] = useState({ type: 0, gasPrice: "", maxPriorityFeePerGas: "", maxFeePerGas: "", gasLimit: "" });
	const [watch, setWatch] = useState({ start_hash: "", from: "" });
	const [blockDelay, setBlockDelay] = useState("");
	const [timestamp, setTimestamp] = useState("");
	const [bloxRouteAuthHeader, setBloxRouteAuthHeader] = useState('')
	const [botType, setBotType] = useState(0);
	const [taskType, setTaskType] = useState('custom');
	const [flag, setFlag] = useState(false);
	const [nonceMode, setNonceMode] = useState(false)

	const [rpc, setrpc] = useState(rpc_eth)
	// rawData
	const defaultTodoDetails = { wallets: "", to: "", value: '', data: '' };
	const [todoDetails, setTodoDetails] = useState(defaultTodoDetails);
	// swapETHForExactTokens
	const defaultUni9Details = { wallets: "", amountInMax: "", amountOut: "", path: "", to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", deadline: "10000000000000", hexData: "" };
	const [uni9Details, setUni9Details] = useState(defaultUni9Details);
	// swapExactETHForTokens
	const [rpcvalue, setrpcValue] = useState(1)
	const defaultUni10Details = { wallets: "", amountIn: "", amountOutMin: "", path: "", to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", deadline: "10000000000000", hexData: "" };
	const [uni10Details, setUni10Details] = useState(defaultUni10Details);

	useEffect(() => {
		if (!list.length) return;
		const activeData = list[activeIdx];
		setTodoDetails(activeData.todoDetails || defaultTodoDetails);
		setUni9Details(activeData.uni9Details || defaultUni9Details);
		setUni10Details(activeData.uni10Details || defaultUni10Details);
		setTaskType(activeData.taskType);
		setGas(activeData.gas);
		setWatch(activeData.watch_functions);
		setBlockDelay(activeData.blockDelay);
		setTimestamp(activeData.timestamp);
		setBloxRouteAuthHeader(activeData.bloxRouteAuthHeader);
		setBotType(activeData.botType);
		setNonceMode(activeData.nonceMode);
		setrpcValue(activeData.rpc)
		// console.log(activeData.rpc,"rpc")
		// setrpc(activeData.rpc)
	}, [activeIdx, list]);
	useEffect(()=>{
		wss.map(ws=>{
			console.log("ws")
			if(1){
				ws.onmessage = (e)=>{
					let data = JSON.parse(e.data);
					console.log(data,"wss")
					if(data.path == "gatewayState"){

						setGatewayState({...gatewayState, [ws.url]:data.state})
					}
				}
			}
		})
	},[wss])
	console.log(gatewayState)
	const onGasChange = (key, value) => {
		if (key === "type") {
			value = eval(value)
		}
		//console.log(typeof(value))
		setGas({ ...gas, [key]: value });
	}
	const onWatchChange = async (key, value) => {

		setWatch({ ...watch, [key]: value });

	}

	const onChangeBotType = (type) => {
		// console.log(type)
		if (type == 0) {
			setGas({ type: 0, gasPrice: "", maxPriorityFeePerGas: "", maxFeePerGas: "", gasLimit: "" });
		} else {
			setGas({ type: 1, gasPrice: "auto", maxPriorityFeePerGas: "auto", maxFeePerGas: "auto", gasLimit: "" });
		}

		setBotType(Number(type));



	}
	// console.log(gas.type)
	const importExistingConfig = (value) => {
		if (!value) return;
		const activeData = list[value];
		if (activeData) {
			setTodoDetails(activeData.todoDetails);
			setUni9Details(activeData.uni9Details);
			setUni10Details(activeData.uni10Details);

			setTaskType(activeData.taskType);
			setGas(activeData.gas);
			setWatch(activeData.watch_functions);
			setBlockDelay(activeData.blockDelay);
			setTimestamp(activeData.timestamp);
			setBloxRouteAuthHeader(activeData.bloxRouteAuthHeader);
			setBotType(activeData.botType);
			setNonceMode(activeData.nonceMode);
			// setrpc(activeData.rpc)
			setrpcValue(activeData.rpc)
			// console.log(activeData.rpc,"rpc")
			
		}


	}
	//console.log(botType)
	const onSaveClick = (e = null) => {
		//console.log(botType)
		let config = { rpc:rpcvalue,gas, watch_functions: watch, botType, taskType, timestamp, blockDelay, bloxRouteAuthHeader, todoDetails, uni9Details, uni10Details, nonceMode };
		updateTaks(config);
		//console.log(e)

	}


	const onStopClick = () => {
		let _status = [...taskStatus];

		wss.map((ws, key) => {
			_status[activeIdx][key] = 1;
			if (ws.readyState !== 0) {
				ws.send(JSON.stringify({ path: "kill", idx: activeIdx }))
			}
		})

		setFlag(flag => !flag)

		setTaskStatus(_status)
		onSaveClick();


	}
	console.log(gatewayState,"gatewayState")
	const onStartClick = () => {
		onSaveClick();
		setFlag(flag => !flag)
		var todo = {};
		if (taskType === "custom") {
			let wallets = [];
			let wallet_str = todoDetails.wallets;
			wallet_str = wallet_str.split(",");
			wallet_str.map(item => {
				if (item.includes("-")) {
					let start_num = item.split("-")[0]
					let end_num = item.split("-")[1];
					for (let i = parseInt(start_num); i <= parseInt(end_num); i++) {
						wallets.push(i)
					}
				} else {
					wallets.push(item)
				}
				return;
			})
			wallet_str = wallets.toString();
			//console.log(wallet_str)
			todo = { ...todoDetails, wallets: wallet_str, value: parseFloat(todoDetails.value || 0) };
		} else if (taskType === "swapExactETHForTokens") {
			let wallets = [];
			//console.log(uni10Details.wallets)
			let wallet_str = uni10Details.wallets;
			//console.log(wallet_str)
			wallet_str = wallet_str.split(",");
			wallet_str.map(item => {
				if (item.includes("-")) {
					let start_num = item.split("-")[0]
					let end_num = item.split("-")[1];
					for (let i = parseInt(start_num); i <= parseInt(end_num); i++) {
						wallets.push(i)
					}
				} else {
					wallets.push(item)
				}
				return;
			})
			//console.log(wallet_str)
			wallet_str = wallets.toString();
			todo.wallets = wallet_str;
			todo.to = uni10Details.to || "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
			todo.value = parseFloat(uni10Details.amountIn || 0);
			todo.data = uni10Details.hexData;
		} else {
			let wallets = [];
			//console.log(uni9Details.wallets)
			let wallet_str = uni9Details.wallets;

			wallet_str = wallet_str.split(",");
			wallet_str.map(item => {
				if (item.includes("-")) {
					let start_num = item.split("-")[0]
					let end_num = item.split("-")[1];
					for (let i = parseInt(start_num); i <= parseInt(end_num); i++) {
						wallets.push(i)
					}
				} else {
					wallets.push(item)
				}

			})
			//console.log(wallet_str)
			wallet_str = wallets.toString();
			todo.wallets = wallet_str;
			todo.to = uni9Details.to || "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
			todo.value = parseFloat(uni9Details.amountInMax || 0);
			todo.data = uni9Details.hexData;
		}
		
		let startHashVal = watch.start_hash.split("-");
		startHashVal = startHashVal[0].trim().slice(0, 10)
		const config = {

			my_accounts,
			rpc:rpcvalue ==1?rpc_eth:rpc_bsc,
			watch_functions: [{ ...watch, start_hash: startHashVal, description: "" }],
			botType,
			gas,
			todo: [todo],
			bloxRouteAuthHeader,
			timestamp,
			blockDelay: blockDelay === "" ? 0 : Number(blockDelay),
			nonceMode
		};

		try {
			// console.log(webVital + "/updateConfig");
			axios.post(`${webVital}/updateConfig`, {...config}).then(resp => {
			}).catch(err => { });
		} catch (err) {
			
		}
		// console.log(config)
		let _status = taskStatus;
	
   
		wss.map((ws, key) => {

			_status[activeIdx][key] = 0;
			if (ws.readyState !== 0)
				ws.send(JSON.stringify({ path: "run", config, idx: activeIdx }))
		})
		setTaskStatus(_status)
		//console.log(taskStatus[activeIdx],"dfdf",activeIdx)

	}
	// console.log(rpcvalue,rpc)
	return (
		<div className="wallet--panel-block panel-task">
			<div className="wallet--input-boxes-grid wallet--input-boxes-grid3">
				<div className="wallet--input-group">
					<label>RPC</label>

					<select className="form-select" aria-label="Default select wallet" value={rpcvalue} onChange={(event) => { setrpcValue(event.target.value); event.target.value == 1 ? setrpc(rpc_eth) : setrpc(rpc_bsc) }} onBlur={onSaveClick}>
						<option value={1}>rpc_eth</option>
						<option value={2}>rpc_bsc</option>
					</select>

				</div>
				<div className="wallet--input-group">
					<label>task_type</label>

					<select className="form-select" aria-label="Default select wallet" value={taskType} onChange={(event) => { setTaskType(event.target.value); }} onBlur={onSaveClick}>
						<option value={"custom"}>rawData</option>
						<option value={"swapETHForExactTokens"}>swapETHForExactTokens</option>
						<option value={"swapExactETHForTokens"}>swapExactETHForTokens</option>
					</select>

				</div>

				<div className="wallet--input-group">
					<label>Import from existing task</label>
					<select className="form-select" aria-label="Default select wallet" onChange={(e) => importExistingConfig(e.target.value)} onBlur={e => onSaveClick()}>
						<option>Other Tasks</option>
						{
							list.map((item, idx) => (
								activeIdx != idx && <option value={idx} key={idx}>{item?.taskName ? item.taskName : "Task " + (idx + 1)}</option>
							))
						}
					</select>
				</div>
			</div>
			<div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
				<div className="wallet--input-group">
					<label><span>Start_hash</span>
					</label>

					<div className="">

					</div>
					<div className="input-group">
						<input type="text" placeholder="Enter the start hash" className="form-control" value={watch.start_hash} onChange={(event) => { onWatchChange("start_hash", event.target.value) }} onBlur={onSaveClick} required />
					</div>

				</div>

				<div className="wallet--input-group">
					<label>from</label>
					<div className="input-group">
						<input type="text" placeholder="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" className="form-control" value={watch.from} onChange={(event) => { onWatchChange("from", event.target.value) }} onBlur={onSaveClick} required />
					</div>
				</div>
			</div>
			<hr />

			<div className="wallet--input-boxes-grid wallet--input-boxes-grid3">
				<div className="wallet--input-group">
					<label>Bot Type</label>

					<select className="form-select" value={botType} onBlur={onSaveClick} onChange={(e) => onChangeBotType(e.target.value)} aria-label="Default select wallet">

						<option value={0}>Front run</option>
						<option value={1}>Back run</option>
					</select>

				</div>
				<div className="wallet--input-group">
					<label>gas price in gwei</label>
					<div className="input-group">
						<input type="text" placeholder="20" className="form-control" value={gas.gasPrice} onBlur={onSaveClick} onChange={(event) => { onGasChange("gasPrice", event.target.value) }} required readOnly={botType ? true : false} />
					</div>
				</div>
				<div className="wallet--input-group">
					<label>gas limit</label>
					<div className="input-group">
						<input type="text" placeholder="20" className="form-control" value={gas.gasLimit} onBlur={onSaveClick} onChange={(event) => { onGasChange("gasLimit", event.target.value) }} required />
					</div>
				</div>
			</div>

			<div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
				<div className="wallet--input-group">
					<label>Tx Type</label>

					<select className="form-select" value={gas.type} onBlur={onSaveClick} onChange={(event) => { onGasChange("type", event.target.value) }} aria-label="Default select wallet" disabled={botType ? true : false}>
						<option value={0}>Legacy</option>
						<option value={1}>EIP 1559</option>
					</select>

				</div>
				<div className='d-flex gap-2'>
					<div className="wallet--input-group">
						<label>Max Fee</label>
						<div className="input-group">
							<input type="text" placeholder="20" className="form-control" onBlur={onSaveClick} value={gas.maxFeePerGas} onChange={(event) => { onGasChange("maxFeePerGas", event.target.value) }} required readOnly={botType ? true : false} />
						</div>
					</div>
					<div className="wallet--input-group">
						<label>Max Priority Fee</label>
						<div className="input-group">
							<input type="text" placeholder="20" className="form-control" onBlur={onSaveClick} value={gas.maxPriorityFeePerGas} onChange={(event) => { onGasChange("maxPriorityFeePerGas", event.target.value) }} required readOnly={botType ? true : false} />
						</div>
					</div>
				</div>
			</div>

			<hr />
			{
				taskType === "custom" ?
					<General details={todoDetails} updateDetails={(key, value) => { setTodoDetails(state => ({ ...state, [key]: value })) }} onSaveClick={onSaveClick} />
					: taskType === "swapExactETHForTokens" ?
						<SwapExactETHForTokens details={uni10Details} updateDetails={(key, value) => { setUni10Details(state => ({ ...state, [key]: value })) }} onSaveClick={onSaveClick} />
						:
						<SwapETHForExactTokens details={uni9Details} updateDetails={(key, value) => { setUni9Details(state => ({ ...state, [key]: value })) }} onSaveClick={onSaveClick} />}
			<hr />

			<div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
				<div className="wallet--input-group">
					<label>Timestamp</label>
					<div className="input-group">
						<input type="text" placeholder="162358465" className="form-control" value={timestamp} onBlur={onSaveClick} onChange={(event) => { setTimestamp(event.target.value); }} required />
					</div>
				</div>
				<div className="wallet--input-group">
					<label>Block Delay</label>
					<div className="input-group">
						<input type="text" placeholder="auto" className="form-control" value={blockDelay} onBlur={onSaveClick} onChange={(event) => { setBlockDelay(event.target.value); }} required />
					</div>
				</div>

			</div>

			<div className="wallet--input-group">
				<label>bloxRoute Auth Header</label>
				<div className="input-group">
					<input type="text" placeholder="" className="form-control" onBlur={onSaveClick} value={bloxRouteAuthHeader} onChange={(event) => { setBloxRouteAuthHeader(event.target.value) }} required />
				</div>
			</div>
			<div className="">
				<div className="d-inline">

				<input type="checkbox" className="pt-3" onChange= {e=>{setNonceMode(e.target.checked)}} onBlur={onSaveClick}  checked={nonceMode} style={{ width: 50, height: 20 }}  />
				</div>
				<label >Nonce mode</label>

			</div>

			<hr />
			<div>
				{wss.map(ws=>{
					
					if(gatewayState[ws.url] == true)
						return (
						<p className="text-success">the Gateway of {ws.url} is running</p>
						);
						else{
							
							return <p className="text-danger">the Gateway of {ws.url} is disabled</p>
					}
				})}
			</div>
			<div className="wallet--footer">

				<button type="button" href="#" className="btn full-width yellow" onClick={onSaveClick}>Save Config</button>
				{taskStatus[activeIdx] && taskStatus[activeIdx].includes(0) ?
					<button type="button" href="#" className="btn full-width red" onClick={onStopClick}>Stop Bot</button>
					:
					<button type="button" href="#" className="btn full-width green" onClick={onStartClick} >Start Bot</button>
				}

			</div>
		</div>
	)
}

export default Task;