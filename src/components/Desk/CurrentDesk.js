/**
 *  current desk singleton
 */
class CurrentDesk {
    constructor(){
        this.State = {
            getSomePinsFunc : "null",
            numberOfPins:0,
        };
    }
}
export default  new CurrentDesk();
