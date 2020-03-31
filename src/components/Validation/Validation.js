const regExpressions = {
    email: /^[a-zA-Z0-9\-_]+[a-zA-Z0-9\-_\.]*@[a-zA-Z]+[a-zA-Z0-9\.]+$/,
    username: /^[a-zA-Z0-9_]{4,}$/,
    // ASCII chars from ! to ~
    password: /[!-~]{6,}/
};

export const validators = {
    email: (email) => validateField(email, regExpressions.email),
    username: (username) => validateField(username, regExpressions.username),
    password: (password) => validateField(password, regExpressions.password)
};

const validateField = (field, regExp) => {
    return regExp.test(String(field));
};

/**
 * validateCreateBoard
 * проверка вводимых данных
 * @param {string} name - имя пина
 * @param {string} description - описание пина
 * @return {boolean} isOk?
 */
export function validateCreateBoard(name, description) {

    if (name.length < 5 || name.length > 65 )
        return false;

    // @todo do we need description check?
    // it can be 0 length
    return true;
}

/**
 * validateAddPinComment
 * проверка вводимых данных
 * @param {string} comment - комментарий
 * @return {boolean} isOk?
 */
export function validateAddPinComment(comment) {
    return !(comment.length < 3 || comment.length > 64);
}
