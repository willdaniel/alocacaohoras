import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const RoleGuard = ({ children, allowedRoles }) => {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    // Se o usuário não estiver logado, manda para a página de login.
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se o usuário está logado mas sua função NÃO está na lista de permissões,
    // manda para uma página de "acesso negado" ou para o dashboard.
    if (!allowedRoles.includes(user?.role)) {
        
        // redireciona para a pagina dashborad
        return <Navigate to="/dashboard" replace />;
    }

    // Se passou em todas as verificações, renderiza a página solicitada.
    return children;
};

RoleGuard.propTypes = {
    children: PropTypes.node,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoleGuard;