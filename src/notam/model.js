/**
 * Created by Александр on 04.02.2017.
 */


import turf from 'turf'
import {circle, separator, strip, area, sector} from './roles'


const FIELDS = ['А', 'Б', 'Е', 'Г', 'Д', 'Ф', 'Ц', 'Щ'];
const FIELDS_STR = FIELDS.join('');


export default  class Model {

	constructor(data) {
		this.polygons = [];
		this._telegram = data.replace(/\n/g, ' ').replace(/\t/g, ' ');
		this._attr = this.parse(this._telegram);
		this.createFields(this._attr);
	}

	parse(_data) {
		const res = {},
			data= _data.replace(/[^^]\([\S\s]+?\)[^$]/, s=>{
				//debugger;
				return '';
			})
		this.id = data.match(/\((.*?)\s/)[1];
		FIELDS.forEach(f => {
			const reg = RegExp(`${f}\\)([\\S\\s]*?)([${FIELDS_STR}]\\)|$)`, '')
			const m = data.match(reg);
			res[f] = ((m && m[1]) || "").trim();
		}, this)


		return res;
	}

	toPolygon() {
		return this.polygons;
	}

	toPolygons() {
		return turf.featureCollection(this.polygons);
	}

	createFields(attr) {

		this.dateStart = this._parseDate(attr['Б']);
		this.dateEnd = this._parseDate(attr['Ц']);
		this.alts = {
			str: `${attr['Ф']} - ${attr['Г']}`,
			min: attr['Ф'],
			max: attr['Г']
		};

		this.polygons = this._parseGeometry(attr['Е']);

		this.shedule = attr['Д'];
	}

	_parseDate(str) {
		const d = str.match(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
		const dateStr = `20${d[1]}-${d[2]}-${d[3]}T${d[4]}:${d[5]}:00Z`
		return dateStr;// new Date();
	}

	_parseGeometry(str) {
		let polygons = [];
		const props = {
			id: this.id,
			notam: this._telegram
		};
		const id = this.id;
		separator(str, (str) => {


			const _circle = circle(str, props);
			if (_circle) {
				polygons = polygons.concat(_circle);
				return;
			}

			const _strip = strip(str, props);
			if (_strip) {
				polygons = polygons.concat(_strip);
				return;
			}

			const _sector = sector(str, {...props, color: 'black'});
			if (_sector) {
				polygons = polygons.concat(_sector);
				return;
			}
			const _area = area(str, {...props, color: 'blue'});
			if (_area) {
				polygons = polygons.concat(_area);
				return;
			}

			console.log(props);
		})

		return polygons;

	}
}
