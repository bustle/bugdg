import { UserInputError } from "apollo-server-express"
import { Context } from "../server"

export interface CreateInput {
  title: string
}

export interface UpdateInput {
  id: number
  title: string
}

const exists = ({ id }: { id: number }, context: Context) => context.redis.exists(`article:${id}`)

export const create = async ({ title }: CreateInput, ctx: Context) => {
  const id = await ctx.redis.incr("id")
  await set({ id, title }, ctx)
  return { id, title }
}

export const update = async (input: UpdateInput, ctx: Context) => {
  if (!(await exists(input, ctx))) {
    throw new UserInputError(`Article ${input.id} does not exist`)
  }

  await set(input, ctx)
  return { id: input.id, title: input.title }
}

const set = (input: UpdateInput, ctx: Context) => 
  ctx.redis.hSet(`article:${input.id}`, { "id": input.id, "title": input.title })