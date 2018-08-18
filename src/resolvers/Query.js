function contact(root,args,context,info){
	return context.db.query.contact({
	  	where :{
	  		id : args.id
	  	}
	 }, info)
}


function contacts(root,args,context,info){
	return context.db.query.contacts({
		where:{
			createdBy : {
				email : args.email
			}
		}
	}, info)
}

module.exports = { contact , contacts}