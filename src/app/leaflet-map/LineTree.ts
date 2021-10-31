import { LatLngLiteral, Polyline, PolylineOptions } from 'leaflet';

// precision & MaxDiff for Mocked points
const prec = 1000;
const maxDiff = 10000;

// random int generator
function rnd(max: number): number;
function rnd(min: number, max: number): number;
function rnd(min: number, max?: number): number {
	if (max == undefined) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min)) + min;
}

// addMinutesFn
function addMinutes(d: Date, m: number): Date {
	return new Date(d.getTime() + m * 60 * 1000);
}

export class LineTree {
	constructor(public p: AgedPoint, public children: LineTree[] = []) {}
	toAgedLines(): AgedLine[] {
		// from root to children
		const r = this.children.map((c) => new AgedLine(this.p, c.p));
		// recurse collect children to grand-children ...
		this.children.forEach((c) =>
			c.toAgedLines().forEach((pl) => r.push(pl))
		);
		return r;
	}

	/**
	 * TEMPORARY MOCK FUNCTION
	 * generates up to 9 child nodes with little difference in age & loc to parent
	 */
	randomize(d: number, m: number = 0): this {
		const r = rnd(m, d);
		for (let i = 0; i < r; i++) {
			const age = addMinutes(this.p.age, rnd(0, 60 * 24));
			// age.set(
			// 	age.getTime() //+ Math.floor(rnd(1 * 60 * 7, 60 * 24)) * 60 * 1000 // add random age between 1h and 1d
			// );
			const pointDiff = [rnd(-prec, prec), rnd(-prec, prec)].map(
				(x) => x / maxDiff
			);
			this.children.push(
				new LineTree(
					new AgedPoint(
						{
							lat: this.p.loc.lat + pointDiff[0],
							lng: this.p.loc.lng + pointDiff[1],
						},
						age
					)
				).randomize(d - 3, m - 3)
			);
		}
		return this;
	}
}

export class AgedPoint {
	constructor(public loc: LatLngLiteral, public age: Date = new Date()) {}
}

const renderRange = {
	start: Date.parse('2021-01-01'),
	end: Date.parse('2021-01-07'),
};

const getPercentageAge = (x: Date) =>
	(x.getTime() - renderRange.start) / (renderRange.end - renderRange.start);

export class AgedLine extends Polyline {
	constructor(from: AgedPoint, to: AgedPoint, options?: PolylineOptions) {
		super([from.loc, to.loc], {
			...options,
			weight: 2,
			//color: 'hsl(' + getPercentageAge(to.age) * 360 + ', 100%, 50%)',
			color:
				'hsla(20, 100%, 50%, ' + getPercentageAge(to.age) * 300 + '%)',
		});
	}
}
