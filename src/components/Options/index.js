import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.css';

class Options extends Component {

    renderOptions = () => {
        return this.props.options.map((option, i) => {
            return (
                <div className="option"
                     key={i}
                     onClick={() => this.props.setOption(option)}>
                    {this.props.sizeType ?
                        <p>{'Width: ' + option.width + ', height: ' + option.height}</p> :
                        <p>{'Color: ' + option}</p>}
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
