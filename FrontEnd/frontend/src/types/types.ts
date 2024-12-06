export type User = {
    id: number;
    usuario: string;
    correo: string;
    nombre: string;
    apell_paterno: string;
    apell_materno: string;
    tipo_usuario: string;
}

export type UserUpdateData = {
    nombre: string;
    apell_paterno: string;
    apell_materno: string;
    correo: string;
};