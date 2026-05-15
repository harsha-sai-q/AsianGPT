create extension if not exists vector;

create table if not exists users (
  id uuid primary key,
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null default 'New conversation',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  token_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  memory_type text not null check (memory_type in ('fact','preference','failure','joke','goal','callback','summary')),
  content text not null,
  importance smallint not null default 3 check (importance between 1 and 5),
  emotional_weight smallint not null default 3 check (emotional_weight between 1 and 5),
  last_referenced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references memories(id) on delete cascade,
  model text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  confidence numeric(4,3) not null default 0.5,
  source_memory_id uuid references memories(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique(user_id, key)
);

create index if not exists idx_messages_conversation_created on messages(conversation_id, created_at desc);
create index if not exists idx_memories_user_updated on memories(user_id, updated_at desc);
create index if not exists idx_memories_type on memories(memory_type);
create index if not exists idx_embeddings_memory on embeddings(memory_id);

create or replace function match_memories(
  query_embedding vector(1536),
  match_user_id uuid,
  match_count int default 8
)
returns table (
  memory_id uuid,
  content text,
  memory_type text,
  importance smallint,
  emotional_weight smallint,
  similarity float
)
language sql stable
as $$
  select
    m.id,
    m.content,
    m.memory_type,
    m.importance,
    m.emotional_weight,
    1 - (e.embedding <=> query_embedding) as similarity
  from embeddings e
  join memories m on m.id = e.memory_id
  where m.user_id = match_user_id
  order by e.embedding <=> query_embedding
  limit match_count;
$$;
