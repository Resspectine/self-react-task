import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.css';

class Options extends Component {

    renderOptions = () => {
        return this.props.options.map((el, i) => {
            return (
                <div className="option"
                     key={el + '' + i}
                     onClick={() => this.props.setOption(el)}>
                    {this.props.sizeType ?
                        <p>{'Width: ' + el.width + ', height: ' + el.height}</p> :
                        <p>{'Color: ' + el}</p>}
                </div>
            );
        });
    };

    render() {
        return (
            <div className="options">
                {this.renderOptions()}
            </div>
        );
    }
}

Options.propTypes = {
    options: PropTypes.array,
    sizeType: PropTypes.bool,
    setOption: PropTypes.func
};

export default Options;
