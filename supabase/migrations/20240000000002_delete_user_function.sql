-- Create a function to delete a user and their data
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void AS $$
BEGIN
  -- Delete from profiles first (this will cascade to other related tables)
  DELETE FROM profiles WHERE id = auth.uid();
  
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 