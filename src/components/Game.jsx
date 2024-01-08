import { useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/MyContext";
import { SlActionUndo } from "react-icons/sl";
import "./Game.css";

const connections = {
  "0-0": ["0-1", "0-7"],
  "0-1": ["0-0", "0-2", "1-1"],
  "0-2": ["0-1", "0-3"],
  "0-3": ["0-2", "0-4", "1-3"],
  "0-4": ["0-3", "0-5"],
  "0-5": ["0-4", "0-6", "1-5"],
  "0-6": ["0-5", "0-7"],
  "0-7": ["0-6", "0-0", "1-7"],

  "1-0": ["1-1", "1-7"],
  "1-1": ["1-2", "1-0", "0-1", "2-1"],
  "1-2": ["1-3", "1-1"],
  "1-3": ["1-4", "1-2", "0-3", "2-3"],
  "1-4": ["1-5", "1-3"],
  "1-5": ["1-6", "1-4", "0-5", "2-5"],
  "1-6": ["1-7", "1-5"],
  "1-7": ["1-0", "1-6", "0-7", "2-7"],

  "2-0": ["2-1", "2-7"],
  "2-1": ["2-2", "2-0", "1-1"],
  "2-2": ["2-3", "2-1"],
  "2-3": ["2-4", "2-2", "1-3"],
  "2-4": ["2-5", "2-3"],
  "2-5": ["2-6", "2-4", "1-5"],
  "2-6": ["2-7", "2-5"],
  "2-7": ["2-0", "2-6", "1-7"],
};

function areConnected(square1, index1, square2, index2) {
  const key1 = `${square1}-${index1}`;
  const key2 = `${square2}-${index2}`;
  console.log("Key1: " + key1);
  console.log("Key2: " + key2);

  return connections[key1]?.includes(key2);
}

function Board({ padding, onCircleClick }) {
  const startPadding = padding;
  const endPadding = 100 - startPadding;
  const square = padding / 10 - 1;
  return (
    <>
      <line
        className="board-line"
        x1={startPadding}
        y1={startPadding}
        x2={endPadding}
        y2={startPadding}
      />
      <line
        className="board-line"
        x1={endPadding}
        y1={startPadding}
        x2={endPadding}
        y2={endPadding}
      />
      <line
        className="board-line"
        x1={endPadding}
        y1={endPadding}
        x2={startPadding}
        y2={endPadding}
      />
      <line
        className="board-line"
        x1={startPadding}
        y1={endPadding}
        x2={startPadding}
        y2={startPadding}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 0)}
        cx={startPadding}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 1)}
        cx={50}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 2)}
        cx={endPadding}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 3)}
        cx={endPadding}
        cy={50}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 4)}
        cx={endPadding}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 5)}
        cx={50}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 6)}
        cx={startPadding}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 7)}
        cx={startPadding}
        cy={50}
        r={1}
      />
    </>
  );
}

function Piece({ square, index, color, selected, onPieceClick }) {
  let x = 0;
  let y = 0;
  if (index >= 0 && index < 3) {
    y = square * 10 + 10;
    if (index === 0) {
      x = square * 10 + 10;
    } else if (index === 1) {
      x = 50;
    } else if (index === 2) {
      x = 100 - (square * 10 + 10);
    }
  } else if (index >= 4 && index < 7) {
    y = 100 - (square * 10 + 10);
    if (index === 4) {
      x = 100 - (square * 10 + 10);
    } else if (index === 5) {
      x = 50;
    } else if (index === 6) {
      x = square * 10 + 10;
    }
  } else if (index === 3) {
    y = 50;
    x = 100 - (square * 10 + 10);
  } else if (index === 7) {
    y = 50;
    x = square * 10 + 10;
  }
  return (
    <circle
      cx={x}
      cy={y}
      r={3}
      fill={color}
      stroke={(selected && "green") || "transparent"}
      strokeWidth={0.5}
      onClick={() => onPieceClick(square, index, color)}
    />
  );
}

