-- Create a function to allow users to delete their own account
create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete the user from auth.users
  -- This will trigger cascading deletes on public.profiles and other tables referencing auth.users with ON DELETE CASCADE
  delete from auth.users where id = auth.uid();
end;
$$;
