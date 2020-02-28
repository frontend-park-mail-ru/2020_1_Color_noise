import './card.css';
import CardTemplate from './card.pug';

export const addCard = (cardImage, idColumn) => {
    const card = CardTemplate( { image: cardImage });
    const root = document.getElementById(idColumn);
    root.innerHTML += card;
}