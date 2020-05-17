/**
 *  current desk singleton
 */
class CurrentDesk {
    constructor(){
        this.State = {
            getSomePinsFunc : "null",
            numberOfPins:0,
            searchReverseCheckbox : null,
        };
    }
}
export default  new CurrentDesk();
