// Arc layout
$.circleProgress.defaults.arcCoef = 0.5; // range: 0..1
$.circleProgress.defaults.startAngle = 0.5 * Math.PI;

$.circleProgress.defaults.drawArc = function(v) {
	var ctx = this.ctx,
		r = this.radius,
		t = this.getThickness(),
		c = this.arcCoef,
		a = this.startAngle + (1 - c) * Math.PI;

	v = Math.max(0, Math.min(1, v));

	ctx.save();
	ctx.beginPath();

	if (!this.reverse) {
		ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI * v);
	} else {
		ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI, a + 2 * c * (1 - v) * Math.PI, a);
	}

	ctx.lineWidth = t;
	ctx.lineCap = this.lineCap;
	ctx.strokeStyle = this.arcFill;
	ctx.stroke();
	ctx.restore();
};

$.circleProgress.defaults.drawEmptyArc = function(v) {
	var ctx = this.ctx,
		r = this.radius,
		t = this.getThickness(),
		c = this.arcCoef,
		a = this.startAngle + (1 - c) * Math.PI;

	v = Math.max(0, Math.min(1, v));

	if (v < 1) {
		ctx.save();
		ctx.beginPath();

		if (v <= 0) {
			ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI);
		} else {
			if (!this.reverse) {
				ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI * v, a + 2 * c * Math.PI);
			} else {
				ctx.arc(r, r, r - t / 2, a, a + 2 * c * (1 - v) * Math.PI);
			}
		}

		ctx.lineWidth = t;
		ctx.lineCap = this.lineCap;
		ctx.strokeStyle = this.emptyFill;
		ctx.stroke();
		ctx.restore();
	}
};
