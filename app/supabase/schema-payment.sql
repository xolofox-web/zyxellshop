-- Tabel orders (Menyimpan data pesanan/transaksi)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  order_id text unique not null,
  amount numeric not null check (amount > 0),
  admin_fee numeric default 0 not null,
  total_amount numeric not null,
  payment_method text check (payment_method in ('QRIS', 'VA', 'RETAIL')) not null,
  status text default 'PENDING' check (status in ('PENDING', 'SETTLED', 'EXPIRED', 'FAILED')) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Mengaktifkan Row Level Security (RLS) untuk orders
alter table public.orders enable row level security;

-- Kebijakan RLS: User hanya bisa melihat pesanannya sendiri
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Kebijakan RLS: User hanya bisa membuat pesanan untuk dirinya sendiri
create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Tabel transactions (Menyimpan log respons dari payment gateway/cashi.id)
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  external_id text,
  payment_method text not null,
  provider_response jsonb,
  status text default 'PENDING' not null,
  created_at timestamptz default now() not null
);

-- Mengaktifkan Row Level Security (RLS) untuk transactions
alter table public.transactions enable row level security;

-- Kebijakan RLS: User hanya bisa melihat transaksi dari pesanannya sendiri
create policy "Users can view own transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = transactions.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Fungsi dan Trigger untuk otomatis mengupdate kolom updated_at di tabel orders
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();