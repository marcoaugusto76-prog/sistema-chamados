import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cadcovjbfduqaussgjvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZGNvdmpiZmR1cWF1c3NnanZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzY2ODYsImV4cCI6MjA5MzkxMjY4Nn0.-S5pZ-fMxaZvyAjN5_7oEX2VEGRYyQ9FHXNnVclkj74';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@example.com',
    password: 'admin123456',
    options: {
      data: {
        full_name: 'Administrador',
        role: 'admin'
      }
    }
  });

  if (error) {
    console.error('Erro ao criar admin:', error);
  } else {
    console.log('Admin criado com sucesso!', data.user?.id);
  }
}

main();
