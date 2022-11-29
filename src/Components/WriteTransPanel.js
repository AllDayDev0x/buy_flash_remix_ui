import {useState,useEffect} from "react";

import {notification} from "antd"
import {my_accounts} from "./../config/config";

 const WriteTransPanel =({index,type,onOpen,openStatus,inputsVal, onChange,accountIndex,ABI, web3,contract, address,gas})=>{

    const [spin,setSpin] = useState(false)
    const [form,setForm] = useState({});

    useEffect(()=>{
        
        if(typeof(inputsVal)==="object")
        setForm(inputsVal);
    },[inputsVal])
    const _onChange = (e)=>{
        let name=e.target.name;
        
        let value=e.target.value;
        onChange("write",index,e.target.name,e.target.value);
        setForm(state=>({...state,[name]:value}));
    } 
    const writeTransAction = async()=>{
      
        if(spin)return;
        setSpin(true)
        let params=[];
        ABI.inputs.map((input,key)=>{
            params.push(form[input.name])
        })
        try {
            const tx = contract.methods[ABI.name](...params);
            let txdata = {};
           // console.log(gas,"gas")
            if(gas.txtype!=0){

                txdata = {
                    type:2,
                    to:address,
                    data:tx.encodeABI(),
                    gas:gas.gasLimit==""?await tx.estimateGas():web3.utils.toHex(gas.gasLimit),
                    maxFeePerGas:web3.utils.toHex(web3.utils.toWei(gas.gasMax, 'gwei')),
                    maxPriorityFeePerGas:web3.utils.toHex(web3.utils.toWei(gas.gasMaxPriority, 'gwei')),
                    nonce:await web3.eth.getTransactionCount(my_accounts[accountIndex].public)
                }
            }
            else{
                txdata = {
                    to:address,
                    type:0,
                    data:tx.encodeABI(),
                    gas:gas.gasLimit==""?await tx.estimateGas():web3.utils.toHex(gas.gasLimit),
                    gasPrice:web3.utils.toHex(web3.utils.toWei(gas.gasPrice, 'gwei')) ,
                    nonce:await web3.eth.getTransactionCount(my_accounts[accountIndex].public)
                   
                }
            }
            console.log(txdata,"txdata");
           // console.log(my_accounts[accountIndex].private);
            const createTransaction= await web3.eth.accounts.signTransaction(txdata,
            my_accounts[accountIndex].private);
            const txRes = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
            notification.success({
                message: 'Succed in sending Tx',
                description:`Tx successful with hash: ${txRes.transactionHash}`,
                    
            })
            setSpin(false)
        } catch(e){
            setSpin(false)
            notification.error({
                message: 'Error of Tx',
                description:`Tx failed with error: ${e}`,
                
          })
        }
        

    }
    
    return (
        <div className="bg-dark2 border container rounded p-0 border-dark text-white">
            <div className="d-flex justify-content-between bg-dark1 rounded"onClick={e=>onOpen("write",index,openStatus===1?0:1)}>

                <h6 className=" pt-2 pl-5 mb-0 ">{ABI.name}</h6>
                {openStatus!==1?(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>onOpen("write",index,0)}>+</h6>):(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>onOpen("write",index,1)}>-</h6>)}
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
                        <button className='btn btn-primary form-control' onClick={e=>{writeTransAction()}}>{spin&&<span className="spinner-border  text-white" style={{height:"1.5em",width:"1.5em"}}></span>}Write</button>

                    </div>
                
            
                 </div>
            </div>)}
        </div>
    )
}
export default WriteTransPanel;