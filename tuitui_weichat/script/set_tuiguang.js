var TuiGuangModel = require('../model/TuiGuang.js');


async function a() {
	let tgs = await TuiGuangModel.find()
	for (let tg of tgs) {
		let link = tg.domain_name;
		tg.domain_name = link.substring(0,4)+'s'+link.substring(4);
		await tg.save()
	}
}

a()