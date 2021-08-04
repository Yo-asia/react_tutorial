import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
class Square extends React.Component {
    render() {
      return (
        <button 
          className="square" 
          onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button> 
      );
    }
  }
  */
  function Square(props) {
    return (
      <button 
        className={ props.isPartOfWinner ? "winnerSquare" : "square"}
        onClick = {props.onClick}
      >
        {props.value}
      </button> 
    )
  }

  
  
  class Board extends React.Component {
    /* moved to Game
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
      }
    }
    
    handleClick(i) {
      const squares = this.props.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.props.xIsNext ? 'X':'O';
      this.setState({
        squares: squares,
        xIsNext: !this.props.xIsNext,
      })
    }
    */

    renderSquare(i) {
      return <Square 
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        isPartOfWinner = {this.props.winner.includes(i)}
      />;
    }
  
    render() {  
      let stageOne = [];
      let stageTwo = [];
      for (let j=0; j<3; j++ ) {
        for (let k=0; k<3; k++ ){
          stageOne.push(this.renderSquare(3*j+k));
        };
        stageTwo.push(<div className="board-row">{stageOne}</div>);
        stageOne = [];
      };
      return (
        <div>
          {stageTwo}
        </div>
      );
    }
  }
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          row: null,
          column : null,
        }],
        stepNumber:0,
        xIsNext: true,
        clickedStep: null,
        winner: [],
        isReversed: false,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (this.state.winner.length>0 || squares[i]){
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          row: whichRow(i),
          column: whichCol(i),
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        clickedStep: null,
      });

      const winner = calculateWinner(squares);
        this.setState({winner:winner});
    }

    handleReverse (){
      this.setState ({
        isReversed: !this.state.isReversed,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        clickedStep: step,
        winner: calculateWinner(this.state.history[step]),
      });
    }

    restart() {
      this.setState({
        history: [{
          squares: Array(9).fill(null),
          row: null,
          column : null,
        }],
        stepNumber:0,
        xIsNext: true,
        clickedStep: null,
        winner: [],
        isReversed: false,
      });
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];

      let moves = history.map ((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' row ' + step.row + ' column ' + step.column:
          'Go to Start';
          return ( 
            <li key={move}>
              <button onClick={() => this.jumpTo(move)} className={move === this.state.clickedStep ? "active" : ''}>{desc}</button>
            </li>
          );
      });

      let status;
      let gameFinished = false;
      if (this.state.winner.length>0) {
        status = this.state.winner[0] + ' wins!';
        gameFinished = true;
      } else if (current.squares.every(val=> val)){
        status = 'The game has ended, there is no winner :('    
        gameFinished = true;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }
      return (

        <div className="game">
          <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner = {this.state.winner}
          />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => {this.restart();}} hidden={!gameFinished}> Restart </button>
            <button onClick={() => this.handleReverse()}>'Reverse the list'</button>
            <ul>{this.state.isReversed ? moves.reverse() : moves }</ul>

          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++){
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], a, b, c];
      }
    }
    return [];
  }

  function whichRow(i) {
    /* not nice
    const row1 = [0,1,2];
    const row2 = [3,4,5];

    let row = (rowA.includes(i) ? '1' : (rowB.includes(i) ? '2' : '3'));*/


    let rowI = parseInt(i/3);
    let row = ( rowI === 0 ? '1' : (rowI === 1 ? '2' : '3'));

    return row;
  }

  function whichCol(i) {
    /* not nice
    const col1 = [0,3,6];
    const col2 = [1,4,7];

    let col = (col1.includes(i) ? '1' : (col2.includes(i) ? '2' : '3'));*/

    

    let col = (i%3 === 0 ? '1' : (i%3 === 1 ? '2' : '3'));

    return col;
  }
  