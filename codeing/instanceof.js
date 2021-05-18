function newInstanceOf(left, right) {
    let rightProto = right.prototype;
    let leftP = left.__proto__;
    while(true) {
        if (leftP === null) return false;
        if (leftP === rightProto) return true;
        leftP = leftP.__proto__;
    }
}