import * as React from 'react';
import './App.scss';
import { Board } from './page/Board';
import SudokuGenerator from './SudokuGenerator';
import Sudo from "./Sudokus";

export interface IState {
  list: number[][],             // sudoke数组
  record: number[][],           // 步骤记录
  origin: Set<string>,          // 原始棋盘
  chosenCell: [number, number], // 当前选中单元格
  disabledNums: number[]
}
class App extends React.Component<{}, IState> {

  UNSAFE_componentWillMount() {
    // console.log('UNSAFE_componentWillMount');
    this.startNewGame();
  }

  /**
   * 新开一局游戏
   *
   */
  startNewGame = () => {
    const grid = Sudo.easy[Math.floor(Math.random() * Sudo.easy.length)];
    const ll = new SudokuGenerator(grid).generate();
    const _list = ll[0];
    const origin: Set<string> = new Set()
    _list.forEach((rows, i) => {
      rows.forEach((n, j) => {
        n && origin.add(i + '' + j);
      })
    });
    this.setState({
      list: _list,
      record: [],
      origin: origin,
    })
  }

  /**
   * 重置游戏
   *
   */
  restartGame = () => {
    this.state.record.forEach(item => { this.state.list[item[0]][item[1]] = 0; });
    this.setState({
      'list': this.state.list,
      'record': [],
    });
  }

  /**
   * 回退
   *
   */
  back = () => {
    if (this.state.record.length) {
      let lastRecord: number[] = this.state.record[this.state.record.length - 1];
      this.state.list[lastRecord[0]][lastRecord[1]] = 0;
      this.state.record.pop();
      if (this.state.record.length) {
        let preRecord: number[] = this.state.record[this.state.record.length - 1];
        this.state.list[preRecord[0]][preRecord[1]] = preRecord[2];
      }
      this.setState({
        'list': this.state.list,
      })
    }
  }

  /**
   * 选中棋盘cell
   *
   * @param {number} row
   * @param {number} col
   */
  handleCellClick = (row: number, col: number) => {
    // console.log('App-handleCellClick', row, col);
    let disabledNums = this.checkDisabledNums(row, col);
    this.setState({
      chosenCell: [row, col],
      disabledNums: disabledNums
    });
  }

  /**
   * 清除cell
   *
   */
  clearCell = () => {
    let _list: any[][] = this.state.list.slice();
    let _cell = this.state.chosenCell;
    if (_cell && !this.isOrigin(_cell[0], _cell[1])) {
      _list[_cell[0]][_cell[1]] = 0;
      this.setState({ list: _list });
    }
  }

  /**
   * 判断是否是初始单元格
   *
   * @param {number} i
   * @param {number} j
   * @returns {boolean}
   */
  isOrigin(i: number, j: number): boolean {
    return this.state.origin.has('' + i + j);
  }

  /**
   * 禁用/可填入数字判断
   *
   * @param {number} i
   * @param {number} j
   * @returns {number[]}
   * @memberof App
   */
  checkDisabledNums(i: number, j: number): number[] {
    let values = this.state.list
    let _enable = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9])
    let _disabled = new Set<number>();
    for (let k = 0; k <= 8; k++) {
      if (values[i][k] && k !== j) {
        _enable.delete(values[i][k]);
        _disabled.add(values[i][k]);
      }
    }
    for (let k = 0; k <= 8; k++) {
      if (values[k][j] && k !== i) {
        _enable.delete(values[k][j]);
        _disabled.add(values[k][j]);
      }
    }
    let bi = Math.floor(i / 3) * 3
      , bj = Math.floor(j / 3) * 3
    for (let m = bi; m < bi + 3; m++) {
      for (let n = bj; n < bj + 3; n++) {
        if (m === i && n === j) { continue }
        if (values[m][n]) {
          _enable.delete(values[m][n]);
          _disabled.add(values[m][n]);
        }
      }
    }
    // console.log('禁用判断', _enable, _disabled);
    return Array.from(_disabled);
  }


  /**
   * 点选1-9数字
   *
   * @param {any} num
   */
  handleNumsClick = (num: any) => {
    let list: any[][] = this.state.list.slice();
    let _cell = this.state.chosenCell;
    if (_cell && !this.isOrigin(_cell[0], _cell[1])) {
      list[_cell[0]][_cell[1]] = num;
      this.setState({ 'list': list });
      this.state.record.push([_cell[0], _cell[1], num]);
    }
  }

  public render() {
    let disabledNums = new Set(this.state.disabledNums || []);

    const choices = [...'123456789'].map(
      i => {
        const _i = Number(i);
        let className = 'choice';
        let isDisabled: boolean = false;
        if (disabledNums.has(_i)) {
          className += ' disabled';
          isDisabled = true
        }
        return <button key={_i} className={className} disabled={isDisabled} value={_i} onClick={() => this.handleNumsClick(_i)}>{_i}</button>
      });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React数独</h1>
        </header>

        {/* 棋盘 */}
        <Board list={this.state.list}
          cellClick={this.handleCellClick}
          origin={this.state.origin}
        />

        {/* 数字选择 */}
        <div className="choices">
          {choices}
        </div>

        {/* 按钮 */}
        <div className="contrls">
          <button onClick={this.startNewGame}>新开一局</button>
          <button onClick={this.restartGame}>重置</button>
          <button onClick={this.back}>回退</button>
          <button onClick={this.clearCell}>清除</button>
        </div>


      </div>
    );
  }
}

export default App;
