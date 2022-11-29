const General = ({details, updateDetails,onSaveClick}) => {
    if(details)
    return (
        <div>	
            <div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
                <div className="wallet--input-group">
                    <label>Wallets</label>
                    <div className="input-group">
                        <input
                            placeholder="0,1,2"
                            className="form-control"
                            value={details.wallets}
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("wallets", event.target.value)}}
                            required
                        />
                    </div>
                </div>
                <div className="wallet--input-group">
                    <label>to</label>
                    <div className="input-group">
                        <input
                            placeholder="0x7a250d5630b4cf539739df2c5dacb4c659f2488d" className="form-control"
                            value={ details.to }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("to", event.target.value)}}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
                <div className="wallet--input-group">
                    <label>value</label>
                    <div className="input-group">
                        <input
                            placeholder="10"
                            className="form-control"
                            value={ details.value }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("value", event.target.value)}}
                            required
                        />
                    </div>
                </div>
                <div className="wallet--input-group">
                    <label>data</label>
                    <div className="input-group">
                        <input
                            placeholder="0xfb3bdb41"
                            className="form-control"
                            value={ details.data }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("data", event.target.value)}}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    else return <></>;
}
export default General;