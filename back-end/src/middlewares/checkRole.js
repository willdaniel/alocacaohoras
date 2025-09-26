const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // O middleware de autenticação já deve ter colocado o usuário em req.user
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Permissão negada. Função não identificada.' });
        }

        const userRole = req.user.role;

        if (allowedRoles.includes(userRole)) {
            // Se a função do usuário está na lista de permissões, prossiga.
            next();
        } else {
            // Se não, retorne um erro de "Proibido".
            return res.status(403).json({ message: 'Você não tem permissão para acessar este recurso.' });
        }
    };
};

export default checkRole;