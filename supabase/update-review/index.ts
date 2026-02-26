import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { reviewId, token, rating, body, sweetness, acidity, tannin, comment } =
      await req.json()

    if (!reviewId || !token) {
      return new Response(JSON.stringify({ success: false, error: "missing params" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // service role로 토큰 검증 (review_tokens는 anon 접근 불가)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const { data: tokenRow } = await supabase
      .from("review_tokens")
      .select("*")
      .eq("review_id", reviewId)
      .eq("token", token)
      .maybeSingle()

    if (!tokenRow) {
      return new Response(JSON.stringify({ success: false, error: "invalid token" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      return new Response(JSON.stringify({ success: false, error: "token expired" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { error: updateError } = await supabase
      .from("reviews")
      .update({ rating, body, sweetness, acidity, tannin, comment })
      .eq("id", reviewId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
