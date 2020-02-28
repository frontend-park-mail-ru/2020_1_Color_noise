import { addCard } from '../Card/Card';
import DeskTemplate from './desk.pug';
import './desk.css';
import cardImage1 from '../../images/1.jpg';
import cardImage2 from '../../images/2.jpg';
import cardImage3 from '../../images/3.jpg';
import cardImage4 from '../../images/4.jpg';
import cardImage5 from '../../images/5.jpg';
import cardImage6 from '../../images/6.jpg';
import cardImage7 from '../../images/7.jpg';

export const createDesk = () => {
    const desk = DeskTemplate();
    const root = document.getElementById('content');
    root.innerHTML = desk;
    addCard(cardImage1, 'column1');
    addCard(cardImage2, 'column1');
    addCard(cardImage4, 'column1');
    addCard(cardImage4, 'column2');
    addCard(cardImage7, 'column2');
    addCard(cardImage6, 'column2');
    addCard(cardImage2, 'column3');
    addCard(cardImage1, 'column3');
    addCard(cardImage4, 'column3');
    addCard(cardImage6, 'column4');
    addCard(cardImage3, 'column4');
    addCard(cardImage7, 'column4');
}