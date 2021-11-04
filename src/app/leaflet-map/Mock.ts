import { AgedPoint, LineTree } from './LineTree';

export default new LineTree(
	new AgedPoint(
		{ lat: 50.09692895957101, lng: 8.21682929992676 },
		new Date('2021-01-01')
	)
).randomize(10, 5);
