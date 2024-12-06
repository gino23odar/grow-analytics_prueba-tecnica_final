import { useState } from 'react';
import { Input, Button, message, Modal } from 'antd';

interface CreateUserFormProps {
    visible: boolean; // Type for visibility
    onClose: () => void; // Type for the close function
    onUserCreated: () => void; // Type for the user created callback
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ visible, onClose, onUserCreated }) => {
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellPaterno, setApellPaterno] = useState('');
    const [apellMaterno, setApellMaterno] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');

    const handleCreateUser = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    correo,
                    nombre,
                    apell_paterno: apellPaterno,
                    apell_materno: apellMaterno,
                    tipo_usuario: tipoUsuario,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            message.success('User created successfully!');
            onUserCreated(); // Callback to refresh user list
            onClose(); // Close the modal
        } catch (error) {
            console.error(error);
            message.error('Failed to create user!');
        }
    };

    return (
        <Modal
            title="Create New User"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateUser}>
                    Create
                </Button>,
            ]}
        >
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
            <Input
                placeholder="Tipo de Usuario"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="mb-4"
            />
        </Modal>
    );
};

export default CreateUserForm;