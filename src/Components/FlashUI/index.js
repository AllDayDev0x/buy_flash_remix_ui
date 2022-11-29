import { useState, useEffect } from "react"
import { Switch } from "antd";
import WatchFunctionItem from "./WatchFunctionItem";
import FrontRunItem from "./FrontRunItem";
import BackRunItem from "./BackRunItem";
import config from "./config";

const FlashUI = () => {

  const [newTask, setNewTask] = useState("");

  const [activeIdx, setActiveIdx] = useState(0)
  const [storage, setStorage] = useState([])
  const [relay, setRelay] = useState([]);

  const [simulate, setSimulate] = useState(true);
  const [gas, setGas] = useState({
    type: 0,
    gasPrice: "",
    maxPriorityFeePerGas: "",
    maxFeePerGas: "",
    gasLimit: "",

  })
  const [WS, setWS] = useState();
  const [trigger, setTrigger] = useState({})
  const [watchForm, setWatchForm] = useState({})
  const [watchIndex, setWatchIndex] = useState(null);
  const [FrontForm, setFrontForm] = useState({})
  const [FrontIndex, setFrontIndex] = useState(null);
  const [BackForm, setBackForm] = useState({})
  const [BackIndex, setBackIndex] = useState(null);
  const addTask = () => {
    let _storage = [...storage];
    if (newTask === "") {
      alert("Please input the name of task")
    }
    let date = new Date();
    _storage.push({
      id: date.getTime(),
      name: newTask, trigger: {}, relay: [], gas: {
        type: 0,
        gasPrice: "",
        maxPriorityFeePerGas: "",
        maxFeePerGas: "",
        gasLimit: "",
      },
      watch_functions: [],
      backruns: [],
      frontruns: [],
      start: false,
      simulate: true
    });
    setStorage(_storage);

  }
  const handleSimulate = (checked) => {
    let _storage = [...storage];
    // console.log(checked, val)
    if (!storage[activeIdx]) {
      return;
    }

    _storage[activeIdx].simulate = checked

    setStorage(_storage)
  }
  const removeTask = (ind) => {
    let _storage = [...storage];
    if (storage[ind].start === true) {
      alert("Sorry! You can't remove running task! Try again after stop this task.")
      return;
    }
    if (ind === _storage.length - 1) {
      setActiveIdx(state => (state - 1))
    }
    _storage.splice(ind, 1);

    setStorage(_storage);

  }
  const relayChange = (checked, val) => {
    let _storage = [...storage];
    // console.log(checked, val)
    if (!storage[activeIdx]) {
      return;
    }
    if (checked === true) {
      // console.log("true")
      _storage[activeIdx].relay.push(val)
    }
    else if (checked === false) {

      let relayIndex = _storage[activeIdx].relay.indexOf(val);
      //console.log(relayIndex, "relayIndex")
      _storage[activeIdx].relay.splice(relayIndex, 1);
      //console.log(_storage)
    }
    setStorage(_storage)
  }
  useEffect(() => {
    setWatchForm({});
    setWatchIndex(null);
    setFrontForm({});
    setFrontIndex(null);
    setBackForm({});
    setBackIndex(null);
  }, [activeIdx])

  useEffect(() => {
    const _storage = window.localStorage.getItem("flashbot");
    if (_storage) {
      setStorage(JSON.parse(_storage));

    }
    let wss = new WebSocket(config.serverURL.wss);
    setWS(wss);
    wss.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "stop") {
        let _storage = JSON.parse(window.localStorage.getItem("flashbot"));
        let index = _storage.findIndex(item => { return item.id === data.id })
        //console.log(index,id)
        _storage[index].start = false;
        // console.log(_storage)
        setStorage(_storage)
      }
    }

  }, []);

  useEffect(() => {
    // console.log(storage, activeIdx)
    let _storage = [...storage];
    if (_storage[activeIdx]) {
      if (_storage[activeIdx].relay) {
        //console.log(_storage[activeIdx].relay)
        setRelay(_storage[activeIdx].relay)

      }
      if (_storage[activeIdx].trigger) {
        setTrigger(_storage[activeIdx].trigger)

      }
      if (_storage[activeIdx].gas) {
        setGas(_storage[activeIdx].gas);
      }
      setSimulate(_storage[activeIdx].simulate)
    }

  }, [activeIdx, storage])
  useEffect(() => {
    let _storage = [...storage]
    localStorage.setItem("flashbot", JSON.stringify(_storage))
  }, [storage])
  const triggerHandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let _storage = [...storage];
    //log(_storage, activeIdx)
    _storage[activeIdx].trigger[name] = value;
    setStorage(_storage);
  }
  const importExistingTask = (taskInd) => {
    let _storage = localStorage.getItem("flashbot");
    _storage = JSON.parse(_storage);
    let currentInd = activeIdx;
    let _task = { ..._storage[taskInd] }
    _task = { ..._task, name: _storage[activeIdx].name };
    _storage[currentInd] = _task
    _storage = JSON.parse(JSON.stringify(_storage))
    setStorage([..._storage]);
  }
  const onGasChange = (field, val) => {

    let _storage = [...storage];
    if (_storage[activeIdx])
      _storage[activeIdx].gas[field] = val;
    setStorage(_storage);
  }
  const handleWatch = (field, val) => {
    setWatchForm(state => ({ ...state, [field]: val }))
  }
  const handleChangeWatchFunction = (type) => {
    let _storage = [...storage];

    if (type === "change") {
      _storage[activeIdx].watch_functions[watchIndex] = { ...watchForm };

    } else if (type === "add") {
      _storage[activeIdx].watch_functions.push({ ...watchForm });
    }
    setStorage(_storage);
  }
  const handleClickWatchItemChange = (index, type) => {
    let _storage = [...storage];
    if (type === "change") {

      let _watchForm = _storage[activeIdx].watch_functions[index];
      setWatchForm(_watchForm);
      setWatchIndex(index);
    }
    else if (type === "delete") {
      _storage[activeIdx].watch_functions.splice(index, 1)
      setStorage(_storage)
    }
  }
  const handleFrontForm = (field, val) => {
    setFrontForm(state => ({ ...state, [field]: val }))
  }
  const handleChangeFrontFunction = (type) => {
    let _storage = [...storage];

    if (type === "change") {
      _storage[activeIdx].frontruns[FrontIndex] = { ...FrontForm };

    } else if (type === "add") {
      _storage[activeIdx].frontruns.push({ ...FrontForm });
    }
    setStorage(_storage);
  }
  const handleClickFrontItemChange = (index, type) => {
    let _storage = [...storage];
    if (type === "change") {

      let _FrontForm = _storage[activeIdx].frontruns[index];
      setFrontForm(_FrontForm);
      setFrontIndex(index);
    }
    else if (type === "delete") {
      _storage[activeIdx].frontruns.splice(index, 1)
      setStorage(_storage)
    }
  }
  const handleBackForm = (field, val) => {
    console.log(val)
    setBackForm(state => ({ ...state, [field]: val }))
  }
  const handleChangeBackFunction = (type) => {
    let _storage = [...storage];

    if (type === "change") {
      _storage[activeIdx].backruns[BackIndex] = { ...BackForm };

    } else if (type === "add") {
      _storage[activeIdx].backruns.push({ ...BackForm });
    }
    setStorage(_storage);
  }
  const handleClickBackItemChange = (index, type) => {
    let _storage = [...storage];
    if (type === "change") {

      let _BackForm = _storage[activeIdx].backruns[index];
      setBackForm(_BackForm);
      setBackIndex(index);
    }
    else if (type === "delete") {
      _storage[activeIdx].backruns.splice(index, 1)
      setStorage(_storage)
    }
  }
  const handleSubmit = () => {
    let _storage = [...storage];
    let _config = {
      ...config,
      ...storage[activeIdx]
    }
    if (WS.readyState !== 0) {
      WS.send(JSON.stringify(_config))
    }
    _storage[activeIdx].start = !_storage[activeIdx].start
    setStorage(_storage)
  }
  const setAutoSend = val =>{
    let _storage= [...storage];
    _storage[activeIdx].autoSend = val
    setStorage(_storage)
  }

  return (
    <div>
      <div className="rounded shadow" >
        <div className="row border-dark p-3 ">
          <div className="col-md-4 " style={{ height: "inherit" }}>
            <div className="bg-dark2 p-4 rounded" style={{ height: "100%" }}>

              <button className="btn btn-primary" onClick={e => { addTask(); setNewTask("") }} >
                New Task
              </button>
              <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} className="form-control mt-3" />
              <h5 className="underline pl-2">List of Tasks</h5>
              <div>
                <ul className="list-group">
                  {storage.map((item, index) => (

                    <li key={index} onClick={e => setActiveIdx(index)} className={activeIdx === index ? "list-group-item d-flex mt-1 justify-content-between align-item center task-item active " : storage[index].start ? "list-group-item d-flex mt-1 justify-content-between align-item center task-item  bg-danger" : "list-group-item d-flex mt-1 justify-content-between align-item center task-item "}>
                      {item.name}
                      <span className="close" onClick={e => { removeTask(index) }}>&times;</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
          <div className="col-md-8">
            <div className="bg-dark2 p-4 rounded" style={{ height: "100%" }}>
              <div className="row">
                <div className="col-md-3">
                  <label>
                    IMPORT FROM EXISTING TASK
                  </label>
                  <select className="form-select" onChange={e => { importExistingTask(e.target.value) }}>
                    <option> Other Tasks</option>
                    {storage.map((item, index) => {
                      return index !== activeIdx && (
                        <option value={index} key={index}>{item.name}</option>
                      )

                    })}

                  </select>
                </div>
                <div className="col-md-9 rtl">
                  {
                    storage[activeIdx] &&
                    (<button className={storage[activeIdx].start ? "btn btn-danger" : "btn btn-info"} onClick={e => handleSubmit()}>{storage[activeIdx].start ? "stop" : "start"}</button>)

                  }
                </div>

              </div>
              <div className="row">
                <div className="col-md-6 pr-2">
                  <p className="underline">RELAYS</p>

                  <div className="row pt-3">
                    <div className="col-3">
                      <label className="mr-3">BLOXROUTE</label><br></br>
                      <Switch size="small" onChange={checked => relayChange(checked, "bloxroute")} checked={relay.includes("bloxroute")} />
                    </div>
                    <div className="col-3">
                      <label className="mr-3" >FLASHBOT</label><br></br>
                      <Switch size="small" onChange={checked => relayChange(checked, "flashbot")} checked={relay.includes("flashbot")} />
                    </div>
                    <div className="col-3">
                      <label className="mr-3" >0xBuilder</label><br></br>
                      <Switch size="small" onChange={checked => relayChange(checked, "0xBuilder")} checked={relay.includes("0xBuilder")} />
                    </div>
                    <div className="col-3">
                      <label className="mr-3">EDEN</label><br></br>
                      <Switch size="small" onChange={checked => relayChange(checked, "eden")} checked={relay.includes("eden")} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 pl-2">
                  <p className="underline">TRIGGER</p>
                  <div className="row">
                    <div className="col-md-4">
                      <label>BLOCKDELAY</label>
                      <input type="number" value={trigger.blockdelay} name="blockdelay" onChange={triggerHandle} className="form-control form-control-sm" />
                    </div>
                    <div className="col-md-4" >
                      <label>Timestamp</label>
                      <input type="number" value={trigger.timestamp} name="timestamp" onChange={triggerHandle} className="form-control form-control-sm" />
                    </div>
                    <div className="col-md-4" >
                      <label>REPEAT</label>
                      <input type="text" value={trigger.repeat} name="repeat" onChange={triggerHandle} className="form-control form-control-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-md-4">
                  <label>Tx Type</label>

                  <select className="form-select" style={{}} value={gas.type} onChange={(event) => { onGasChange("type", event.target.value) }} >
                    <option value={0}>Legacy</option>
                    <option value={1}>EIP 1559</option>
                  </select>

                </div>
                <div className="col-md-4">
                  <label >GAS PRICE:</label>
                  <input type="text" className="form-control " onChange={e => onGasChange("gasPrice", e.target.value)} value={gas.gasPrice} />

                </div>
                <div className="col-md-4">
                  <label >MAX FEE PER GAS:</label>
                  <input type="text" className="form-control " onChange={e => onGasChange("maxFeePerGas", e.target.value)} value={gas.maxFeePerGas} />

                </div>
                <div className="col-md-4">
                  <label >MAX PRIORITY FEE PER GAS:</label>
                  <input type="text" className="form-control " onChange={e => onGasChange("maxPriorityFeePerGas", e.target.value)} value={gas.maxPriorityFeePerGas} />

                </div>
                <div className="col-md-4">
                  <label >GAS LIMIT:</label>
                  <input type="text" className="form-control " onChange={e => onGasChange("gasLimit", e.target.value)} value={gas.gasLimit} />

                </div>
                <div className="col-md-4">
                  <div>

                    <label>autoSend</label>
                  </div>
                  <div className="p-1">
                    {
                      storage[activeIdx] && (

                        <Switch onChange={e => { setAutoSend( e) }} checked={storage[activeIdx].autoSend} />
                      )
                    }
                  </div>

                </div>
              </div>
              {storage[activeIdx] && storage[activeIdx].autoSend !== true && (
                <div className="bg-dark ">
                  <h6 className="underline p-2">
                    Watch Functions
                  </h6>
                  <div className="bg-dark4 rounded rounded-large border border-dark px-3">
                    <div className="row pt-3">

                      <div className="col row">
                        <div>
                          <label>description</label>

                        </div>
                        <div>

                          <input type="text" onChange={e => { handleWatch("description", e.target.value) }} className="form-control-sm" />
                        </div>
                      </div>
                      <div className="col">
                        <div>

                          <label>start_hash</label>
                        </div>
                        <input type="text" onChange={e => { handleWatch("start_hash", e.target.value) }} className="form-control-sm" />
                      </div>
                      <div className="col row">
                        <div>
                          <label>block delay</label>

                        </div>
                        <div>

                          <input type="text" onChange={e => { handleWatch("blockdelay", e.target.value) }} className="form-control-sm" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="">
                          <div className="">
                            <label>from</label>
                          </div>
                          <div className="">
                            <input type="text" onChange={e => { handleWatch("from", e.target.value) }} className="form-control form-control-sm" />
                          </div>
                        </div>


                      </div>

                      <div className="col ">
                        <div>

                          <label>included</label>
                        </div>
                        <div className="p-1">

                          <Switch onChange={e => { handleWatch("included", e) }} />
                        </div>
                      </div>

                      <div className="col-md-12 pr-5 rtl pb-2 mb-3">
                        {watchIndex !== null && (<button className="btn btn-sm btn-dark" onClick={() => { handleChangeWatchFunction("change") }}>CHANGE </button>)}
                        <button className="btn btn-sm btn-dark " onClick={() => { handleChangeWatchFunction("add") }}>ADD</button>
                      </div>
                    </div>
                  </div>
                  {
                    storage[activeIdx] && storage[activeIdx].watch_functions && storage[activeIdx].watch_functions.map((item, index) => (

                      <WatchFunctionItem key={index} data={item} onChange={() => { handleClickWatchItemChange(index, "change") }} onDelete={() => { handleClickWatchItemChange(index, "delete") }} />
                    ))
                  }
                </div>
              )}

              <div className="bg-dark mt-3">
                <h6 className="underline p-2">
                  BackRuns
                </h6>
                <div className="bg-dark4 rounded rounded-large border border-dark px-3">
                  <div className="row pt-4">

                    <div className="col">
                      <div>

                        <label>wallet</label>
                      </div>
                      <div>

                        <input type="text" onChange={e => { handleBackForm("wallet", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>
                    <div className="col">
                      <div>

                        <label>value</label>
                      </div>
                      <div>

                        <input type="text" onChange={e => { handleBackForm("value", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>

                    <div className="col">
                      <div>

                        <label>s: </label>
                      </div>
                      <div>

                        <input type="text" style={{ width: 150 }} onChange={e => { handleBackForm("s", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>

                    <div className="col-md-5">
                      <div className="row">
                        <div className="">
                          <label>to</label>
                        </div>
                        <div className="">
                          <input type="text" onChange={e => { handleBackForm("to", e.target.value) }} className="form-control form-control-sm" />
                        </div>
                      </div>


                    </div>
                    <div className="col-md-5">
                      <div className="row">
                        <div className="">
                          <label>data</label>
                        </div>
                        <div className="">
                          <input type="text" onChange={e => { handleBackForm("data", e.target.value) }} className="form-control form-control-sm" />
                        </div>
                      </div>


                    </div>
                    <div className="col-md-12 pr-5 rtl mb-4">
                      {BackIndex !== null && (<button className="btn btn-sm btn-dark" onClick={() => { handleChangeBackFunction("change") }}>CHANGE </button>)}
                      <button className="btn btn-sm btn-dark" onClick={() => { handleChangeBackFunction("add") }}>ADD</button>
                    </div>
                  </div>
                </div>
                {
                  storage[activeIdx] && storage[activeIdx].backruns && storage[activeIdx].backruns.map((item, index) => (
                    <BackRunItem data={item} key={index} onChange={() => { handleClickBackItemChange(index, "change") }} onDelete={() => { handleClickBackItemChange(index, "delete") }} />))
                }

              </div>
              <div className="bg-dark mt-3">
                <h6 className="underline p-2">
                  FrontRuns
                </h6>
                <div className="bg-dark4 rounded rounded-large border border-dark px-3">
                  <div className="row pt-4">

                    <div className="col">
                      <div>

                        <label>wallet</label>
                      </div>
                      <div>

                        <input type="text" onChange={e => { handleFrontForm("wallet", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>
                    <div className="col">
                      <div>

                        <label>value</label>
                      </div>
                      <div>

                        <input type="text" onChange={e => { handleFrontForm("value", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>

                    <div className="col">
                      <div>

                        <label>s: </label>
                      </div>
                      <div>

                        <input type="text" style={{ width: 150 }} onChange={e => { handleFrontForm("s", e.target.value) }} className="form-control-sm" />
                      </div>
                    </div>

                    <div className="col-md-5">
                      <div className="row">
                        <div className="">
                          <label>to</label>
                        </div>
                        <div className="">
                          <input type="text" onChange={e => { handleFrontForm("to", e.target.value) }} className="form-control form-control-sm" />
                        </div>
                      </div>


                    </div>
                    <div className="col-md-5">
                      <div className="row">
                        <div className="">
                          <label>data</label>
                        </div>
                        <div className="">
                          <input type="text" onChange={e => { handleFrontForm("data", e.target.value) }} className="form-control form-control-sm" />
                        </div>
                      </div>


                    </div>
                    <div className="col-md-12 pr-5 rtl mb-4 ">
                      {FrontIndex !== null && (<button className="btn btn-sm btn-dark" onClick={() => { handleChangeFrontFunction("change") }}>CHANGE </button>)}
                      <button className="btn btn-sm btn-dark" onClick={() => { handleChangeFrontFunction("add") }}>ADD</button>
                    </div>
                  </div>
                </div>
                {
                  storage[activeIdx] && storage[activeIdx].frontruns && storage[activeIdx].frontruns.map((item, index) => (
                    <FrontRunItem data={item} key={index} onChange={() => { handleClickFrontItemChange(index, "change") }} onDelete={() => { handleClickFrontItemChange(index, "delete") }} />))
                }

              </div>

              <label className="mr-3">simulate</label>
              <Switch size="small" onChange={checked => handleSimulate(checked)} checked={simulate} />

              <div className="pt-3" style={{ textAlign: "center" }}>
                {
                  storage[activeIdx] &&
                  (<button className={storage[activeIdx].start ? "btn btn-danger" : "btn btn-info"} onClick={e => handleSubmit()}>{storage[activeIdx].start ? "stop" : "start"}</button>)

                }
              </div>


            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
export default FlashUI