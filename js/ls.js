/**
 *      readFromLS
 *          using the key parameter read LS
 *          convert that text to JSON
 *          and return to the user
 * @param key           LS key for the value to be store
 * @returns {any}       the JSONified text from LS
 */
export function readFromLS(key) {
    let ls = JSON.parse(localStorage.getItem(key));     //  convert LS text to JSON
    return ls;          //  yes we could do this in one line of code but let's show what we are doing
}

/**
 *      writeToLS
 *          using the key paramters save the specified data to LS
 *          the data will need to first be convereted to text
 *          then saved to LS
 * @param key           LS key for the balue yto be saved
 * @param data          value to be saved to LS
 */
export function writeToLS(key, data) {
    let text = JSON.stringify(data);        // prepare our data to be saved to LS. Convert it to text
    localStorage.setItem(key, text);        // yes this could have all been done in a single line but let's show waht we are doing
}