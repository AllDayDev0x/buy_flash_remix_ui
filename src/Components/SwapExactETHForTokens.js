import {ethers} from "ethers";

const SwapExactETHForTokens = ({details, updateDetails, onSaveClick}) => {
    // 0x7ff36ab5
    // 00000000000000000000000000000000000000000000000000000000000f4240
    // 0000000000000000000000000000000000000000000000000000000000000080
    // =address=
    // 000000000000000000000000000000000000000000000000000009184e72a000
    // 0000000000000000000000000000000000000000000000000000000000000002
    // 000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    // 000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
    const onGenerateHex = () => {
        try {
            onSaveClick();
            const hex = ethers.utils.defaultAbiCoder.encode(["uint", "address[]", "address", "uint"], [details.amountOutMin, details.path.split(",").map(a => a.trim()), ethers.constants.AddressZero, details.deadline]);
            updateDetails("hexData", "0x7ff36ab5" + hex.substring(2, 2+64+64) + "=address=" + hex.substring(2+64+64+64));
        } catch(err) {

        }
        
    }
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
                        onBlur={onSaveClick}
                            placeholder="0x7a250d5630b4cf539739df2c5dacb4c659f2488d" className="form-control"
                            value={ details.to }
                            onChange={(event)=>{updateDetails("to", event.target.value)}}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
                <div className="wallet--input-group">
                    <label>path</label>
                    <div className="input-group">
                        <input
                            placeholder="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                            className="form-control"
                            value={ details.path }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("path", event.target.value)}}
                            required
                        />
                    </div>
                </div>
                <div className="wallet--input-group">
                    <label>amount out</label>
                    <div className="input-group">
                        <input
                            placeholder="10000000000"
                            className="form-control"
                            value={ details.amountOutMin }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("amountOutMin", event.target.value)}}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="wallet--input-boxes-grid wallet--input-boxes-grid2">
                <div className="wallet--input-group">
                    <label>amount in max</label>
                    <div className="input-group">
                        <input
                            placeholder="10"
                            className="form-control"
                            value={ details.amountIn }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("amountIn", event.target.value)}}
                            required
                        />
                    </div>
                </div>
                <div className="wallet--input-group">
                    <label>deadline</label>
                    <div className="input-group">
                        <input
                            placeholder="10000000000000"
                            className="form-control"
                            value={ details.deadline }
                            onBlur={onSaveClick}
                            onChange={(event)=>{updateDetails("deadline", event.target.value)}}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="wallet--input-boxes-grid wallet--input-boxes-grid">
                <div className="wallet--input-group">
                    <label>Hex Data</label>
                    <div className="input-group">
                        <input
                            placeholder="0x"
                            className="form-control"
                            value={ details.hexData }
                            onChange={(event)=>{}}
                            onBlur={onSaveClick}
                            required
                        />
                    </div>
                    <button type="button" href="#" className="btn small orange mt-3" onClick={onGenerateHex} >Generate Hex Data</button>
                </div>
            </div>
        </div>
    );
}
export default SwapExactETHForTokens;