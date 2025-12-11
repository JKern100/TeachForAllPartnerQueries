export const config = {
  matcher: ['/'], // Protects the home page. Change to '/:path*' to protect everything.
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  
  // 1. Check if the user sent a username/password
  if (!auth) {
    return new Response('Authentication Required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  // 2. Decode the username/password
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic') {
    return new Response('Invalid Auth Scheme', { status: 400 });
  }

  const decoded = atob(encoded);
  const [user, pwd] = decoded.split(':');

  // 3. Check against your Environment Variables
  // CHANGE 'admin' below to whatever default username you want, or use a variable
  if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-next': '1' }, // Let the request pass through
    });
  }

  // 4. Fail
  return new Response('Invalid Credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}
