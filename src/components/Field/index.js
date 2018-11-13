import React, {Component} from 'react';
import Card from '../Card';
import Options from '../Options';
import Timer from '../Timer';
import './style.css'

class Field extends Component {
    state = {
        cards: [],
        sizeOptions: [
            {width: 5, height: 2},
            {width: 6, height: 3},
            {width: 8, height: 3}
        ],
        colorOptions: ['red', 'green', 'blue'],
        optionSize: null,
        optionColor: 'red',
        active: null,
        preventClick: false,
        timer: 'stop',
        optionsOpen: true,
        complete: false,
        time: {},
        rules: true,
    };

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    setActive = (element, state) => {
        let index = this.state.cards.indexOf(element);
        let temp = this.state.cards.slice();
        temp[index].isActive = state;
        return temp;
    };

    isComplete = () => {
        let state = this.state.cards.every(el => {
            return el.isActive;
        });
        if (state) {
            this.setState({timer: 'pause', complete: true});
        }
    };

    shouldRemoveActive = (element) => {
        let temp = this.state.cards.slice();
        let index = this.state.cards.indexOf(element);
        temp[index].shouldRemove = true;
        index = this.state.cards.indexOf(this.state.active);
        temp[index].shouldRemove = true;
        this.setState({cards: temp, preventClick: true});
    };

    removeActive = () => {
        let temp = this.state.cards.filter((el) => {
            return !el.shouldRemove;
        });
        this.setState({cards: temp, preventClick: false});
    };

    rotateCard = (element) => {
        if (!this.state.preventClick && !this.state.optionsOpen) {
            if (!this.state.active) {
                let temp = this.setActive(element, true);
                this.setState({active: element, cards: temp});
            } else {
                if (this.state.active.id !== element.id) {
                    let temp = this.setActive(element, true);
                    this.setState({cards: temp});
                    if (element.number === this.state.active.number) {
                        this.shouldRemoveActive(element);
                        setTimeout(() => {
                            this.removeActive();
                            this.setState({active: null});
                            this.isComplete();
                        }, 600);
                    } else {
                        setTimeout(() => {
                            let temp = this.setActive(element, false);
                            let index = this.state.cards.indexOf(this.state.active);
                            temp[index].isActive = false;
                            this.setState({active: null, cards: temp});
                        }, 600);
                    }
                } else {
                    let temp = this.setActive(element, false);
                    this.setState({cards: temp, active: null});
                }
            }
        }
    };

    renderCards = () => this.state.cards.map(el => {
        return <Card key={el.id} element={el} setActive={this.rotateCard} color={this.state.optionColor}/>;
    });

    generateArray = (size) => {
        let array = new Set();
        while (array.size < size / 2) {
            array.add(Math.floor(Math.random() * (size / 2) + 1));
        }
        return this.shuffle([...array, ...array]);
    };

    fillArray = (array, {width, height}) => {
        let cardWidth = 100 / width;
        let cardHeight = 100 / height;
        let i = 0;
        let j = 0;
        return array.map(el => {
            if (i > width - 1) {
                j++;
                i = 0;
            }
            return {
                number: el,
                id: Math.random(),
                isActive: false,
                left: i++,
                top: j,
                shouldRemove: false,
                width: cardWidth,
                height: cardHeight
            }
        });
    };

    setOptionSize = (option) => {
        this.setState({optionSize: option});
        this.startGame(option);
    };

    startGame = (option) => {
        let cards = this.generateArray(option.width * option.height);
        cards = this.fillArray(cards, option);
        this.setState({cards: cards, optionsOpen: false, timer: 'start', active: null, complete: false});
    };

    setOptionColor = (option) => {
        this.setState({optionColor: option});
    };

    openOptions = () => {
        console.log(this.state.cards);
        if (this.state.cards && this.state.cards.length !== 0) {
            let timer = this.state.timer === 'pause' ? 'resume' : 'pause';
            let option = !this.state.optionsOpen;
            this.setState({optionsOpen: option, timer});
        } else {
            if (this.state.complete) {
                this.setState({timer: 'stop', optionsOpen: true});
            }
        }
    };

    setTime = (time) => {
        this.setState({time: time});
    };

    tryAgain = () => {
        this.startGame(this.state.optionSize);
    };

    changeOptions = () => {
        this.setState({complete: false, optionsOpen: true, timer: 'stop'});
    };

    renderCongratulations = () => {
        return (
            <div className="congratulations">
                <div className="congratulations-inner">
                    <p>Congratulations!</p>
                    <p>Your time
                        is {(this.state.time.minutes >= 10 ? this.state.time.minutes : '0' + this.state.time.minutes) + ':' +
                        (this.state.time.seconds >= 10 ? this.state.time.seconds : '0' + this.state.time.seconds)}</p>
                    <p onClick={this.tryAgain} className="controls">Try again</p>
                    <p onClick={this.changeOptions} className="controls">Change difficulty</p>
                </div>
            </div>
        );
    };

    renderOptions = () => {
        return (
            <div className={this.state.optionsOpen ? "options-field" : "options-field closed"}>
                {this.state.optionsOpen &&
                <Options setOption={this.setOptionSize} options={this.state.sizeOptions} type={'size'}/>}
                <Timer setTime={this.setTime} click={this.openOptions} state={this.state.timer}/>
                {this.state.optionsOpen &&
                <Options setOption={this.setOptionColor} options={this.state.colorOptions} type={'color'}/>}
            </div>
        )
    };

    render() {
        return (
            <div className="field">
                {this.renderOptions()}
                <div className="cards-field">
                    <div className="cards">
                        {this.renderCards()}
                    </div>
                </div>
                {this.state.complete && this.renderCongratulations()}
            </div>
        );
    }
}

export default Field;
