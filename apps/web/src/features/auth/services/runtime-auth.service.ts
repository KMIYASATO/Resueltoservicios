import { defaultDemoAccount, demoAuthService } from "./demo-auth.service";
import { supabaseAuthIsConfigured, supabaseAuthService } from "./supabase-auth.service";

export const authService = supabaseAuthIsConfigured ? supabaseAuthService : demoAuthService;
export const authUsesSupabase = supabaseAuthIsConfigured;
export { defaultDemoAccount };
