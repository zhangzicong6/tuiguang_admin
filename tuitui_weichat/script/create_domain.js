var DomainModel = require('../model/Domain');

async function create() {
	console.log('-----create-----')
	try{
		let res = await DomainModel.create({domain_name:'https://t.ihougldk.top'})
		console.log(res)
	}catch(e){
		console.log(e)
	}
	
}

create()