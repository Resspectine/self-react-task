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
        timerControl: {
            start: false,
            stop: false,
            pause: true,
            resume: false
        },
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

    setActive = (card, state) => {
        let index = this.state.cards.indexOf(card);
        const cards = this.state.cards.slice();
        cards[index].isActive = state;
        return cards;
    };

    isComplete = () => {
        const areCardsRemoved = this.state.cards.every(card => card.removed);
        if (areCardsRemoved) {
            this.setState({timerControl: {pause: true}, isComplete: true});
        }
    };

    removeActive = () => {
        const cards = this.state.cards.map((card) => {
            if (card.isActive) {
                card.removed = true;
                card.isActive = false;
            }
            return card;
        });
        this.setState({cards, preventClick: false});
    };

    rotateCard = (card) => {
        if (!this.state.preventClick && !this.state.isOptionsOpen && !card.removed) {
            if (!this.state.activeCard) {
                const cards = this.setActive(card, true);
                this.setState({activeCard: card, cards});
            } else {
                if (this.state.activeCard.id !== card.id) {
                    const cards = this.setActive(card, true);
                    this.setState({cards});
                    if (card.number === this.state.activeCard.number) {
                        this.setState({activeCard: null, preventClick: true});
                        setTimeout(() => {
                            this.removeActive();
                            this.isComplete();
                        }, 600);
                    } else {
                        setTimeout(() => {
                            const cards = this.setActive(card, false);
                            let index = this.state.cards.indexOf(this.state.activeCard);
                            cards[index].isActive = false;
                            this.setState({activeCard: null, cards});
                        }, 600);
                    }
                } else {
                    const cards = this.setActive(card, false);
                    this.setState({cards, activeCard: null});
                }
            }
        }
    };

    renderCards = () => this.state.cards.map(el => {
        return <Card key={el.id} card={el} setActive={this.rotateCard} color={this.state.colorOption}/>;
    });

    generateArray = ({width, height}) => {
        const cards = [];
        const cardWidth = 100 / width;
        const cardHeight = 100 / height;
        for (let i = 0; i < width * height / 2; i++) {
            cards.push(i + 1);
        }
        return this.shuffle([
            ...this.shuffle(cards),
            ...this.shuffle(cards)
        ]).map(el => {
            return {
                number: el,
                id: Math.random(),
                isActive: false,
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
        const cards = this.generateArray(option);
        this.setState({
            cards,
            isOptionsOpen: false,
            timerControl: {start: true},
            activeCard: null,
            isComplete: false
        });
    };

    openOptions = () => {
        if (!this.state.isComplete && this.state.cards.length > 0) {
            const isPaused = this.state.timerControl.pause;
            const timerControl = {};
            isPaused ? timerControl.resume = true : timerControl.pause = true;
            let option = !this.state.isOptionsOpen;
            this.setState({isOptionsOpen: option, timerControl});
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
