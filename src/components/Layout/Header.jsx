import { useAuth } from '../../contexts/AuthContext';
import TofuButton from '../UI/TofuButton';
import './Header.css';

export default function Header({ title, collapsed }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header
      className="header"
      style={{ left: collapsed ? 72 : 260 }}
    >
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
      </div>
      <div className="header__right">
        {isAdmin && (
          <span className="header__admin-badge">👑 管理員</span>
        )}
        <span className="header__greeting">
          你好，{user?.employeeName}
        </span>
        <TofuButton variant="ghost" size="sm" onClick={logout}>
          登出
        </TofuButton>
      </div>
    </header>
  );
}
