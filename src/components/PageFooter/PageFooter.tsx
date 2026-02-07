import './styles.css';

type PageFooterProps = {
  children: React.ReactNode;
  hideUI?: boolean;
};

export const PageFooter = ({ children, hideUI }: PageFooterProps) => {
  return (
    <footer className={`page-footer ${hideUI ? 'fade-out' : ''}`}>
      <span>{children}</span>
    </footer>
  );
};
