import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root,channel) {
  ReactDOM.render(<Demo channel={channel}/>, root);
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
	  this.state = {
             active_tile:[],
             char_array:[],
             clicks: 0,
             tiles: [],
             processing: false,
             score: 0,
             matched: false
     }
    this.channel.join()
                .receive("ok", this.gotState.bind(this))
                .receive("error", resp => {console.log("Unable to join", resp)});
 }

 gotState(view){
   console.log("NEw State ", view)
   if(view.matched != undefined && !view.matched)
   {
     setTimeout(() => {
       this.setState(view.game, function(){
         if(this.state.active_tile.length == 2 ){
           setTimeout(() => {
           this.channel.push("checktile",{})
                       .receive("ok", this.gotState.bind(this));
            }, 1000);
          }
          this.youWin();
       });
     }, 1000);
   }
   else{
     this.setState(view.game, function(){
       if(this.state.active_tile.length == 2 ){
         this.channel.push("checktile",{})
                     .receive("ok", this.gotState.bind(this));
        }
        this.youWin();
     });
  }
 }

youWin() {

       for(var i = 0; i < 16; i++)
                if(!this.state.tiles[i].disabled) {break;}
        if(i == 16)
        alert("Congratulations! You win..!!");
}



 displayLetter(ix) {
   if (this.state.active_tile.length < 2 && !this.state.tiles[ix].clicked){
     this.channel.push("validate",{idx: ix})
                  .receive("ok", this.gotState.bind(this));
  }
   else{
     console.log("calling open tile")
     this.channel.push("checktile",{idx: ix})
                 .receive("ok", this.gotState.bind(this));
   }
} //displayLetter ends


render() {
	var displayLetter = this.displayLetter.bind(this);
  var rows = [];
  {[...Array(16)].map((x, i) =>
     rows.push(<div class="col-3"><Tile idx = {i} root = {this} /></div>)
   )}
   return (<div class="container">
    <div class="row">
    {rows}
    </div>
    <br/>
    <div className="row">
  		 <div className="col-sm-2"></div>
  		<div className = "col-3"><p><h2><b> Total Score: {this.state.score}</b></h2></p>
  		</div>
  		 <div className = "col-3"><p><h2><b> Your Clicks: {this.state.clicks}</b></h2></p>
                          </div>

  			<div className = "col-4">
  			<Button type="button" className="btn btn-lg" onClick = {() => {
          this.channel.push("reset",{})
                      .receive("ok", this.gotState.bind(this))
                      .receive("error", resp => {console.log("Unable to reset", resp)});
        }
        }> Reset </Button>
  			</div>
  			</div>
   </div>);
		}
		}




function Tile(params) {
	let root = params.root;
  let styleProps = {
    marginTop: '20px',
  };
  if(root.state.tiles.length>0)
	return (
		<Button type="button" className = {root.state.tiles[params.idx].bgcolor}  onClick = { () => root.displayLetter(params.idx) } style={styleProps} >{root.state.tiles[params.idx].text}</Button>


	);
  else {
    return (<p> Loading</p>);
  }
}
