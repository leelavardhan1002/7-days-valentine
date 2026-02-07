import './styles.css';

type PageHeaderProps = {
  children: React.ReactNode;
  hideUI?: boolean;
  position?: 'left' | 'center';
};

export const PageHeader = ({ children, hideUI, position = 'left' }: PageHeaderProps) => {
  return (
    <header className={`page-header page-header-${position} ${hideUI ? 'fade-out' : ''}`}>
      <h1 className="page-logo">{children}</h1>
    </header>
  );
};
