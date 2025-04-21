import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

serve(async (req) => {
  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401 }
      );
    }

    // Get the token
    const token = authHeader.replace("Bearer ", "");

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user from the token
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    // Delete the user's data from profiles (this will cascade to other tables)
    const { error: deleteError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (deleteError) {
      throw deleteError;
    }

    // Delete the user from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (authError) {
      throw authError;
    }

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
