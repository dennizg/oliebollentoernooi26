
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvobjemdvaymohuyvlhe.supabase.co';
const supabaseKey = 'sb_publishable_-82lH9MnRv2Kd6DUrteTAQ_f0I6rAas';

export const supabase = createClient(supabaseUrl, supabaseKey);
