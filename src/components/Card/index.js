import React, {Component} from 'react';
import './style.css';

class Card extends Component {

    isRotated = () => {
        return 'flip-card-inner' + ((this.props.element.isActive) ? ' rotate' : '');
    };

    render() {
        return (
            <div className={'flip-card' + ((this.props.element.shouldRemove) ? ' remove ' : ' ') + this.props.color}
                 onClick={() => this.props.setActive(this.props.element)}
                 style={{
                     'left': this.props.element.left * this.props.element.width + '%',
                     'top': this.props.element.top * this.props.element.height + '%',
                     'width': this.props.element.width + '%',
                     'height': this.props.element.height + '%'
                 }}>
                <div className={this.isRotated()}>
                    <div className="flip-card-front">
                    </div>
                    <div className="flip-card-back">
                        {this.props.element.number}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
