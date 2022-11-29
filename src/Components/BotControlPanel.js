import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

function BotControlPanel(props) {
	const [connectionStatus, setConnectionStatus] = useState(0);	// 0: Connecting
																																// 1: Connected
																																// 2: Running
																																// 2: Error
	const [configText, setConfigText] = useState("");

	useEffect(async () => {
		setConfigText("");
		loadConfigFromServer();
	}, [props.server])

	const loadConfigFromServer = () => {
		setConnectionStatus(0);
		axios.get(props.apiEnd + "/loadConfig").then(resp => {
			setConfigText(JSON.stringify(resp.data, null, 2));
			setConnectionStatus(1);
		}).catch(err => {
			console.log(err);
			setConnectionStatus(3);
		})
	}

	const sendRunBot = () => {
		axios.post(props.apiEnd + "/run").then(resp => {
			if (resp.data == "success") {
				alert("Bot has running successfully");
			}
		}).catch(err => {
			console.log(err);
			loadConfigFromServer();
		})
	}

	const saveConfigToServer = () => {
		let _config;
		try {
			_config = JSON.parse(configText);
		} catch (err) {
			alert(`Error occured on config in JSON types`);
			return;
		}

		if (_config) {
			axios.post(props.apiEnd + "/saveConfig", _config).then(resp => {
				setConfigText(JSON.stringify(_config, null, 2));
				if (resp.data == "success") {
					alert("Configuration has saved successfully");
				}
			}).catch(err => {
				console.log(err);
				loadConfigFromServer();
			})
		} else {
			alert("Cannot save the empty config");
		}
	}

	const onClickMainButton = () => {
		if (connectionStatus == 3) {
			loadConfigFromServer();
		} else if (connectionStatus == 1) {
			sendRunBot("/run");
		}
	}

	return (
		<div>
			<div className="wallet--input-boxes-grid wallet--input-boxes-grid">
				<div className="wallet--input-group">
					<textarea 
						className="form-control textarea-edit-config"
						rows="20"
						value={configText}
						onChange={(e) => setConfigText(e.target.value)}
					/>
				</div>
			</div>
			<hr />
			<div className="wallet--footer">
				<button 
					type="button"
					href="#"
					className={connectionStatus == 0 ?
						"btn full-width dark"
						:
						(connectionStatus == 1 ?
							"btn full-width green"
							:
							"btn full-width red"
						)
					}
					disabled={connectionStatus == 0 || connectionStatus == 2}
					onClick={onClickMainButton}
				>
					{connectionStatus == 0 ? 
						"Connecting..."
						:
						(connectionStatus == 1 ?
							"Run Bot"
							:
							(connectionStatus == 3 ?
								"Reconnect"
								:
								"Running now"
							)
						)
					}
				</button>
				{connectionStatus == 1 && (
					<button
						type="button"
						href="#"
						className="btn full-width blue"
						onClick={saveConfigToServer}
					>
						Save config to Bot
					</button>
				)}
			</div>
		</div>
	);
}

export default BotControlPanel;
