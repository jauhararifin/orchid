import React from 'react';
import { Button, InputGroup, TextArea, Intent, FormGroup, NumericInput, Icon, H1 } from '@blueprintjs/core';
import { DateInput, TimePrecision } from "@blueprintjs/datetime";

const App: React.FC = () => {
	return (
		<div className="App" style={{
			margin: "15px 10px",
		}}>
			<div>
				<H1>New Transaction</H1>
				<FormGroup label="Timestamp" labelFor="text-input" labelInfo="(required)">
					<div style={{display: "flex"}}>
						<div style={{marginRight: 5}}>
							<DateInput
								formatDate={date => date.toLocaleString()}
								parseDate={str => new Date(str)}
								placeholder={"M/D/YYYY"}
								timePrecision={TimePrecision.SECOND}
							/>
						</div>
						<div>
							<Button icon="time" minimal={true} />
						</div>
					</div>
				</FormGroup>
				<FormGroup label="Name" labelFor="text-input" labelInfo="(required)">
					<InputGroup value="" />
				</FormGroup>
				<FormGroup label="Amount" labelFor="text-input" labelInfo="(required)">
					<div style={{display: "flex"}}>
						<div style={{marginRight: 10}}>
							<NumericInput allowNumericCharactersOnly={true}/>
						</div>
						<div className="bp3-select">
							<select>
								<option selected>SGD</option>
								<option value="1">IDR</option>
							</select>
						</div>
					</div>
				</FormGroup>
				<FormGroup label="Channel" labelInfo="(required)">
					<div style={{display: "flex", alignItems: "center"}}>
						<div className="bp3-select" style={{marginRight: 10}}>
							<select>
								<option selected>Cash</option>
								<option value="1">Jenius</option>
								<option value="1">DBS</option>
								<option value="1">EZLink</option>
								<option value="1">Expense</option>
								<option value="1">Income</option>
								<option value="1">Singtel</option>
								<option value="1">Cheque</option>
								<option value="1">GoPay</option>
							</select>
						</div>
						<div style={{marginRight: 10}}>
							<Icon icon="arrow-right" />
						</div>
						<div className="bp3-select" style={{marginRight: 10}}>
							<select>
								<option selected>Cash</option>
								<option value="1">Jenius</option>
								<option value="1">DBS</option>
								<option value="1">EZLink</option>
								<option value="1">Expense</option>
								<option value="1">Income</option>
								<option value="1">Singtel</option>
								<option value="1">Cheque</option>
								<option value="1">GoPay</option>
							</select>
						</div>
					</div>
				</FormGroup>
				<FormGroup label="Category" labelInfo="(required)">
					<div className="bp3-select" style={{width: "100%"}}>
						<select className="bp3-fill">
							<option selected>Food</option>
							<option value="1">Transportation</option>
							<option value="3">Rent</option>
							<option value="3">Income</option>
							<option value="2">Entertaiment</option>
							<option value="3">Utilities</option>
							<option value="4">Other</option>
						</select>
					</div>
				</FormGroup>
				<FormGroup label="Description" labelFor="text-area">
					<TextArea
						growVertically={true}
						fill={true}
						intent={Intent.PRIMARY}
					/>
				</FormGroup>
				<Button intent={Intent.PRIMARY}>Submit</Button>
			</div>
		</div>
	);
}

export default App;
