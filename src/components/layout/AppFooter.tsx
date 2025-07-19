export const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Mairie de Cotonou.</span>
            <span>Système de Gestion de la Fourrière Municipale.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Développé avec ❤️ pour la ville de Cotonou</span>
          </div>
        </div>
      </div>
    </footer>
  );
};