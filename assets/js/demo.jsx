import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Demo side={0}/>, root);
}

function shuffle(arr) { var j, x, i; for (i = arr.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = arr[i]; arr[i] = arr[j]; arr[j] = x; } }

function initialState() {
	let arr = ["A","B","C","D","E","F","G","H","A","B","C","D","E","F","G","H"];
        shuffle(arr);
	
	let tiles1 = [];
        for(var i = 0; i < 16; i++)
                tiles1.push({idx: i, text: "Try Me!", clicked: false, disabled: false, bgcolor: "btn btn-dark"});

       return {
                active_tile:[],
                char_array:arr,
                clicks: 0,
                tiles: tiles1,
                processing: false,
		score: 0,
        };


}
class Demo extends React.Component {
  constructor(props) {
    super(props);
	this.state = initialState();	
 }

youWin() {
	
       for(var i = 0; i < 16; i++)
                if(!this.state.tiles[i].disabled) {break;}
        if(i == 16)
        alert("Congratulations! You win..!!");
}


	
 displayLetter(idx) {
	var letter = this.state.char_array[idx];
	let tileStates = this.state.tiles;
	let tileState = tileStates[idx];
	let actives = this.state.active_tile;
	let total_clicks = this.state.clicks;
	let score = this.state.score;
	console.log('active tile = ' + this.state.active_tile.length);
	console.log('title clicked ' + tileState.clicked);
	console.log('tile.disbaled ' + tileState.disabled);
	console.log('processing ' + this.state.processing);
	if(this.state.active_tile.length < 2 && !tileState.clicked && !tileState.disabled && !this.state.processing){
		console.log("In if : " + actives.length + " " + letter);
	total_clicks = total_clicks + 1;
		tileState.text = letter;
		tileState.clicked = true;
		actives.push(idx);
		tileStates[idx] = tileState;
		this.setState({tiles: tileStates, active_tile: actives, clicks: total_clicks});
	}
	if(actives.length == 2){
		//verify the opened tiles.
		let tile1 = tileStates[actives[0]];
		let tile2 = tileStates[actives[1]];
		if (tile1.text == tile2.text){
			//values match. disable the tiles
			tile1.disabled = true;
			tile2.disabled = true;
			tile1.bgcolor = "btn btn-success";
			tile2.bgcolor = "btn btn-success";
			tileStates[actives[0]] = tile1;
			tileStates[actives[1]] = tile2;
			score = score + 10;
			this.setState({tiles: tileStates, active_tile:[], score: score});
		}
		else if(!this.state.processing){
			this.setState({processing: true}, function(){
			setTimeout(() => {
				tile1.clicked = false;
				tile2.clicked = false;
				tile1.text = "Try Me!";
				tile2.text = "Try Me!";
				tileStates[actives[0]] = tile1;
				tileStates[actives[1]] = tile2;
				actives = [];
				console.log('State update start');
				score = score - 2;
				this.setState({tiles: tileStates, score: score, active_tile: []}, function(){
					this.setState({processing:false});
				});
				console.log('State update ends');
			}, 1000);
			});
		}
	}

	this.youWin();
} //displayLetter ends


render() {
	var displayLetter = this.displayLetter.bind(this);
	 return (
	<div className = "container">
         	<div className="row">
		<div className="col-sm-2"></div>
		<div className="col-2">
                        <Tile idx = {0} root = {this} />
		</div>
		<div className="col-2">
                        <Tile idx = {1} root = {this} />
		</div>
		<div className="col-2">
                        <Tile idx = {2} root = {this} />
		</div>
		<div className="col-2">
                        <Tile idx = {3} root = {this} />
		</div>
		</div>
		<br/>
		<div className="row">
                <div className="col-sm-2"></div>
		<div className="col-2">
                        <Tile idx = {4} root = {this} />
		</div>
		<div className="col-2">
                        <Tile idx = {5} root = {this} />
                </div>
                <div className="col-2">
                        <Tile idx = {6} root = {this} />
                </div>
                <div className="col-2">
                        <Tile idx = {7} root = {this} />
                </div>
		</div>
		<br/>
		<div className="row">
		 <div className="col-sm-2"></div>
                <div className="col-2">
                        <Tile idx = {8} root = {this} />
                </div>
                <div className="col-2">
                        <Tile idx = {9} root = {this} />
                </div>
		<div className="col-2">
                        <Tile idx = {10} root = {this} />
                </div> 
                <div className="col-2">
                        <Tile idx = {11} root = {this} />
                </div>
		</div>
		<br/>
		<div className="row">
		 <div className="col-sm-2"></div>
		<div className="col-2">
                        <Tile idx = {12} root = {this} />
                </div> 
                <div className="col-2">
                        <Tile idx = {13} root = {this} />
                </div>
		<div className="col-2">
                	<Tile idx={14} root={this} />
		</div> 
                <div className="col-2">
                
                        <Tile idx = {15} root = {this} />
		</div>
		</div>
		<br/>
		 <div className="row">
		 <div className="col-sm-2"></div>
		<div className = "col-3"><p><h2><b> Total Score: {this.state.score}</b></h2></p>
		</div>
		 <div className = "col-3"><p><h2><b> Your Clicks: {this.state.clicks}</b></h2></p>
                        </div>

			<div className = "col-4">
			<Button type="button" className="btn btn-lg" onClick = {() => this.setState(initialState())}> Reset </Button>
			</div>
			</div>
                </div>
		);
		}
		}
               					
						


function Tile(params) {
	let root = params.root;
	return (
		<Button type="button" className = {root.state.tiles[params.idx].bgcolor}  onClick = { () => root.displayLetter(params.idx) }>{root.state.tiles[params.idx].text}</Button>


	);
}

