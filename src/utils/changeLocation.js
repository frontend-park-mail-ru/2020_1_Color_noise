/**
 *  change title and url of page
 *
 * @param {string} curLoc - url of new page
 * @param {string} title - title
 * @return {void}
 */
export function changeLocation(curLoc, title) {
    try {
        history.pushState(null, null, curLoc);
        document.title = title;
        return;
    } catch (e) {
        console.log('setLocation Err');
    }
}