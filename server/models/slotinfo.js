var mongoose = require('mongoose');

var Slotinfo = mongoose.model('Slots', {
    name: {
        type: String
    },
    group: {
        type: String
    },
    slot1: {
        type: Number
    },
    slot2: {
        type: Number
    },
    slot3: {
        type: Number
    },
    slot4: {
        type: Number
    },
    slot5: {
        type: Number
    },
    slot6: {
        type: Number
    }
});

module.exports = {Slotinfo};