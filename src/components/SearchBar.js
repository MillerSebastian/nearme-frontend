export class SearchBar {
  constructor(onSearch) {
    this.onSearch = onSearch;
  }

  render() {
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-4">
            Find Products Near You
          </h1>
          <p class="text-xl text-slate-300">
            Search for products and discover nearby stores that have them available
          </p>
        </div>
        
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search-input"
              class="input-field w-full pl-12 pr-4 py-4 text-lg"
              placeholder="What are you looking for? (e.g., screws, paint, tools...)"
            />
            <button
              id="search-btn"
              class="absolute inset-y-0 right-0 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition-colors duration-200"
            >
              Search
            </button>
          </div>
          
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <button class="search-tag bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
              Hardware
            </button>
            <button class="search-tag bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
              Paint
            </button>
            <button class="search-tag bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
              Tools
            </button>
            <button class="search-tag bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
              Electrical
            </button>
            <button class="search-tag bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
              Plumbing
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const searchTags = document.querySelectorAll(".search-tag");

    // Search button click
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
          this.onSearch(query);
        }
      });
    }

    // Enter key press
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
            this.onSearch(query);
          }
        }
      });
    }

    // Search tags click
    searchTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        const query = tag.textContent.trim();
        if (searchInput) {
          searchInput.value = query;
        }
        this.onSearch(query);
      });
    });
  }
}
