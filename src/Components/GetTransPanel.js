import {useState,useEffect} from "react";

import {notification} from "antd"

 const GetTransPanel =({index,type,onOpen,openStatus,inputsVal, onChange,ABI,address,contractABI,web3,contract})=>{
    
    const [spin,setSpin] = useState(false)
   
    useEffect(()=>{
        if(typeof(inputsVal)=="object")
        setForm(inputsVal)
        if(inputsVal)
        setViewData(inputsVal["__viewData$__"])
       // console.log(viewData,"open")
    },[inputsVal])


    const [viewData, setViewData] = useState("");

    const [form,setForm] = useState({});
    const _onChange = (e)=>{
        let name=e.target.name;
        let value=e.target.value;
        onChange("get",index,e.target.name,e.target.value);
        setForm(state=>({...state,[name]:value}));
    }
    const getTransAction = async()=>{
       // console.log(contract.methods,"test")
        if(spin)return;
        setSpin(true)
        let params=[];
        ABI.inputs.map((input,key)=>{
            params.push(form[input.name])
            return;
        })
      //  console.log("sss",...params,ABI.name,address)
       
        try{

            if(params.length===0){
                await contract.methods[ABI.name]().call().then(res=>{onChange("get",index,"__viewData$__",res);})
                
            }else{
                
                 await contract.methods[ABI.name](...params).call().then(res=>{onChange("get",index,"__viewData$__",res)
                });
            }           
           

           setSpin(false)
        }catch(e){
            setSpin(false)
            notification.error({
                message: 'Reading Error',
                description:` ${e}`,
                
          })
        }
            // onChange(data);
        
       
        }
       // console.log(openStatus,"openSatus")
    return (
        <div className="bg-dark2 border container rounded p-0 border-dark text-white">
            <div className="d-flex justify-content-between bg-dark1 rounded"onClick={e=>onOpen("get",index,openStatus!==1?1:0)}>

                <h6 className=" pt-2 pl-5 mb-0 ">{ABI.name}</h6>
                {openStatus!==1?(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>onOpen("get",index,1)}>+</h6>):(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>onOpen("get",index,0)}>-</h6>)}
            </div>
            {openStatus===1&&(<div className="row p-3">
              {ABI.inputs&&ABI.inputs.map((input,key)=>(
                <div className="col-md-6" key={key}>
                    <label> {input.name}</label>
                    <input type="text" name={input.name} onChange={e=>{_onChange(e)}}placeholder={input.type} className="form-control form-control-sm" value={form[input.name]}/>
                </div>
             
              ) 
            ) }
                <div className="row mt-1">
                    <div className='col-md-4'>

                    </div>
                    <div className='col-md-4'>
                        <button className='btn btn-secondary form-control ' onClick={e=>{getTransAction()}}>{spin&&<span className="spinner-border  text-white" style={{height:"1.5em",width:"1.5em"}}></span>}get</button>

                    </div>
                
            
                 </div>
                 <div>
                 {viewData&&(<div className="bg-dark3 p-1 border border-dark rounded " style={{height:"100px",overflow:"auto"}}>
                      {typeof(viewData)=="object"&&Object.keys(viewData).map(i=>(
                        <p>{viewData[i].toString()}</p>
                      )) }
                      {
                        typeof(viewData)=="string"&&(
                            <p>{viewData}</p>
                 )
                      }
                </div>)}
                </div>
            </div>
            
            )}
        </div>
    )
}
export default GetTransPanel;