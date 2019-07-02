import React from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import './index.css'

const Square = ({ value, onClick, id}) => {
    return (
        <button
            id={id}
            type="button"
            onClick={onClick}
            className="btn btn-default square"
        >
            {value}
        </button>
    )
}

const Board = (props) => {

    const matrix = props.squares.map((square, i) => {
        return (
            <Square
                id={i}
                key={i}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        )
    })

    return (
        <div className="btn-group btn-matrix">
            {matrix}
        </div>
    )
}

class Game extends React.Component {

    state = {
        history: [{
            squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        this.setBackground()
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    setBackground() {

        let squares = document.getElementsByClassName('square')

        for (let element of squares) {
            if (this.state.xIsNext) {
                element.style.background = '#424242'
            }
            else {
                element.style.background = '#37474f'
            }
        }
    }

    jumpTo(i) {
        this.setState({
            stepNumber: i,
            history: this.state.history.filter((squares, index) =>
                index < i),
            xIsNext: this.state.stepNumber % 2 === 0 ? true : false
        })
    }


    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const movesX = history.map((move, i) => {
            const desc = 'Undo till Move ' + i.toString()
            if (i % 2 !== 0)
                return (
                    <li key={i}>
                        <Button onClick={() => this.jumpTo(i)} > {desc}</ Button>
                    </li>
                )
        })

        const movesO = history.map((move, i) => {
            const desc = 'Undo till Move ' + i.toString()
            if (i !== 0 && i % 2 === 0)
                return (
                    <li key={i}>
                        <Button onClick={() => this.jumpTo(i)} > {desc}</ Button>
                    </li>
                )
        })

        let status;
        if (winner === 'X' || winner === 'O') {
            status = 'Winner: ' + winner;
        }
        else if (winner === 'tie') {
            status = 'Draw'
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <Container>
                <Row>

                    <Col xs={{ span: 12, order: 2 }} sm={{ span: 3, order: 1 }}
                        className='text-center'
                    >
                        <h4 className='mt-3'>Prev X Moves</h4>
                        <ul className='list-unstyled'>{movesX}</ul>
                    </Col>

                    <Col xs={{ span: 12, order: 1 }} sm={{ span: 6, order: 2 }} className='text-center'>
                        <h3>{status}</h3>
                        <Board
                            squares={current.squares}
                            onClick={(i) => { this.handleClick(i) }}
                        />
                    </Col>

                    <Col xs={{ span: 12, order: 3 }} sm={{ span: 3, order: 3 }}
                        className='text-center'
                    >
                        <h4 className='mt-3'>Prev O Moves</h4>
                        <ul className='list-unstyled'>{movesO}</ul>
                    </Col>
                </Row>
            </Container>
        )
    }
}

function highlightWinner(a, b, c) {

    let squares = document.getElementsByClassName('square')
    for(let square of squares) {
        if(square.id == a || square.id == b || square.id == c) {
            square.style.border = '1px solid gold'
        }
    }
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            highlightWinner(a, b, c)
            return squares[a];
        }
    }

    let tie = true;

    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            tie = false;
            break;
        }
    }

    if (tie === true)
        return 'tie'
    else
        return null;
}

// ============================================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)
