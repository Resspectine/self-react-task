import React, {Component} from 'react';
import './style.css';

class Timer extends Component {

    state = {
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        interval: null
    };

    setInterval = () => {
        let interval = setInterval(() => {
            let seconds = this.state.seconds;
            let minutes = this.state.minutes;
            let milliseconds = this.state.milliseconds;
            if (milliseconds === 99) {
                seconds++;
                milliseconds = 0;
            } else {
                milliseconds++;
            }
            if (seconds === 59) {
                minutes++;
                seconds = 0;
            }
            this.props.setTime({minutes, seconds});
            this.setState({minutes, seconds, milliseconds});
        }, 10);
        this.setState({interval: interval});
    };

    clearInterval = () => {
        let interval = this.state.interval;
        clearInterval(interval);
        this.setState({interval: null});
    };

    timerControl = {
        'start': () => {
            this.setState({seconds: 0, minutes: 0});
            if (!this.state.interval) {
                this.setInterval();
                console.log('start');
            }
        },
        'pause': () => {
            if (this.state.interval) {
                this.clearInterval();
                console.log('pause');
            }
        },
        'resume': () => {
            if (!this.state.interval) {
                this.setInterval();
                console.log('resume');
            }
        },
        'stop': () => {
            this.setState({seconds: 0, minutes: 0});
            if (this.state.interval) {
                this.clearInterval();
                console.log('stop');
            }
        }
    };

    componentDidMount() {
        this.timerControl[this.props.state]();
    }

    componentDidUpdate(prevProps) {
        if (this.props.state !== prevProps.state) {
            this.timerControl[this.props.state]();
        }
    }

    render() {
        return (
            <div className="timer" onClick={() => this.props.click()}>
                <div>
                    <p>{(this.state.minutes >= 10 ? this.state.minutes : '0' + this.state.minutes) + ':'}
                        {(this.state.seconds >= 10 ? this.state.seconds : '0' + this.state.seconds)}</p>
                </div>
            </div>
        );
    }
}

export default Timer;
