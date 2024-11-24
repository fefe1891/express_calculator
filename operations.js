exports.mean = (array) => array.reduce( ( p, c ) => p + c, 0 ) / array.length;

exports.median = (array) => {
    array.sort((a, b) => a - b); // Sorts the array in ascending order

    let middleIndex = Math.floor(array.length / 2);
    // If array length is even
    if (array.length % 2 === 0) {
        return (array[middleIndex - 1] + array[middleIndex]) / 2;
    } else {
        // If array length is odd
        return array[middleIndex];
    }
};

exports.mode = (array) => {
    let frequency = {}; // Frequency of each element in the array
    let max = 0; // Maximum frequency
    let mode;

    array.forEach(value => frequency[value] = (frequency[value] || 0) + 1);

    for (let key in frequency) {
        if (frequency[key] > max) {
            max = frequency[key];
            mode = Number(key);
        }
    }

    return mode;
};



