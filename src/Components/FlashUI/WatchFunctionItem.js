
const WatchFunctionItem = (props) => {
    return (
        <div className="p-3 hover hover">
            <div>
                <span className="mr-5">Description: {props.data.description} </span>
                <span className="mr-5">start_hash: {props.data.start_hash} </span>
                <span className="mr-5">From: {props.data.from} </span>
                <span className="mr-5">included: {props.data.included} </span>
                <span className="mr-5">block delay: {props.data.blockdelay} </span>
                <div className="rtl">
                    <span className="btn btn-sm btn-danger" onClick={()=>{props.onDelete()}}><i className="far fa-trash-alt" ></i>delete</span>
                    <span className="mr-1 btn btn-sm btn-success" onClick={()=>{props.onChange()}}><i className="far fa-edit" ></i>change</span>
                </div>

            </div>

        </div>
    )
}
export default WatchFunctionItem;