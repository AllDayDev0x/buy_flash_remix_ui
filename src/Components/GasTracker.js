import { useEffect, useState } from "react";
import {ethers} from 'ethers';


const GasTracker = () => {
    
    const [blockNumber, setBlockNumber] = useState('Loading...');
    const [gasPrice, setGasPrice] = useState('Loading...');
    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/8KNx5j9eeU5L2LJa4-jPEFh6en98mOaG');
        provider.on("block", async(number) => {
            setBlockNumber(number);
            let gas_price = await provider.getGasPrice();
            gas_price = ethers.utils.formatUnits(gas_price, 'gwei')
            setGasPrice(Number(gas_price).toFixed(2));
        })
    }, []);

    return (
        <div className="live-prices--column">
            <div className="live-prices--block w-50 live">
                <p className="text-center"><span></span> Latest Block</p>
                <h5 className="text-center">{blockNumber}</h5>
            </div>
            <div className="live-prices--block w-50 live">
                <p className="text-center"><span></span> Gas Price</p>
                <h5 className="text-center">{gasPrice}</h5>
            </div>
        </div>
    )
}

export default GasTracker;