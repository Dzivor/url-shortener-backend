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
ON CONFLICT (short_code) DO NOTHING;

-- Insert test click analytics
INSERT INTO clicks (url_id, clicked_at, ip_address, user_agent) VALUES
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '6 days', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '5 days', '10.0.0.50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
  ((SELECT id FROM urls WHERE short_code = 'gh-repo'), NOW() - INTERVAL '1 day', '172.16.0.1', 'Mozilla/5.0 (X11; Linux x86_64)'),
  ((SELECT id FROM urls WHERE short_code = 'yt-music'), NOW() - INTERVAL '4 days', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'),
  ((SELECT id FROM urls WHERE short_code = 'mdn-js'), NOW() - INTERVAL '2 days', '10.0.0.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
  ((SELECT id FROM urls WHERE short_code = 'mdn-js'), NOW() - INTERVAL '1 day', '192.168.1.102', 'Mozilla/5.0 (Android 11; Mobile)'),
  ((SELECT id FROM urls WHERE short_code = 'nodejs-doc'), NOW() - INTERVAL '12 hours', '172.16.0.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
ON CONFLICT DO NOTHING;
