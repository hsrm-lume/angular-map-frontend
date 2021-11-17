type Theme = 'dark' | 'light';
type MapMode = 'heatmap' | 'point' | 'line';

interface DateRange {
	from: Date;
	to: Date;
}
interface NumberRange {
	from: number;
	to: number;
}

type Dict = {
	[key: string]: any;
};
