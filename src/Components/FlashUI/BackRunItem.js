
const BackRunItem = (props) => {

    return (
        <div className="p-3 hover">
            <div>
                <span className="mr-5">wallet: {props.data.wallet} </span>
                <span className="mr-5">s: {props.data.s} </span>
                <span className="mr-5">to: {props.data.to} </span>
                <span className="mr-5">value: {props.data.value} </span>
                <span className="mr-5">data: {props.data.data} </span>
                <div className="rtl">
                    <span className="btn btn-sm btn-danger" onClick={() => { props.onDelete() }}><i className="far fa-trash-alt" ></i>delete</span>
                    <span className="mr-1 btn btn-sm btn-success" onClick={() => { props.onChange() }}><i className="far fa-edit" ></i>change</span>
                </div>




            </div>

        </div>
    )
}
export default BackRunItem;