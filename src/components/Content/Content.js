import ContentTemplate from './content.pug';
import faviconImage from '../../images/favicon.ico';

export const createContent = () => {
    const root = document.getElementById('root');
    root.innerHTML = ContentTemplate();

    const favicon = document.createElement('link');
    favicon.href = faviconImage;
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(favicon);
};

