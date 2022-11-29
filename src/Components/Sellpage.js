import { useEffect, useState } from "react";
import _contracts from "./../config/ABI"
import WriteTransPanel from "./WriteTransPanel";
import GetTransPanel from "./GetTransPanel";
import Web3 from "web3";
import { notification } from "antd";
import { my_accounts, rpc_eth } from "../config/config";
const Sellpage = () => {

	const [ABI, setABI] = useState([]);
	const web3 = new Web3(rpc_eth.https);
	const [contracts, setContracts] = useState([]);
	const [gas, setGas] = useState({ txtype: "", gasMax: "", gasPrice: "", gasLimit: "", gasMaxPriority: "" });
	const [wallet, setWallet] = useState(0);
	const [openWriteMethods, setOpenWriteMethods] = useState({});
	const [openGetMethods, setOpenGetMethods] = useState({})
	const [contractInd, setContractInd] = useState(0);
	const [contract, setContract] = useState({});
	const onSelectContract = (e) => {
		setContractInd(e.target.value);
		let _inputsVal = JSON.parse(window.localStorage.getItem("inputsVal")) ?? {}

		_inputsVal = _inputsVal[e.target.value] ?? { write: {}, get: {} }
		//console.log(_inputsVal, "inputsVal")
		setInputsVal(_inputsVal);
		let _openWriteMethods = JSON.parse(window.localStorage.getItem("openWriteMethods"))

		if (_openWriteMethods) {
			_openWriteMethods = _openWriteMethods[e.target.value] ?? {}
			setOpenWriteMethods(_openWriteMethods);
		}
		let _openGetMethods = JSON.parse(window.localStorage.getItem("openGetMethods"))

		if (_openGetMethods) {
			_openGetMethods = _openGetMethods[e.target.value] ?? {}
			setOpenGetMethods(_openGetMethods);
		}
	}
	const [inputsVal, setInputsVal] = useState({ write: {}, get: {} });

	const [writeActions, setWriteActions] = useState([]);
	const [getActions, setGetActions] = useState([]);
	const onGasChange = (filed, val) => {
		setGas(state => ({ ...state, [filed]: val }));
	}
	useEffect(() => {
		if (contracts.length > 0) {
			let contract_abi = contracts[contractInd].abi;

			if (Object.keys(contract_abi).includes("abi") !== false) {
				contract_abi = contract_abi.abi;

			}

			setABI(contract_abi);
		}

	}, [contracts, contractInd])
	useEffect(() => {

		if (ABI && ABI.length > 0) {

			let _writeActions = ABI.filter((method, index) => {
				return method.type === "function" && (method.stateMutability === "payable" || method.stateMutability === "nonpayable");
			});
			setWriteActions(_writeActions);

			let _getActions = ABI.filter((method, index) => {
				return method.type === "function" && (method.stateMutability === "view" || method.stateMutability === "pure");
			});
			setGetActions(_getActions);
			try {

				const _contract = new web3.eth.Contract(ABI, contracts[contractInd].address, { from: my_accounts[wallet].public });
				setContract(_contract)
			} catch (e) {

				notification.error({
					message: 'Error of Tx',
					description: `Tx failed with error: ${e}`,

				})
			}
		}

	}, [contracts, contractInd, wallet, ABI])
	useEffect(() => {
		const run = async () => {
			setContracts(_contracts);
			const Contract_info = JSON.parse(window.localStorage.getItem("Contract"))
			if (Contract_info) {
				setGas(Contract_info.gas);
				setWallet(Contract_info.wallet);
				setContractInd(Contract_info.contractInd);

			}
			//console.log("ok")
			//console.log("ok")
			let _openWriteMethods = await JSON.parse(window.localStorage.getItem("openWriteMethods")) ?? {}


			_openWriteMethods = _openWriteMethods[contractInd] ?? {}
			//console.log("ok")
			setOpenWriteMethods(_openWriteMethods);

			let _openGetMethods = await JSON.parse(window.localStorage.getItem("openGetMethods")) ?? {}

			_openWriteMethods = _openGetMethods[contractInd] ?? {}
			setOpenGetMethods(_openGetMethods);
			//console.log(_openGetMethods)
			let _inputsVal = JSON.parse(window.localStorage.getItem("inputsVal"))
			if (_inputsVal) {
				setInputsVal(_inputsVal[contractInd]);

			}
		}
		run();

	}, [])
	//console.log(openGetMethods, openWriteMethods, "test")

	const onOpenMethod = (type, methodInd, status) => {
		//console.log(type, methodInd, status)
		if (type === "write") {
			setOpenWriteMethods(state => {

				let _state = state;
				_state[methodInd] = status;
				let _openWriteMethods = JSON.parse(window.localStorage.getItem("openWriteMethods")) ?? {};
				_openWriteMethods = { ..._openWriteMethods, [contractInd]: _state };

				window.localStorage.setItem("openWriteMethods", JSON.stringify(_openWriteMethods));
				return { ..._state };
			})
		} else {
			setOpenGetMethods(state => {
				let _state = state;
				//console.log(_state, "getStatge")
				_state[methodInd] = status;
				//console.log(_state, "getStatge2")

				let _openGetMethods = JSON.parse(window.localStorage.getItem("openGetMethods")) ?? {};
				_openGetMethods = { ..._openGetMethods, [contractInd]: _state };

				//console.log(_openGetMethods, "getStatge3")
				window.localStorage.setItem("openGetMethods", JSON.stringify(_openGetMethods));
				return { ..._state };
			});
		}
	}
	const onInputsChange = (type, methodInd, field, val) => {
		let _state = { ...inputsVal };
		let _methods = _state[type];
		let _inputs = _methods[methodInd];


		_inputs = { ..._inputs, [field]: val };
		_methods = { ..._methods, [methodInd]: _inputs };
		_state = { ..._state, [type]: _methods };
		let _inputsval = JSON.parse(window.localStorage.getItem("inputsVal")) ?? {};
		_inputsval = { ..._inputsval, [contractInd]: _state };

		window.localStorage.setItem("inputsVal", JSON.stringify(_inputsval));




		setInputsVal(_state)

	}
	const save_info = () => {

		let Contract_info = JSON.stringify({ gas, wallet, contractInd });

		window.localStorage.setItem("Contract", Contract_info)

	}

	return (
		<div className=" ">
			<div>
				<div className='bg-dark1  pl-3 pr-3 rounded shadow' >
					<div className="row border-dark p-3 bg-dark1 ">
						<div className="col-md-3 ">
							<h4 className="text-light pt-2 d-flex justify-content-end">Select Contract:</h4>
						</div>

						<div className="col-md-8">
							<select type="text" className="form-control border-dark1" value={contractInd} style={{ border: "1px solid  #1a1a1e " }} onBlur={e => save_info()} onChange={onSelectContract}>
								{contracts.map((contract, key) => (
									<option key={key} value={key}>{contract.address}</option>
								))}
							</select>
						</div>
					</div><hr />
					<div>
						<h4 className='text-white'>Contract-calls</h4>
						<div className="row">
							<div className="col">
								<label>Tx Type</label>

								<select className="form-control " value={gas.txtype} onBlur={e => save_info()} onChange={(event) => { onGasChange("txtype", event.target.value) }} >
									<option value={0}>Legacy</option>
									<option value={1}>EIP 1559</option>
								</select>

							</div>
							<div className="col">
								<label >GAS PRICE:</label>
								<input type="text" className="form-control " onBlur={e => save_info()} onChange={e => onGasChange("gasPrice", e.target.value)} value={gas.gasPrice} />

							</div>
							<div className="col">
								<label >MAX FEE:</label>
								<input type="text" className="form-control " onBlur={e => save_info()} onChange={e => onGasChange("gasMax", e.target.value)} value={gas.gasMax} />

							</div>
							<div className="col">
								<label >MAX PRIORITY FEE:</label>
								<input type="text" className="form-control " onBlur={e => save_info()} onChange={e => onGasChange("gasMaxPriority", e.target.value)} value={gas.gasMaxPriority} />

							</div>
							<div className="col">
								<label >GAS LIMIT:</label>
								<input type="text" className="form-control " onBlur={e => save_info()} onChange={e => onGasChange("gasLimit", e.target.value)} value={gas.gasLimit} />

							</div>
						</div>
						<div className="row">
							<div className="col-md-3"></div>
							<div className="col-md-4">
								<label>WALLET</label>
								<select className="form-control" value={wallet} onBlur={e => save_info()} onChange={e => setWallet(e.target.value)}>
									{my_accounts.map((_wallet, key) => (
										<option key={key} value={key}>{_wallet.public}</option>
									))}
								</select>
							</div>
						</div>

						<div className="row shadow bg-dark2 border border-success mb-1 rounded ">
							<div className="col-md-6 p-3">
								{
									writeActions.map((Action, key) => (

										<WriteTransPanel web3={web3} type="write" contractInd={contractInd} inputsVal={inputsVal && inputsVal.write[key]} index={key} onOpen={onOpenMethod} onChange={onInputsChange} openStatus={openWriteMethods[key]} accountIndex={wallet} contract={contract} address={contracts[contractInd].address} ABI={Action} gas={gas} key={key + "_++" + contractInd} />
									)
									)
								}
							</div>
							<div className="col-md-6 p-3">
								{
									getActions.map((Action, key) => (

										<GetTransPanel contractABI={ABI} contract={contract} contractInd={contractInd} web3={web3} type="write" inputsVal={inputsVal && inputsVal.get[key]} index={key} onOpen={onOpenMethod} onChange={onInputsChange} openStatus={openGetMethods[key]} accountIndex={wallet} address={contracts[contractInd].address} key={key + "_" + contractInd} ABI={Action} />
									))
								}
							</div>
						</div>

					</div>

				</div>
			</div>

		</div>
	)

}
export default Sellpage;