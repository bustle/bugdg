import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import Query from './resolvers/Query/index.js'
import Mutation from './resolvers/Mutation/index.js'
import { createRedisConnection } from './lib/ops/redis.js'

export interface Context {
  redis: Awaited<ReturnType<typeof createRedisConnection>>
}

// Construct a schema, using GraphQL schema language
const typeDefs = gql(`
  type Query {
    advertisers: [String!]!
    articles: [Article!]!
  }

  type Mutation {
    createArticle(input: CreateArticleInput!): ArticlePayload
    updateArticle(input: UpdateArticleInput!): ArticlePayload
  }

  input CreateArticleInput {
    title: String!
  }

  input UpdateArticleInput {
    id: Int!
    title: String
  }

  type ArticlePayload {
    article: Article
  }

  type Article {
    id: Int!
    title: String!
  }
`);

const resolvers = {
  Query,
  Mutation,
}

const port = 4000
const app = express()

app.use(cors({ maxAge: 86400 }))
app.use((req, _, next) => {
  req.headers['content-type'] = 'application/json'
  req.body = {
    query: req.body,
  }
  next()
})


// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  const redis = await createRedisConnection()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [],
    debug: true,
    context: (): Context => {
      return {
        redis,
      }
    },
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
    bodyParserConfig: { limit: '50mb' },
    cors: {
      origin: '*',
    },
  })

  createServer(app).listen(port, () => {
    console.log(`🌀 HTTP http://localhost:${port}${server.graphqlPath}`)
  })
})()