-- Seed products
INSERT INTO public.products (name, price, category)
VALUES
    ('Mechanical Keyboard', 89.99, 'electronics'),
    ('Wireless Mouse', 29.99, 'electronics'),
    ('Cotton T-Shirt', 19.99, 'clothing'),
    ('Hoodie', 49.99, 'clothing'),
    ('Study Planner', 12.99, 'study'),
    ('Notebook Set', 8.99, 'study');


-- Seed users
INSERT INTO public.users (username, display_name)
VALUES
    ('alice', 'Alice Johnson'),
    ('bob', 'Bob Smith'),
    ('charlie', 'Charlie Brown');


-- Seed orders
INSERT INTO public.orders (user_id, order_ts, delivery_date)
VALUES
    (
        (SELECT id FROM public.users WHERE username = 'alice'),
        NOW(),
        CURRENT_DATE + 3
    ),
    (
        (SELECT id FROM public.users WHERE username = 'bob'),
        NOW(),
        CURRENT_DATE + 5
    ),
    (
        (SELECT id FROM public.users WHERE username = 'alice'),
        NOW(),
        CURRENT_DATE + 7
    );


-- Seed order items
INSERT INTO public.order_items (order_id, product_id, quantity)
VALUES
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'alice'
         ORDER BY o.id
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Mechanical Keyboard'),
        1
    ),
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'alice'
         ORDER BY o.id
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Study Planner'),
        2
    ),
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'bob'
         ORDER BY o.id
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Wireless Mouse'),
        1
    ),
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'bob'
         ORDER BY o.id
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Cotton T-Shirt'),
        2
    ),
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'alice'
         ORDER BY o.id DESC
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Hoodie'),
        1
    ),
    (
        (SELECT o.id
         FROM public.orders o
         JOIN public.users u ON u.id = o.user_id
         WHERE u.username = 'alice'
         ORDER BY o.id DESC
         LIMIT 1),
        (SELECT id FROM public.products WHERE name = 'Notebook Set'),
        3
    );