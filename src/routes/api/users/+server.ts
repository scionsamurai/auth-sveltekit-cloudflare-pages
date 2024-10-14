
// This file is taken from
//
// https://developers.cloudflare.com/d1/examples/d1-and-sveltekit/
//
// with some modifications.
//
// Please note the following quote from that page:
//
// Bindings are available on the platform parameter passed to each endpoint, via platform.env.BINDING_NAME.
//
//
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ platform }) {
  if (!platform) {
    return new Response(JSON.stringify({ error: 'Platform is undefined' }), { status: 500 });
  }
  const result = await platform.env.DB.prepare(
    "SELECT * FROM users LIMIT 100"
  ).run();
  return new Response(JSON.stringify(result,null,2));
}