export default function Game() {
  const { seeButtonsFunction } = useContext(MyContext);

  const ButtonClick = () => {
    seeButtonsFunction();
  };

  const [pieces, setPieces] = useState([]);
  const [whiteRemaining, setWhiteRemaining] = useState(9);
  const [blackRemaining, setBlackRemaining] = useState(9);
  const [jumpMode, setJumpMode] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [color, setColor] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [removePieceMode, setRemovePieceMode] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickedSquare, setClickedSquare] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const whitePiecesCount = pieces.filter((s) => s.color === "white").length;
  const blackPiecesCount = pieces.filter((s) => s.color === "black").length;

  function toggleColor() {
    setColor((c) => (c === "white" ? "black" : "white"));
  }

  useEffect(() => {
    if (clicked && checkLine(clickedSquare, clickedIndex)) {
      console.log("Clicked: " + clicked);
      setRemovePieceMode(true); //palenje moda za uklanjanje
      setClicked(false); //klik na crne kruzice na false
    } else if (clicked) {
      toggleColor();
    }
  }, [pieces, clicked]);

  function checkLine(square, index) {
    const nextIndex = (index + 1) % 8;
    if (index % 2 !== 0) {
      // centranli
      const prev = pieces.find(
        (s) => s.square === square && s.index === index - 1 //trazim isti kvadrat i index manji za 1
      );
      const next = pieces.find(
        (s) => s.square === square && s.index === nextIndex //trazim isti kvadrat i index manji za 1
      );
      //=========================================npr ako imam na indexu 0 i 2 figuru i ako stavim figuru na 1-om indexu, napravicu liniju
      if (prev && next && prev.color === color && next.color === color) {
        return true; //nadjena linija
      }

      let newLine = true;
      for (let i = 0; i < 3; i++) {
        const st = pieces.find((s) => s.square === i && s.index === index);
        if (!st || st.color !== color) {
          newLine = false;
          break;
        }
      }
      if (newLine) {
        return true;
      }
    } else {
      const prevIndex = index - 1 >= 0 ? index - 1 : 7;
      const prevPrevIndex = index - 2 >= 0 ? index - 2 : 6;
      const nextIndex = index + 1;
      const nextNextIndex = (index + 2) % 8;

      const prev = pieces.find(
        (s) => s.square === square && s.index === prevIndex
      );
      const prevPrev = pieces.find(
        (s) => s.square === square && s.index === prevPrevIndex
      );

      // TODO: check what happens if two lines are created

      if (
        prev &&
        prevPrev &&
        prev.color === color &&
        prevPrev.color === color
      ) {
        return true;
      }

      const next = pieces.find(
        (s) => s.square === square && s.index === nextIndex
      );
      const nextNext = pieces.find(
        (s) => s.square === square && s.index === nextNextIndex
      );

      if (
        next &&
        nextNext &&
        next.color === color &&
        nextNext.color === color
      ) {
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    //KO JE POBEDIO!!
    if (whiteRemaining === 0 && blackRemaining === 0) {
      if (whitePiecesCount === 2 || blackPiecesCount === 2) {
        const winner = whitePiecesCount === 2 ? "black" : "white";
        alert(
          `Game Over! ${winner[0].toUpperCase() + winner.slice(1)} has won.`
        );
        setIsGameActive(false);
        // Ovde dodajte logiku za onemogućavanje daljih poteza u igri
      }
    }
  }, [
    pieces,
    whiteRemaining,
    blackRemaining,
    whitePiecesCount,
    blackPiecesCount,
  ]);

  function onCircleClick(square, index) {
    if (!isGameActive) return;
    console.log("circle clicked", square, index);
    if (removePieceMode) return; //ako je upaljen tj. true => vrati, znaci da ne mogu da postavim novu figuru

    setClickedSquare(square);
    setClickedIndex(index);

    let clicked = false;
    if (
      (color === "white" && whiteRemaining > 0) ||
      (color === "black" && blackRemaining > 0)
    ) {
      // putting new pieces
      setPieces((s) => [...s, { square, index, color }]); //postavljanje figure
      if (color === "white") {
        setWhiteRemaining(whiteRemaining - 1);
      } else if (color === "black") {
        setBlackRemaining(blackRemaining - 1);
      }
      clicked = true;
    } else {
      // moving pieces
      if (
        selectedPiece && //ako je selektovana figura i ako je jump mode ukljucen ili je connected onda ....
        (jumpMode ||
          areConnected(
            selectedPiece.square,
            selectedPiece.index,
            square,
            index
          ))
      ) {
        setJumpMode(false);
        setPieces(
          pieces.map((piece) =>
            piece.square === selectedPiece.square &&
            piece.index === selectedPiece.index &&
            piece.color === selectedPiece.color
              ? { square, index, color: selectedPiece.color }
              : piece
          )
        );
        clicked = true;
      }
    }

    setClicked(clicked);
  }

  function isPiecePartOfLine(clickedPiece, pieces) {
    const { square, index, color } = clickedPiece;
    const horizontalLineIndices = [
      [0, 1, 2],
      [2, 3, 4],
      [4, 5, 6],
      [6, 7, 0],
    ];
    const isHorizontalLine = horizontalLineIndices.some(
      (indices) =>
        indices.includes(index) &&
        indices.every((i) =>
          pieces.some(
            (p) => p.square === square && p.index === i % 8 && p.color === color
          )
        )
    );
    if (isHorizontalLine) {
      return true;
    }

    // indeksi 1, 3, 5, i 7 su vertikalne linije
    if (index % 2 === 1) {
      const isVerticalLine =
        pieces.filter((p) => p.index === index && p.color === color).length ===
        3;
      if (isVerticalLine) {
        return true;
      }
    }
    return false;
  }

  function onPieceClick(square, index, pieceColor) {
    if (!isGameActive) return;
    if (removePieceMode) {
      //ako je true onda moram da uklonim figuru
      if (color === pieceColor) return; //ako je bela == bela return => ako sam beli nmg belu da uklonim

      const clickedPiece = { square, index, color: pieceColor };
      const pieceIsInLine = isPiecePartOfLine(clickedPiece, pieces);
      const otherPiecesNotInLine = pieces.filter(
        (p) => !isPiecePartOfLine(p, pieces)
      );

      console.log("Piece in line:? " + pieceIsInLine);

      if (pieceIsInLine && otherPiecesNotInLine.length > 0) {
        return; // Ne dozvoljava uklanjanje figure ako je ona deo linije i postoje druge protivničke figure koje nisu u linijama
      }

      setPieces(
        pieces.filter((p) => !(p.square === square && p.index === index))
      );

      setRemovePieceMode(false);

      // 4 because of setStones taking effect only after next render
      if (
        whiteRemaining === 0 &&
        blackRemaining === 0 &&
        ((color === "white" && blackPiecesCount === 4) ||
          (color === "black" && whitePiecesCount === 4))
      ) {
        setJumpMode(true); //da moze da skace figura ako ih je ostalo 3
      }

      toggleColor();
      return;
    }
    if (color !== pieceColor) return; //bela razlicito od crna i obrnuto
    if (
      (pieceColor === "white" && whiteRemaining > 0) ||
      (pieceColor === "black" && blackRemaining > 0)
    )
      //================================================ => ako ima remaining nemoguce je pomeranje
      return;
    if (
      //selekcija figure, ako je selektamo ide u else ako je opet ide u if
      selectedPiece &&
      selectedPiece.square === square &&
      selectedPiece.index === index &&
      selectedPiece.color === pieceColor
    ) {
      setSelectedPiece(null);
    } else {
      const newPiece = pieces.find(
        (s) =>
          s.square === square && s.index === index && s.color === pieceColor
      );
      console.log("New Piece: ", newPiece);
      setSelectedPiece(newPiece);
    }
  }

  function generateConnectedLines() {
    const lines = [];

    for (let square = 0; square < 3; square++) {
      indexLoop: for (let startIndex = 0; startIndex < 4; startIndex++) {
        const start = startIndex * 2;
        const end = start + 2;
        const colors = [];
        for (let index = start; index <= end; index++) {
          const piece = pieces.find(
            (s) => s.square === square && s.index === index % 8
          );
          if (!piece) continue indexLoop;
          colors.push(piece.color);
        }
        if (colors.length !== 3) continue; // mozda ne treba
        let lineColor;
        if (colors.every((c) => c === "white")) {
          lineColor = "red";
        } else if (colors.every((c) => c === "black")) {
          lineColor = "green";
        } else {
          continue;
        }

        if (startIndex === 0 || startIndex === 2) {
          lines.push(
            <line
              key={`${square}-${startIndex}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              data-start-index={startIndex}
              x1={square * 10 + 10}
              y1={startIndex === 2 ? 90 - square * 10 : 10 + square * 10}
              x2={90 - square * 10}
              y2={startIndex === 2 ? 90 - square * 10 : 10 + square * 10}
            />
          );
        } else {
          lines.push(
            <line
              key={`${square}-${startIndex}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              data-start-index={startIndex}
              x1={startIndex === 1 ? 90 - square * 10 : 10 + square * 10}
              y1={square * 10 + 10}
              x2={startIndex === 1 ? 90 - square * 10 : 10 + square * 10}
              y2={90 - square * 10}
            />
          );
        }
      }
    }

    outerLoop: for (let index = 1; index < 8; index += 2) {
      const colors = [];
      for (let square = 0; square < 3; square++) {
        const piece = pieces.find(
          (s) => s.square === square && s.index === index
        );
        if (!piece) continue outerLoop;
        colors.push(piece.color);
      }

      if (colors.length !== 3) continue;
      let lineColor;
      if (colors.every((c) => c === "white")) {
        lineColor = "red";
      } else if (colors.every((c) => c === "black")) {
        lineColor = "green";
      } else {
        continue;
      }

      switch (index) {
        case 1:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={50}
              y1={10}
              x2={50}
              y2={30}
            />
          );
          break;
        case 3:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={70}
              y1={50}
              x2={90}
              y2={50}
            />
          );
          break;
        case 5:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={50}
              y1={70}
              x2={50}
              y2={90}
            />
          );
          break;
        case 7:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={10}
              y1={50}
              x2={30}
              y2={50}
            />
          );
          break;
      }
    }

    return lines;
  }

  const connectedLines = useMemo(generateConnectedLines, [pieces]);

  return (
    <>
      <div id="game-container">
        <div className="wr">
          <div className="white"></div>
          <h3 style={{ textAlign: "center", marginTop: 0 }}>
            {whiteRemaining}
          </h3>
        </div>
        <svg viewBox="0 0 100 100">
          <line className="board-line" x1={50} y1={10} x2={50} y2={30} />
          <line className="board-line" x1={70} y1={50} x2={90} y2={50} />
          <line className="board-line" x1={50} y1={70} x2={50} y2={90} />
          <line className="board-line" x1={10} y1={50} x2={30} y2={50} />
          <Board padding={10} onCircleClick={onCircleClick} />
          <Board padding={20} onCircleClick={onCircleClick} />
          <Board padding={30} onCircleClick={onCircleClick} />
          {...connectedLines}
          {pieces.map(({ square, index, color }) => (
            <Piece
              key={`${square}-${index}-${color}`}
              square={square}
              index={index}
              color={color}
              selected={
                selectedPiece &&
                selectedPiece.square === square &&
                selectedPiece.index === index &&
                selectedPiece.color === color
              }
              onPieceClick={onPieceClick}
            />
          ))}
        </svg>
        <div>
          <div className="black"></div>
          <h3 style={{ textAlign: "center", marginTop: 0 }}>
            {blackRemaining}
          </h3>
        </div>
        <Link to="/">
          <button className="homeScreen" onClick={ButtonClick}>
            <SlActionUndo className="qw" />
            Home screen
          </button>
        </Link>
      </div>
      <div className="turn">
        <h3>TURN: {color}</h3>
      </div>
    </>
  );
}
