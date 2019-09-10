import * as React from 'react';
import './Board.scss'

interface IProps {
    list: number[][],
    origin: Set<string>,
    cellClick: (i: number, j: number) => void,
}
interface IState {
    highlight: Set<string>,     // 所在行列宫
    filter: Set<string>,        // 相同元素
    conflict: Set<string>,      // 冲突单元格
    chosen: string,
}

export class Board extends React.Component<IProps, IState> {

    state: IState = {
        filter: new Set(),
        conflict: new Set(),
        highlight: new Set(),
        chosen: ''
    }

    constructor(props: any) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        // console.log('tmp-componentWillMount::')
    }

    UNSAFE_componentWillUpdate() {
        // console.log('tmp-componentWillUpdate::');
    }
    UNSAFE_componentWillReceiveProps(newProps: any) {
        // console.log('tmp-componentWillReceiveProps::', newProps);
        this.checkConflict();
    }
    componentDidUpdate() {
        // console.log('tmp-componentDidUpdate::');
    }
    /**
     * 高亮单元格所在的行列宫
     *
     * @param {number} i
     * @param {number} j
     */
    checkHighlight = (i: number, j: number) => {
        let _highlight = new Set<string>()
        for (let k = 0; k < 9; k++) {
            _highlight.add(i + '' + k).add(k + '' + j);
        }
        let line = Math.floor(i / 3) * 3,
            row = Math.floor(j / 3) * 3
        // console.log('宫', i, j, line, row);
        for (let ln = line; ln < line + 3; ln++) {
            for (let r = row; r < row + 3; r++) {
                _highlight.add(ln + '' + r)
            }
        }
        this.setState({
            highlight: _highlight
        });
        // console.log('highlight', _highlight);
    }
    /**
     * 高亮单元格及相同数值单元格
     *
     * @param {number} i
     * @param {number} j
     */
    checkFilter = (i: number, j: number) => {
        const cellVlue = this.props.list[i][j];
        const _filter = new Set<string>();
        this.props.list.forEach((rows: [], m: number) => {
            rows.forEach((cell, n) => {
                if (cellVlue && cell === cellVlue) { _filter.add('' + m + n) }
            })
        })
        this.setState({
            filter: _filter
        });
        // console.log('过滤filter', _filter, this.props.list);
    }
    /**
     * 标记不符合规则的冲突元素
     *
     */
    checkConflict = () => {
        let values = this.props.list.slice()
        let _conflict = new Set<string>()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!values[i][j]) {
                    continue
                } else {
                    let thisvalue = values[i][j]
                    let possible = this.checkPossible(i, j)
                    if (!possible.has(thisvalue) && !this.props.origin.has('' + i + j)) {
                        _conflict.add(i + '' + j);
                    }
                }
            }
        }
        this.setState({ conflict: _conflict })
        // console.log('tmp冲突检测', _conflict);
    }

    checkPossible(i: number, j: number) {
        let values = this.props.list
        let allPossible = new Set([...'123456789'].map(n => Number(n)))
        for (let k = 0; k <= 8; k++) {
            if (k === j) { continue }
            if (allPossible.has(values[i][k])) {
                allPossible.delete(values[i][k])
            }
        }
        for (let k = 0; k <= 8; k++) {
            if (k === i) { continue }
            if (allPossible.has(values[k][j])) {
                allPossible.delete(values[k][j])
            }
        }
        let bi = Math.floor(i / 3) * 3,
            bj = Math.floor(j / 3) * 3
        for (let m = bi; m < bi + 3; m++) {
            for (let n = bj; n < bj + 3; n++) {
                if (m === i && n === j) {
                    continue
                }
                if (allPossible.has(values[m][n])) {
                    allPossible.delete(values[m][n])
                }
            }
        }
        return allPossible
    }

    cellClick = (i: number, j: number) => {
        // console.log('tmp--cellClick', i, j, this.props.list[i][j]);
        this.setState({ chosen: '' + i + j });
        this.props.cellClick(i, j);
        this.checkHighlight(i, j);
        this.checkFilter(i, j);
    }

    public render() {
        return (
            <div className="tmp-page" >
                <div className="container">
                    {this.props.list.map((item, i) => (

                        <div className="row" key={`row-${item.toString()}`}>
                            {item.map((sub, j) => {
                                let className = 'cell';
                                let cord = '' + i + j;
                                if (this.props.origin.has(cord)) { className += ' origin' }
                                if (this.state.highlight.has(cord)) { className += ' highlight' }
                                if (this.state.filter.has(cord)) { className += ' filter' }
                                if (this.state.conflict.has(cord)) { className += ' conflict' }
                                if (this.state.chosen === cord) { className += ' chosen' }
                                return (
                                    <span key={'' + i + j} className={className} onClick={() => this.cellClick(i, j)}>{sub || ''}</span>
                                )
                            })}
                        </div>

                    ))}
                </div>
            </div>
        )
    }

}