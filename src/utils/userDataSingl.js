/**
 *  user data singleton
 */
class UserDataCur {
    constructor(){
        this.Data = {
            id: -1,
            login: "null",
            email: 'null email',
            token: "",
            avatarPath: "NULL PATH",
            about: ""
        };
    }
}

export default new UserDataCur();