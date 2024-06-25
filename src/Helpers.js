
/**
 * helper function to generate random number in range
 * @param {int} min 
 * @param {int} max 
 * @returns {int} random number from min to max
 */
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}