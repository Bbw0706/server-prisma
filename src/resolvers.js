const {contact, contacts} = require("./resolvers/Query.js")
const {
	createContact, 
	login, 
	signup, 
	updateContact, 
	updateUser, 
	deleteUser,
	deleteContact
} = require("./resolvers/Mutation.js");

const {user} = require("./resolvers/AuthPayload.js");

const resolvers = {
	Query:{
		contact,
		contacts
	},
	Mutation : {
		createContact,
		updateUser,
		deleteUser,
		updateContact,
		login,
		signup,
		deleteContact
	},
	AuthPayload : {
		user
	}
}

module.exports = resolvers