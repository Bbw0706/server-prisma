const {GraphQLServer} = require("graphql-yoga") 
const resolvers = require("./resolvers.js")
const { Prisma } = require('prisma-binding')

const typeDefs = `
	type Query { 
		contacts(email : String!) : [Contact!]!
		contact(id:ID!) : Contact!
	}
	
	type Mutation {
		login(email: String!, password: String!): AuthPayload
  		signup(email: String!, password: String!, name: String!): AuthPayload
	
		updateUser(name : String, email : String, password : String!) : AuthPayload
		deleteUser(id : ID) : AuthPayload
		
		updateContact(id:ID!, name : String, email : String, phone : String) : Contact!
		createContact(name : String!, email : String!, phone : String!) : Contact!
		deleteContact(id:ID!) : Contact!
	}

	type AuthPayload {
	  token: String
	  user: User
	}

	type User {
	  id: ID!
	  name: String!
	  email: String!
	  password : String!
	  contacts: [Contact!]!
	}
	
	type Contact {
		id : ID! @unique
		name : String!
		email : String!
		phone : String!
		createdBy : User
	}
`


const server = new GraphQLServer({
	typeDefs, 
	resolvers,
	context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/bee-wijaya-3b61ec/database/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})

server.start(() => console.log("Start at port 4000"))