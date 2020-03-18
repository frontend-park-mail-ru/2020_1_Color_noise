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
        };
    }
}

export default  new UserDataCur();