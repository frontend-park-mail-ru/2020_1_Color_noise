/**
 *  current desk singleton
 */
class CurrentDesk {
    constructor(){
        this.State = {
            getSomePinsFunc : "null",
            numberOfPins:0,
            searchReverseCheckbox : null,
            searchObj : "pin",
        };
    }
}
export default  new CurrentDesk();
