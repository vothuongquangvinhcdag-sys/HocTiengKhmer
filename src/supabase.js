import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ogzplxgwshztvwreqalg.supabase.co'
const supabaseKey = 'sb_publishable_dB7NWlOCPke77gMz4bSM-w_zcwEH0uC'

export const supabase = createClient(supabaseUrl, supabaseKey)