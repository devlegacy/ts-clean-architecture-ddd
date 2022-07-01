// index.d.

// Temp typing - only for dev purposes
type HttpRequest<
  RouteGeneric = { Params: Record<string, any>; Querystring: Record<string, any>; Body: Record<string, any> }
> = import('fastify').FastifyRequest<RouteGeneric>

// Temp typing - only for dev purposes
type HttpResponse = import('fastify').FastifyReply
