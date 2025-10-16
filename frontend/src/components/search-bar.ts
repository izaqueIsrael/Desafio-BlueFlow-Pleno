export class SearchBar {
  private onSearch: (query: string) => void;

  constructor(onSearch: (query: string) => void) {
    this.onSearch = onSearch;
  }

  render(): string {
    return `
      <div class="search-bar">
        <form id="search-form" class="search-form">
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Buscar vídeos no YouTube..."
            required
            minlength="2"
          />
          <button type="submit" class="btn btn-primary">
            <img src="/assets/search.svg" alt="Buscar" class="btn-icon" />
            Buscar
          </button>
        </form>
      </div>
    `;
  }

  attachEvents(): void {
    const form = document.getElementById('search-form') as HTMLFormElement;
    const input = document.getElementById('search-input') as HTMLInputElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        this.onSearch(query);
      }
    });
  }
}