import React, {Component} from 'react';
import Timer from './Timer';
import PropTypes from 'prop-types';
import './style.css';

class TimerView extends Component {

    state = {
        currentTime: 0,
        timer: new Timer(),
    };

    componentDidMount = () => {
        this.interval = setInterval(() => this.setState({currentTime: this.state.timer.getMilliseconds}), 10);
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    componentDidUpdate(prevProps) {
        if (this.props.start) {
            this.state.timer.start();
        }
        if (this.props.stop) {
            this.state.timer.stop();
        }
        if (this.props.hasOwnProperty('isPaused')) {
            if (this.props.isPaused) {
                this.state.timer.pause();
            } else {
                this.state.timer.resume();
            }
        }
    }

    renderTime = () => {
        let milliseconds = this.state.currentTime;
        let minutes = Math.floor(milliseconds / 6000);
        let seconds = Math.floor((milliseconds - minutes * 6000) / 100);
        return (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? seconds : '0' + seconds);
    };

    render() {
        return (
            <div className="timer" onClick={() => this.props.click()}>
                <div>
                    <p>{this.renderTime()}</p>
                </div>
            </div>
        );
    }
}

TimerView.propTypes = {
    start: PropTypes.bool,
    stop: PropTypes.bool,
    isPaused: PropTypes.bool,
    click: PropTypes.func,
};

export default TimerView;
