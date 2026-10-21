# Purpose

The purpose of the repo is twofold:
 - Explore Supabase as a backend-as-a-service platform. 
 - Explore Supabase Realtime.


# Supabase CLI Guide

## Supabase CLI Setup
1. `npm install supabase --save-dev`
   Installs supabase as a dev dependency. 

2. `npx supabase init`
    Inits the supabase project by creating the supabase folder.

3. `npx supabase link --project-ref <project-reference>`
   Connects supabase to the cloud project

## Supabase migrations and seed file

1. `npx supabase migration new create_order_items_table` 
   Creates migration files.

2. `npx supabase db push --dry-run`
   To do a dry run to see which migration files are pending to run.

3. `npx supabase db push`
   Runs the migration on the cloud database.

4. `npx supabase db query --linked -f supabase/seed.sql`
   To run a sql file. I created a seed.sql to run on the cloud to fill the tables. Additionally, `npx supabase db push --include-seed` runs the seed file as well.