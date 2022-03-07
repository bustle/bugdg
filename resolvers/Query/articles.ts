import { Context } from "../../server.js"

const articles = async (_: {}, _args: {}, ctx: Context ) => {
  const keys = await ctx.redis.keys("article:*")
  return Promise.all(keys.map(key => ctx.redis.hGetAll(key)))
}

export default articles
