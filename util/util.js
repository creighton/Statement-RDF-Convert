module.exports = {
    _anonct: 0,
    _blankprefix: '_:b',
    getBlank: function () {
        return this._blankprefix + this._anonct++
    }
};
