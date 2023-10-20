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
export default function Board() {
  
  const [xIsNext, setXIsNext] = useState(true);
  //9つのマス目に対応する9個のnullを持つ配列を与える
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  // setSquareを使ってstateが更新されると、Boardコンポーネントは再レンダリングされる。
  // このとき、Squareコンポーネントも再レンダリングされる。つまり、レンダリングと同時に発火してしまうので無限ループに陥る。
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() =>handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() =>handleClick(1)}  />
        <Square value={squares[2]} onSquareClick={() =>handleClick(2)}  />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() =>handleClick(3)}  />
        <Square value={squares[4]} onSquareClick={() =>handleClick(4)}  />
        <Square value={squares[5]} onSquareClick={() =>handleClick(5)}  />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() =>handleClick(6)}  />
        <Square value={squares[7]} onSquareClick={() =>handleClick(7)}  />
        <Square value={squares[8]} onSquareClick={() =>handleClick(8)}  />
      </div>
    </>
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
      return squares[a];
    }
  }
  return null;
}
