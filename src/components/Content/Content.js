import ContentTemplate from './content.pug';

export const createContent = () => {
    const root = document.getElementById('root');
    root.innerHTML = ContentTemplate();
}

