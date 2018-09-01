describe('A single Tinycolorpicker', function() {
    before(function () {
        document.head.innerHTML = __html__['test/fixtures/tinycolorpicker-css.html'];
    });

    beforeEach(function () {
        document.body.innerHTML = __html__['test/fixtures/tinycolorpicker.html'];
    });

    afterEach(function () {
        document.body.innerHTML = '';
    });

    it('should have a accessible instance', function() {
        var instance = tinycolorpicker(document.getElementById("colorPicker"));

        expect(instance).to.be.a('object');
        expect(instance._name).to.equal('tinycolorpicker');
    });

    it('should be able to be set to a specific hex color.', function() {
        var instance = tinycolorpicker(document.getElementById("colorPicker"));

        instance.setColor('#FF0000');

        expect(instance.colorHex).to.equal('#FF0000');
        expect(instance.colorRGB).to.equal('rgb(255,0,0)');
    });

    it('should be able to be set to a specific rgb color.', function() {
        var instance = tinycolorpicker(document.getElementById("colorPicker"));

        instance.setColor('rgb(255,0,0)');

        expect(instance.colorHex).to.equal('#FF0000');
        expect(instance.colorRGB).to.equal('rgb(255,0,0)');
    });

    it('should be able to convert a hex color to rgb color.', function() {
        var instance = tinycolorpicker(document.getElementById("colorPicker"));

        expect(instance.hexToRgb('#FF0000')).to.equal('rgb(255,0,0)');
    });

    it('should be able to convert a rgb color to hex color.', function() {
        var instance = tinycolorpicker(document.getElementById("colorPicker"));

        expect(instance.rgbToHex('rgb(255,0,0)')).to.equal('#FF0000');
    });
});
