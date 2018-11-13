import React, {Component} from 'react';
import './style.css';

class Options extends Component {

    renderOptions = {
        'size': this.props.options.map((el, i) => {
            return (
                <div className="option"
                     key={el.width + '' + i}
                     onClick={() => this.props.setOption(el)}>
                    <p>{'Width: ' + el.width + ', height: ' + el.height}</p>
                </div>
            );
        }),
        'color': this.props.options.map((el, i) => {
            return (
                <div className="option"
                     key={el+ '' + i}
                     onClick={() => this.props.setOption(el)}>
                    <p>{'Color: ' + el}</p>
                </div>
            );
        }),
    };

    render() {
        return (
            <div className="options">
                {this.renderOptions[this.props.type]}
            </div>
        );
    }
}

export default Options;
