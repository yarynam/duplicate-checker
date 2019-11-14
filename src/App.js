import React, { Component } from 'react';
import Duplicate from './components/Duplicate';
import './App.css';


class App extends Component {
  constructor() {
    super()
    this.state = {
      inputStr: "",
      duplicates: [],
      alphaNum: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkAlphanum = this.checkAlphanum.bind(this);
  }


  handleChange(event) {
    this.setState({
      inputStr: event.target.value
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      duplicates: this.duplicateCheck(this.state.inputStr)
    });
  }


  checkAlphanum(e) {
    const re = /^[a-z0-9]+$/i;
    const alphaNumTest = e.clipboardData ? re.test(e.clipboardData.getData('Text')) : re.test(e.key);

    if (!alphaNumTest) {
      e.preventDefault();
    }

    this.setState({
      alphaNum: !alphaNumTest
    });
  }


  duplicateCheck(str) {
    const uniqueCombos = this.getCombinations(str); // gets all unique combinations of string
    const multiCharCombos = uniqueCombos.filter(d => d.length > 1); // this step is needed to check for the longest duplicates
    const singleCharCombos = uniqueCombos.filter(d => d.length === 1);

    const multiCharMatch = this.getDuplicates(multiCharCombos, str);
    const singleCharMatch = this.getDuplicates(singleCharCombos, str);

    return [...multiCharMatch, ...singleCharMatch];
  }


  getCombinations(str) {
    const strings = [];

    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j < str.length + 1; j++) {
        strings.push(str.slice(i, j));
      }
    }

    const uniqueStrings = [...new Set(strings)];
    uniqueStrings.sort((a, b) => b.length - a.length);
    return uniqueStrings;
  }

  getDuplicates(arr, str) {
    let string = str;
    const result = [];

    arr.forEach(el => {
      if (string.length > el.length) {
        var regex = new RegExp(el, 'g');
        const match = string.match(regex);

        if (match && match.length > 1) {
          result.push({
            dup: match[0],
            count: match.length
          });
          string = string.replace(regex, ""); // we need to modify string to prevent nested duplicates like "bbb" inside "bbbaaa" for "bbbaacbbbaa" string
        }
      }
    });

    return result
  }


  render() {
    const duplicates = this.state.duplicates.map(d => <Duplicate key={d.dup} dup={d.dup} count={d.count} />)
    return (
      <div className='app-wrapper'>
        <h1>Duplicate Checker</h1>
        <p className='warning' style={{ opacity: !this.state.alphaNum && "0" }}>Only alpha numeric characters are allowed</p>

        <form onSubmit={this.handleSubmit}>
          <input type="text"
            value={this.state.inputStr}
            placeholder="Type or Paste a String"
            onKeyPress={e => this.checkAlphanum(e)}
            onPaste={e => this.checkAlphanum(e)}
            onChange={this.handleChange} />
          <button>Check</button>
        </form>

        <div className="duplicate-wrapper">{duplicates}</div>
      </div >
    )
  }
}
export default App;


