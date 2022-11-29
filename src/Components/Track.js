import { useEffect,useState,useRef } from "react";
import { server_list } from "../config/config";
import { useAppContext } from "../context";

const TrackLog=({index,text})=>{
	
	const trackbox=useRef("");
	useEffect(()=>{
		
		if(text){
		text=text.replace(/\\n/g,"<br/>")
		trackbox.current.innerHTML=text;}
	},[text])
	//console.log(server_list[index])
	return (
		<div className="track-log">
			
			<div ref={trackbox}>
					
			</div>
		</div>
	)
}
const Track = () => {
	const [_switch,_setSwitch]=useState(false)
	const {wss,setTaskStatus}=useAppContext()
	const addTrackLog=(key,text)=>{
		let _trackLogs=trackLogs
		_trackLogs[key]=_trackLogs[key]?_trackLogs[key]+"<p>"+text+"</p>":"<p>"+text+"</p>"
	setTrackLogs(_trackLogs)
	_setSwitch(state=>!state)
	//console.log(text,"message test")
	
	}
	const [trackLogs,setTrackLogs]=useState([])
	useEffect(()=>{
		
		server_list.map((serverUrl,key)=>{
		if(wss[key]){
			
			wss[key].addEventListener('open',()=>{
				addTrackLog(key,`${serverUrl.wss} is connected`);
				
			})
			wss[key].addEventListener('message',(e,flags)=>{
				let data=JSON.parse(e.data)
				
				if(!(data.path =="status" || data.path =="gatewayState")){
					
					let parser=new DOMParser();
					//console.log(e)
					let doc =parser.parseFromString(data.message,"text/html");
					
					addTrackLog(key,serverUrl.wss+'::'+doc.body.innerHTML)
				}else if(data.path == "status"){
					let task_idx=data.idx;
					let status=data.status;
					setTaskStatus(state=>{
						let taskstatus=state;
						taskstatus[task_idx][key]=status;
						return [...taskstatus];
					})

				}
				
			})
			wss[key].addEventListener('error',()=>{
				addTrackLog(key,`${serverUrl.wss}:: Connecting error!`)
			})
		}
		
		
	})
	},[wss])
	return (
		<div className="wallet--panel-block panel-track" >
			{server_list.map((item,key)=><TrackLog  key={key} text={trackLogs[key]}/>)}
			
		</div>
	)
}

export default Track;