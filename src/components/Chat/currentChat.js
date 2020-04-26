/**
 *  chat storage  singleton
 */
class chatStorage {
    constructor(){
        this.Data = {
            idSelectedUser: -1,
            userContactsList: []
        };
    }

    containsId(id) {
        this.Data.forEach( (element) => {
            if (element.id === id)
                return true
        })
        return false
    }

    addUser(user) {
        this.Data.push(user)
    }

}

export default new chatStorage();
