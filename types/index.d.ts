// index.d.ts

// Temporal typing, only for develop purposes
type Request<
  RouteGeneric = { Params: Record<string, any>; Querystring: Record<string, any>; Body: Record<string, any> }
> = import('fastify').FastifyRequest<RouteGeneric>

// Temporal typing, only for develop purposes
type Response = import('fastify').FastifyReply
