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