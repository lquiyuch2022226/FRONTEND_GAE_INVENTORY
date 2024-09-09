import { useUserDetails } from "../../shared/hooks/useUserDetails";

export const RoleBasedLinks = () => {

  const { role, logout } = useUserDetails();

  const renderLinks = () => {
    switch (role) {
      case "ADMIN_ROLE":
        return (
          <>
            <a href="/profile">Perfil</a>
            <a href="/dashboard/post">POST's</a>
            <a href="/notes">Notas</a>
            <div className="logout-container">
              <input onClick={logout} type="button" value="Logout" />
            </div>
          </>
        );
      case "USER_ROLE":
        return (
          <>
            <a href="/profile">Perfil</a>
            <a href="/dashboard/postList">Posteos</a>
            <div className="logout-container">
              <input onClick={logout} type="button" value="Logout" />
            </div>
          </>
        );
      case "SUPPORTER_ROLE":
        return (
          <>
            <a href="/profile">Perfil</a>
            <a href="/patients">Pacientes</a>
            <div className="logout-container">
              <input onClick={logout} type="button" value="Logout" />
            </div>
          </>
        );
      default:
        return <a href="/404">404 Not Found</a>;
    }
  };

  return <div className="dropdown-content">{renderLinks()}</div>;
};