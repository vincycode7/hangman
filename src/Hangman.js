import React, { Component } from "react";
import "./Hangman.css";
import { randomWord } from "./words";
import img0 from "./images/0.jpg";
import img1 from "./images/1.jpg";
import img2 from "./images/2.jpg";
import img3 from "./images/3.jpg";
import img4 from "./images/4.jpg";
import img5 from "./images/5.jpg";
import img6 from "./images/6.jpg";

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6],
    maxWrongGuess: 6,
  };

  constructor(props) {
    super(props);
    this.state = {
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord(),
      youWin: false,
      youLose: false,
    };
    this.handleGuess = this.handleGuess.bind(this);
    this.guessedWord = this.guessedWord.bind(this);
    this.makeWord = this.makeWord.bind(this);
    this.setYouWin = this.setYouWin.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  resetGame() {
    this.setState({
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord(),
      youWin: false,
      youLose: false,
    });
  }

  makeWord() {
    return this.state.youLose
      ? this.state.answer.split("")
      : this.state.answer
          .split("")
          .map((ltr) => (this.state.guessed.has(ltr) ? ltr : "_"));
  }

  guessedWord() {
    return this.makeWord();
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
  setYouWin() {
    var word = this.makeWord();
    this.setState((state, props) => {
      return {
        youWin: word.join("")===state.answer ? true : false,
        youLose: state.nWrong >= props.maxWrongGuess ? true : false,
      };
    });
  }

  handleGuess(evt) {
    let ltr = evt.target.value;

    this.setState((state, props) => {
      return {
        guessed: state.guessed.add(ltr),
        nWrong:
          state.nWrong +
          (state.answer.includes(ltr) || state.nWrong >= props.maxWrongGuess
            ? 0
            : 1),
      };
    }, this.setYouWin);
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr) => (
      <button
        value={ltr}
        onClick={this.handleGuess}
        disabled={
          this.state.guessed.has(ltr) ||
          this.state.nWrong >= this.props.maxWrongGuess ||
          this.state.youWin === true
        }
        style={{
          display: `${
            this.state.youWin || this.state.youLose ? "none" : "inline"
          }`,
        }}
        key={ltr}
      >
        {ltr}
      </button>
    ));
  }

  /** render: render game */
  render() {
    const altText = `Wrong-Guesses: ${this.state.nWrong} / ${this.props.maxWrong}`;
    return (
      <div className="Hangman">
        <h1>Hangman</h1>
        <img
          src={this.props.images[this.state.nWrong]}
          style={{ width: "250px", height: "300px" }}
          alt={altText}
        />
        <p className="Hangman-wrngGuesses">Wrong-Guesses: {altText}</p>
        <p style={{ display: `${this.state.youLose ? "block" : "none"}` }}>
          you Lose answer is
        </p>
        <p className="Hangman-word">{this.guessedWord()}</p>
        <p style={{ display: `${this.state.youWin ? "block" : "none"}` }}>
          you Win
        </p>

        <p className="Hangman-btns">{this.generateButtons()}</p>
        <button
          id="Hangman-resetBtn"
          onClick={this.resetGame}
          // style={{
          //   display: `${
          //     this.state.youWin || this.state.youLose ? "inline" : "none"
          //   }`,
          // }}
        >
          Reset Game?
        </button>
      </div>
    );
  }
}

export default Hangman;
