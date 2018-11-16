import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.css';

class Card extends Component {

    isRotated = () => {
        return 'flip-card-inner' + ((this.props.card.isActive) ? ' rotate' : '');
    };

    render() {
        return (
            <div className={'flip-card' + ((this.props.card.shouldRemove) ? ' remove ' : ' ') + this.props.color}
                 onClick={() => this.props.setActive(this.props.card)}
                 style={{
                     'width': this.props.card.width + '%',
                     'height': this.props.card.height + '%'
                 }}>
                {
                    !this.props.card.removed &&
                    <div className={this.isRotated()}>
                        <div className="flip-card-front">
                        </div>
                        <div className="flip-card-back">
                            {this.props.card.number}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Card.propTypes = {
    card: PropTypes.shape({
        isActive: PropTypes.bool,
        shouldRemove: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        number: PropTypes.number
    }),
    color: PropTypes.string,
    setActive: PropTypes.func,
};

export default Card;
