-- Insert test users
INSERT INTO users (email, password_hash) VALUES
  ('alice@example.com', '$2b$10$K7L9nIQlpUHBP0tzQPp5GOoP.BZ3ZC0Uq3T4r7Q9M2X8kL3N4r0jO'),
  ('bob@example.com', '$2b$10$K7L9nIQlpUHBP0tzQPp5GOoP.BZ3ZC0Uq3T4r7Q9M2X8kL3N4r0jO'),
  ('charlie@example.com', '$2b$10$K7L9nIQlpUHBP0tzQPp5GOoP.BZ3ZC0Uq3T4r7Q9M2X8kL3N4r0jO')
ON CONFLICT (email) DO NOTHING;

-- Insert test URLs with references to users
INSERT INTO urls (user_id, original_url, short_code, created_at) VALUES
  ((SELECT id FROM users WHERE email = 'alice@example.com'), 'https://github.com/Dzivor/url-shortener', 'gh-repo', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE email = 'alice@example.com'), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'yt-music', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE email = 'alice@example.com'), 'https://stackoverflow.com/questions/419163/what-does-if-name-main-do', 'so-python', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'bob@example.com'), 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference', 'mdn-js', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'bob@example.com'), 'https://nodejs.org/en/docs/', 'nodejs-doc', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'charlie@example.com'), 'https://react.dev', 'react18', NOW())
ON CONFLICT (user_id, short_code) DO NOTHING;

-- Insert test click analytics
INSERT INTO clicks (url_id, clicked_at, ip_address, user_agent) VALUES
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '6 days'),
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '5 days'),
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '1 day'),
  ((SELECT id FROM urls WHERE short_code = 'yt-music'), NOW() - INTERVAL '4 days'),
  ((SELECT id FROM urls WHERE short_code = 'mdn-js'), NOW() - INTERVAL '2 days'),
  ((SELECT id FROM urls WHERE short_code = 'mdn-js'), NOW() - INTERVAL '1 day'),
  ((SELECT id FROM urls WHERE short_code = 'nodejs-doc'), NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;
