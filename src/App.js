import {useState} from "react";

function Square({value, onSquareClick}){
  // useStateを使うと、初期値を入れる
  // const [value, setValue] = useState(null);

  // clickされたことを記憶するためにstateを使う。
  return (
    <button 
    className="square"
    onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// propsで渡している変数名で渡す。
function Board({xIsNext, squares, onPlay}) {

  // slice() 配列メソッドを使って squares 配列のコピー (nextSquares) を作成
  function handleClick(i){
    // 早期リターン ⇒ もし既に値が入っているなら何もしない or 勝者が決まったら何もしない
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X"; 
    }else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  
  const winner = calculateWinner(squares);
  let status;
  
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  // squaresの配列にnullが無かったら、statusをDrawにする
  if(!squares.includes(null) && !winner){
    status = "Draw";
  }

  const box = [];

  for (let i=0;i<3;i++){
    box.push(<div className="board-row"></div>);
    for(let j=0; j<3 ;j++){
      box.push(<Square key={i * 3 + j} value={squares[i * 3 + j]} onSquareClick={() => handleClick(i*3  +j)} className="square"/>)
    }
  }
  
  // setSquareを使ってstateが更新されると、Boardコンポーネントは再レンダリングされる。
  // このとき、Squareコンポーネントも再レンダリングされる。つまり、レンダリングと同時に発火してしまうので無限ループに陥る。
  return (
    <>
      <div className="status">{status}</div>
      {box}
    </> 
  );
}

export default function Game() {
  // 各マス目が入力された状態を保持する＝9つの配列を作る
  // [Array(9).fill(null)] は要素数が 1 の配列であり、その唯一の要素が 9 つの null が入った配列となっていることに注意してください。
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // ゲーム内容の更新
  function handlePlay(nextSquares) {
    // 履歴のうち着手時点までの部分のみが保持
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // 末尾の最新を参照
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
// 真偽値に変換されるときにtrueとなります。したがって、“X” && true && trueはtrue
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // ex) [0,1,2] [X,X,X,O,O,O,O,O,O]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Squareコンポーネントのkeyとindexが一致するものに対してstyle.bakcgroundColor =" yellow"を設定
      document.getElementsByClassName("square")[a].style.backgroundColor = "yellow";
      document.getElementsByClassName("square")[b].style.backgroundColor = "yellow";
      document.getElementsByClassName("square")[c].style.backgroundColor = "yellow";
      return squares[a];
    }
  }
  return null;
}
