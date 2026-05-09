
export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant h-16 flex justify-between items-center w-full px-container-padding z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="md:hidden text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex text-headline-md font-headline-lg font-bold text-primary">Suporte Técnico</div>
        <div className="relative w-full max-w-md ml-4 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-DEFAULT pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-sm font-body-sm text-on-surface placeholder-outline transition-colors" placeholder="Buscar chamados, artigos, usuários..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant ml-2">
          <img alt="Foto de perfil do usuário" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsYnApcfryQGpgtxWj2aMUPR40jsgSxQtz_2EHzw09eYn0ISi0lDlltsX2-R0E3wAyavQXrlM0-vGzvMqNM6QlJH3HFVH-dlZJuusWu4DrAccYCEBwrf8TSMlm12-2bHouI_w4EY6oKmIK4h4tQ1vinKAA4K2BuArtEiCELlklkMxXisZUebXJld_EfIFTsIWmQ1d6LOvl6Iq--ddBQczjSPnjit3ba9KnLdrND4uoiA3PvXQVVJBdDneK4PalSfmzG1EArRAvlxc"/>
        </div>
      </div>
    </header>
  );
}
