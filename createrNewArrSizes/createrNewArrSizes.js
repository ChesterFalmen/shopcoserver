
const  modifyArray = (arrReq, sizeReq, countReq) => {
    return arrReq.map(item => {
        if (item.size === sizeReq) {
            return {size: item.size, count: item.count - countReq};
        }
        return item;
    });
}

module.exports = modifyArray
