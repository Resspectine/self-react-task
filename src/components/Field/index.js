import React, {Component} from 'react';
import Card from '../Card';
import Options from '../Options';
import TimerView from '../TimerView';
import './style.css'

class Field extends Component {
    state = {
        cards: [],
        optionsList: [
            [
                {width: 5, height: 2},
                {width: 6, height: 3},
                {width: 8, height: 3},
            ],
            [
                'red',
                'green',
                'blue',
            ]
        ],
        sizeOption: null,
        colorOption: 'red',
        timerControl: {start: false, stop: false, isPaused: true},
        activeCard: null,
        preventClick: false,
        isOptionsOpen: true,
        isComplete: false,
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
            return el.removed;
        });
        if (state) {
            this.setState({timerControl: {isPaused: true}, isComplete: true});
        }
    };

    shouldRemoveActive = (element) => {
        let temp = this.state.cards.slice();
        let index = this.state.cards.indexOf(element);
        temp[index].shouldRemove = true;
        index = this.state.cards.indexOf(this.state.activeCard);
        temp[index].shouldRemove = true;
        this.setState({cards: temp, preventClick: true});
    };

    removeActive = () => {
        let temp = this.state.cards.map((el) => {
            if (el.shouldRemove) {
                el.removed = true;
                el.shouldRemove = false;
            }
            return el;
        });
        this.setState({cards: temp, preventClick: false});
    };

    rotateCard = (element) => {
        if (!this.state.preventClick && !this.state.isOptionsOpen) {
            if (!this.state.activeCard) {
                let temp = this.setActive(element, true);
                this.setState({activeCard: element, cards: temp});
            } else {
                if (this.state.activeCard.id !== element.id) {
                    let temp = this.setActive(element, true);
                    this.setState({cards: temp});
                    if (element.number === this.state.activeCard.number) {
                        this.shouldRemoveActive(element);
                        setTimeout(() => {
                            this.removeActive();
                            this.setState({activeCard: null});
                            this.isComplete();
                        }, 600);
                    } else {
                        setTimeout(() => {
                            let temp = this.setActive(element, false);
                            let index = this.state.cards.indexOf(this.state.activeCard);
                            temp[index].isActive = false;
                            this.setState({activeCard: null, cards: temp});
                        }, 600);
                    }
                } else {
                    let temp = this.setActive(element, false);
                    this.setState({cards: temp, activeCard: null});
                }
            }
        }
    };

    renderCards = () => this.state.cards.map(el => {
        return <Card key={el.id} card={el} setActive={this.rotateCard} color={this.state.colorOption}/>;
    });

    generateArray = ({width, height}) => {
        let array = [];
        let cardWidth = 100 / width;
        let cardHeight = 100 / height;
        for (let i = 0; i < width * height / 2; i++) {
            array.push(i + 1);
        }
        return this.shuffle([
            ...this.shuffle(array),
            ...this.shuffle(array)
        ]).map(el => {
            return {
                number: el,
                id: Math.random(),
                isActive: false,
                shouldRemove: false,
                removed: false,
                width: cardWidth,
                height: cardHeight
            }
        });
    };

    setOptionColor = (option) => {
        this.setState({colorOption: option});
    };

    setOptionSize = (option) => {
        this.setState({sizeOption: option});
        this.startGame(option);
    };

    startGame = (option) => {
        let cards = this.generateArray(option);
        this.setState({
            cards: cards,
            isOptionsOpen: false,
            timerControl: {start: true},
            activeCard: null,
            isComplete: false
        });
    };

    openOptions = () => {
        if (!this.state.isComplete && this.state.cards.length > 0) {
            let timer = !this.state.timerControl.isPaused;
            let option = !this.state.isOptionsOpen;
            this.setState({isOptionsOpen: option, timerControl: {isPaused: timer}});
        } else {
            this.setState({timerControl: {stop: true}, isOptionsOpen: true});
        }
    };

    setTime = (time) => {
        this.setState({currentTime: time});
    };

    tryAgain = () => {
        this.startGame(this.state.sizeOption);
    };

    changeOptions = () => {
        this.setState({isComplete: false, isOptionsOpen: true, timerControl: {stop: true}});
    };

    renderCongratulations = () => {
        return (
            <div className="congratulations">
                <div className="congratulations-inner">
                    <p>Congratulations!</p>
                    <p onClick={this.tryAgain} className="controls">Try again</p>
                    <p onClick={this.changeOptions} className="controls">Change difficulty</p>
                </div>
            </div>
        );
    };

    renderOptions = () => {
        return (
            <div className={this.state.isOptionsOpen ? "options-field" : "options-field closed"}>
                {this.state.isOptionsOpen &&
                <Options setOption={this.setOptionSize} options={this.state.optionsList[0]} sizeType={true}/>}
                <TimerView setTime={this.setTime} click={this.openOptions} {...this.state.timerControl}/>
                {this.state.isOptionsOpen &&
                <Options setOption={this.setOptionColor} options={this.state.optionsList[1]} sizeType={false}/>}
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
                {this.state.isComplete && this.renderCongratulations()}
            </div>
        );
    }
}

export default Field;
