-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_attempt text;
    counter integer := 0;
    max_attempts integer := 5;
BEGIN
    -- Generate initial username attempt
    username_attempt := COALESCE(
        NEW.raw_user_metadata->>'username',
        'user_' || SUBSTR(NEW.id::text, 1, 8)
    );

    -- Try to insert with increasingly modified usernames if there's a conflict
    WHILE counter < max_attempts LOOP
        BEGIN
            INSERT INTO public.profiles (id, username, email)
            VALUES (
                NEW.id,
                CASE 
                    WHEN counter = 0 THEN username_attempt
                    ELSE username_attempt || counter::text
                END,
                NEW.email
            );
            -- If successful, exit the loop
            EXIT;
        EXCEPTION WHEN unique_violation THEN
            counter := counter + 1;
            IF counter = max_attempts THEN
                RAISE EXCEPTION 'Could not generate unique username after % attempts', max_attempts;
            END IF;
        END;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add policy for inserting profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Enable insert for authenticated users only'
    ) THEN
        CREATE POLICY "Enable insert for authenticated users only" 
        ON public.profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$; 