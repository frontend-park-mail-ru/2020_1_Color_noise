/**
 *  webSocket  singleton
 */
class webSocketSingl {
    constructor(){
        console.log("конструктор");
        this.webSocketSingl = null;
        this.isConnected = false
    }
}

export default new webSocketSingl();

