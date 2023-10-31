// const updateArrayObjects = (array1, array2) => {
//     const updatedArray = array1.map(item1 => {
//         const matchingItem = array2.find(item2 => item2.id === item1.id && item2.selectedSize === item1.selectedSize);
//         if (matchingItem) {
//             return { ...item1, ...matchingItem };
//         }
//         return item1;
//     });
//     return updatedArray;
// };

//
//
// module.exports = updateArrayObjects

const mergeArrays = (array1, array2) => {
    const mergedArray = [...array1];

    array2.forEach(item2 => {
        const existingIndex = mergedArray.findIndex(item1 => item1._id === item2._id && item1.selectedSize === item2.selectedSize);
        if (existingIndex !== -1) {
            mergedArray[existingIndex] = item2;
        } else {
            mergedArray.push(item2);
        }
    });

    return mergedArray;
};
module.exports = mergeArrays