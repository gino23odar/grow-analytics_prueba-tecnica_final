export async function login(email: string, password: string): Promise<void> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Login failed');
    }
  
    const { token } = await response.json();
    localStorage.setItem('authToken', token);
  }
  
  export function logout(): void {
    localStorage.removeItem('authToken');
  }
  
  export function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  export function isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  export async function register(
    usuario: string,
    correo: string,
    contrasena: string,
    rol_id: number,
    nombre: string,
    apell_paterno: string,
    apell_materno: string,
    tipo_usuario: string
  ): Promise<void> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario,
        correo,
        contrasena,
        rol_id,
        nombre,
        apell_paterno,
        apell_materno,
        tipo_usuario,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Registration failed');
    }
  
    // Optionally handle any success logic, like showing a success message or redirecting
  }