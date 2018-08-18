const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function createContact(root,args,context,info){
	const userId = getUserId(context) 

	const existUser = await context.db.query.user({ where: { email: args.email } })

	if(!existUser){
		throw new Error("No User exist")
	}

	return context.db.mutation.createContact({
		data: {
          name: args.name,
          email: args.email,
          phone : args.phone,
          createdBy: { connect: { id: userId } },
        }
	}, info)
}

async function updateContact(root,args,context,info){
	const userId = getUserId(context) 

	const existUser = await context.db.query.contact({ where: { id: args.id } })

	if(!existUser){
		throw new Error("No User exist")
	}

	return context.db.mutation.updateContact({
		where:{
			id: args.id
		},
		data: {
          name: args.name,
          email: args.email,
          phone : args.phone,
          createdBy: { connect: { id: userId } },
        }
	}, info)
}

function deleteContact(root,args,context,info){
	const userId = getUserId(context) 
	return context.db.mutation.deleteContact({
		where:{
			id: args.id
		}
	}, info)
}

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)
  // 2
  const existUser = await context.db.query.user({ where: { email: args.email } })

  if(existUser){
  	throw new Error('Email already exists')
  }
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  }, `{ id }`)

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4
  return {
    token,
    user,
  }
}

async function updateUser(parent,args,context,info){
	const password = await bcrypt.hash(args.password, 10)
	const userId = getUserId(context) 

	const existUser = await context.db.query.user({ where: { email: args.email } })

	if (!existUser) {
	    throw new Error('No such user found')
	}

	const user = await context.db.mutation.updateUser({
		where : {
			id : userId
		},
		data: { ...args, password }
	}, `{ id }`)

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	  // 3
	  return {
	    token,
	    user,
	  }
}


async function deleteUser(parent,args,context,info){
	const userId = getUserId(context) 

	const existUser = await context.db.query.user({ where: { email: args.email } })

	if (!existUser) {
	    throw new Error('No such user found')
	}

	const user = await context.db.mutation.deleteUser({
		where : {
			id : userId
		}
	}, `{ id }`)

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	  // 3
	  return {
	    token,
	    user,
	  }
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 3
  return {
    token,
    user,
  }
}

module.exports = {createContact, login, signup, deleteContact,updateContact, updateUser, deleteUser}