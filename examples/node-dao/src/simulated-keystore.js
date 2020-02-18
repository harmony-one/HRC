
/********************************
Simulated keystore
********************************/
const keys = new Map();
keys.set('one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740',
    '01F903CE0C960FF3A9E68E80FF5FFC344358D80CE1C221C3F9711AF07F83A3BD');
keys.set('one17xr83eujcngu349wkysk5sk9z4fvr207gpnrhl',
    '4a9da1dfa22f2936fdb90f885f5a7e17bcfba8463656aa89e24df8a99959f442');
keys.set('one103frfx3zmeymel7uyrkd3t48gup2hkalknmj9j',
    '6460639a35df6096f0062142ef1bd5f84373c915a8a551f88fb9bf6861a9319d');

exports.importKey = (bech32Address) => keys.get(bech32Address);
