import { useState } from 'react';
import TaskList from './Components/TaskList';
import Task from './Components/Task';
import Track from './Components/Track';
import 'antd/dist/antd.css';
import './css/App.css';
import Sellpage from "./Components/Sellpage";
import FlashUI from "./Components/FlashUI"
function App() {
	const [page, setPage] = useState(1)
	return (
	<div className="page-layout">
		<div className=' bg-dark1 shadow d-flex justify-content-end'>
				<span onClick={e=>{setPage(1)}} className=' btn btn-secondary btn-sm my-2 py-3 px-4  '> Buy</span>
				<span onClick={e=>{setPage(2)}} className=' btn btn-secondary btn-sm  my-2 py-3 px-4 '> Contract</span>
				<span onClick={e=>{setPage(3)}} className=' btn btn-secondary btn-sm  my-2 py-3 px-4 mr-5'> Flash</span>
		</div>
		<main>
			<div className="container">
			{(page===1)&&(

				<section id="wallets">
				<div className="wallet--grid">
					<div className='row'>
						<div className='col-md-4'style={{height:"100%"}}>
							<TaskList />
						</div>
						<div className='col-md-8'>
							<Task />
							<Track/>
						</div>
					</div>
				</div>
				</section>
				)}
				{(page===2)&&(
				<Sellpage/>
				)}
				{(page===3)&&(
				<FlashUI/>
				)}
			</div>
		</main>
	</div>
  );
}

export default App;
