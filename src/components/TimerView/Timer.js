class Timer {
    constructor() {
        this.milliseconds = 0;
        this.interval = null;
    }

    setInterval = () => {
        this.interval = setInterval(() => {
            this.milliseconds++;
        }, 10);
    };

    clearInterval = () => {
        clearInterval(this.interval);
        this.interval = null;
    };

    start = () => {
        if (!this.interval) {
            this.milliseconds = 0;
            this.setInterval();
        }
    };

    pause = () => {
        if (this.interval) {
            this.clearInterval();
        }
    };

    resume = () => {
        if (!this.interval) {
            this.setInterval();
        }
    };

    stop = () => {
        this.milliseconds = 0;
        this.clearInterval();
    };

    get getMilliseconds() {
        return this.milliseconds;
    }
}

export default Timer;