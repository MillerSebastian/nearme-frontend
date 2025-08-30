import { Header } from "../components/Header.js";
import { ExcelUpload } from "../components/ExcelUpload.js";

export default class UploadProductsPage {
  render(container) {
    const header = new Header(window.app.authManager);

    container.innerHTML = `
      ${header.render()}
      
      <main class="min-h-screen bg-slate-900 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="flex mb-8" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <a href="#/dashboard" data-route="/dashboard" class="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-white font-medium md:ml-2">Upload Products</span>
                </div>
              </li>
            </ol>
          </nav>

          <div id="upload-content">
            <!-- Content will be rendered by ExcelUpload component -->
          </div>
        </div>
      </main>
    `;

    this.bindEvents();
    this.initializeUpload();
  }

  bindEvents() {
    const header = new Header(window.app.authManager);
    header.bindEvents();
  }

  initializeUpload() {
    const uploadContent = document.getElementById("upload-content");
    const excelUpload = new ExcelUpload();

    uploadContent.innerHTML = excelUpload.render();
    excelUpload.bindEvents();
  }
}
