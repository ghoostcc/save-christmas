import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kyumazqolijeyhywhdto.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dW1henFvbGlqZXloeXdoZHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODUxNzEsImV4cCI6MjA4MDY2MTE3MX0.VmmkNlpEYlwWY5xNHLLXhaEO9LP65D2bcNubFwcCVP0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
