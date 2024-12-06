import { useState } from 'react';
import { Input, Button, message } from 'antd';
import { updateUser } from '@/utils/api';
import { User } from '@/types/types';

interface EditUserFormProps {
    user: User;
    onUserUpdated: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated }) => {
    const [usuario, setUsuario] = useState(user.usuario);
    const [correo, setCorreo] = useState(user.correo);
    const [nombre, setNombre] = useState(user.nombre);
    const [apellPaterno, setApellPaterno] = useState(user.apell_paterno);
    const [apellMaterno, setApellMaterno] = useState(user.apell_materno);

    const handleSave = async () => {
        try {
            const updatedData = {
                ...user,
                usuario,
                correo,
                nombre,
                apell_paterno: apellPaterno,
                apell_materno: apellMaterno,
            };
            await updateUser(user.id, updatedData);
            message.success('User updated successfully!');
            onUserUpdated();
        } catch (error) {
            console.error(error);
            message.error('Failed to update user!');
        }
    };

    return (
        <div>
            <Input
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="mb-4"
            />
            <Input
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mb-4"
            />
            <Input
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mb-4"
            />
            <Input
                placeholder="Apellido Paterno"
                value={apellPaterno}
                onChange={(e) => setApellPaterno(e.target.value)}
                className="mb-4"
            />
            <Input
                placeholder="Apellido Materno"
                value={apellMaterno}
                onChange={(e) => setApellMaterno(e.target.value)}
                className="mb-4"
            />
            <Button type="primary" onClick={handleSave}>
                Save
            </Button>
        </div>
    );
};

export default EditUserForm; 