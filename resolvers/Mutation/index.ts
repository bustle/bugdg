import { Context } from "../../server.js"
import * as Article from "../../lib/article.js"

interface Args<T> {
  input: T
}

const Mutation = {
  createArticle: async (_parent: {}, args: Args<Article.CreateInput>, context: Context) => {
    const article = await Article.create(args.input, context)
    return { article }
  },
  updateArticle: async (_parent: {}, args: Args<Article.UpdateInput>, context: Context) => {
    const article = await Article.update(args.input, context)
    return { article }
  }
}

export default Mutation