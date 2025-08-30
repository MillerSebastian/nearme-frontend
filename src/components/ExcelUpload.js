import ProductsService from "../services/products.services.js";

export class ExcelUpload {
  constructor() {
    this.file = null;
    this.mappedData = [];
    this.requiredFields = ["product_name", "price", "category"];
    this.optionalFields = ["product_description"];

    // Initialize products service
    this.productsService = new ProductsService();

    // Get API URL from AuthManager if available
    this.apiUrl =
      window.app?.authManager?.apiUrl || "http://localhost:3000/api";
  }

  render() {
    return `
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">Upload Products from Excel</h2>
            <p class="text-slate-400">
              Upload your Excel file and map the columns to our required fields.
            </p>
          </div>
  
          <!-- Excel Format Instructions -->
          <div class="card mb-6">
            <h3 class="text-lg font-medium text-white mb-4">📋 Required Excel File Format</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Required Fields -->
              <div>
                <h4 class="text-md font-medium text-white mb-3">✅ Required Fields</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                    <span class="text-white font-medium">Product Name</span>
                    <span class="text-slate-400 ml-2">(text)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                    <span class="text-white font-medium">Price</span>
                    <span class="text-slate-400 ml-2">(number, e.g: 15000)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                    <span class="text-white font-medium">Category</span>
                    <span class="text-slate-400 ml-2">(text)</span>
                  </div>
                </div>
              </div>
  
              <!-- Optional Fields -->
              <div>
                <h4 class="text-md font-medium text-white mb-3">📝 Optional Fields</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                    <span class="text-white font-medium">Description</span>
                    <span class="text-slate-400 ml-2">(long text)</span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Example Table -->
            <div class="mt-6">
              <h4 class="text-md font-medium text-white mb-3">📊 Structure Example</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border border-slate-600">
                  <thead class="bg-slate-700">
                    <tr>
                      <th class="px-3 py-2 text-left text-white border-r border-slate-600">Product Name</th>
                      <th class="px-3 py-2 text-left text-white border-r border-slate-600">Price</th>
                      <th class="px-3 py-2 text-left text-white border-r border-slate-600">Category</th>
                      <th class="px-3 py-2 text-left text-white">Description</th>
                    </tr>
                  </thead>
                  <tbody class="bg-slate-800">
                    <tr>
                      <td class="px-3 py-2 text-white border-r border-slate-600">Professional Hammer</td>
                      <td class="px-3 py-2 text-white border-r border-slate-600">25000</td>
                      <td class="px-3 py-2 text-white border-r border-slate-600">Hardware</td>
                      <td class="px-3 py-2 text-white">Steel hammer with ergonomic handle</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 text-white border-r border-slate-600">White Paint 1L</td>
                      <td class="px-3 py-2 text-white border-r border-slate-600">18000</td>
                      <td class="px-3 py-2 text-white border-r border-slate-600">Paint</td>
                      <td class="px-3 py-2 text-white">High quality acrylic paint</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
  
            <!-- Important Notes -->
            <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 class="text-md font-medium text-blue-300 mb-2">⚠️ Important Notes</h4>
              <ul class="text-sm text-blue-200 space-y-1">
                <li>• The first row must contain column names (headers)</li>
                <li>• Prices must be numbers without currency symbols (e.g: 15000, not $15.000)</li>
                <li>• Available categories are: Hardware, Paint, Electrical, Plumbing, Construction, Gardening, Vegetables, Electronics</li>
                <li>• If you don't specify stock, it will be set to 0 by default</li>
                <li>• File must be in .xlsx or .xls format</li>
                <li>• Maximum size: 10MB</li>
              </ul>
            </div>
  
            <!-- Download Template -->
            <div class="mt-4 text-center">
              <button id="download-template" class="btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Example Template
              </button>
            </div>
          </div>
  
          <!-- File Upload Area -->
          <div class="card mb-6">
            <div class="file-upload-area" id="file-upload-area">
              <input type="file" id="excel-file-input" accept=".xlsx,.xls" class="hidden">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 class="text-lg font-medium text-white mb-2">
                  Drag your Excel file here or click to select
                </h3>
                <p class="text-sm text-slate-400">
                  Supported formats: .xlsx, .xls (maximum 10MB)
                </p>
              </div>
            </div>
            
            <div id="file-info" class="hidden mt-4 p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <p class="text-white font-medium" id="file-name"></p>
                    <p class="text-sm text-slate-400" id="file-details"></p>
                  </div>
                </div>
                <button id="remove-file" class="text-red-400 hover:text-red-300 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Column Mapping -->
          <div id="column-mapping" class="hidden">
            <div class="card mb-6">
              <h3 class="text-lg font-medium text-white mb-4">Column Mapping</h3>
              <p class="text-slate-400 mb-6">
                Relate the columns from your Excel file with our required fields.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="mapping-fields">
                <!-- Mapping fields will be generated here -->
              </div>
              
              <div class="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
                <div class="text-sm text-slate-400">
                  <span id="mapped-count">0</span> of <span id="total-fields">4</span> fields mapped
                </div>
                <button id="preview-data" class="btn-primary" disabled>
                  Preview
                </button>
              </div>
            </div>
          </div>
  
          <!-- Data Preview -->
          <div id="data-preview" class="hidden">
            <div class="card mb-6">
              <h3 class="text-lg font-medium text-white mb-4">Data Preview</h3>
              <p class="text-slate-400 mb-6">
                Review the data before importing. The first 10 records will be shown.
              </p>
              
              <div class="overflow-x-auto">
                <table class="w-full text-sm" id="preview-table">
                  <!-- Preview table will be generated here -->
                </table>
              </div>
              
              <div class="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
                <div class="text-sm text-slate-400">
                  <span id="total-records">0</span> products ready to import
                </div>
                <div class="flex space-x-3">
                  <button id="back-to-mapping" class="btn-secondary">
                    Back to Mapping
                  </button>
                  <button id="import-data" class="btn-primary">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Import Products
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Loading State -->
          <div id="loading-state" class="hidden text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-slate-400">Processing file...</p>
          </div>
  
          <!-- Error State -->
          <div id="error-state" class="hidden">
            <div class="card border-red-500 bg-red-900/20">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="text-red-400 font-medium">Error processing file</h3>
                  <p class="text-red-300 text-sm mt-1" id="error-message"></p>
                </div>
              </div>
              <button id="retry-upload" class="btn-outline mt-4">
                Try again
              </button>
            </div>
          </div>
        </div>
      `;
  }

  bindEvents() {
    const fileUploadArea = document.getElementById("file-upload-area");
    const fileInput = document.getElementById("excel-file-input");
    const removeFileBtn = document.getElementById("remove-file");
    const previewBtn = document.getElementById("preview-data");
    const importBtn = document.getElementById("import-data");
    const backBtn = document.getElementById("back-to-mapping");
    const retryBtn = document.getElementById("retry-upload");
    const downloadTemplateBtn = document.getElementById("download-template");

    // File upload events
    fileUploadArea.addEventListener("click", () => fileInput.click());
    fileUploadArea.addEventListener("dragover", this.handleDragOver.bind(this));
    fileUploadArea.addEventListener("drop", this.handleDrop.bind(this));
    fileInput.addEventListener("change", this.handleFileSelect.bind(this));

    if (removeFileBtn) {
      removeFileBtn.addEventListener("click", this.removeFile.bind(this));
    }

    if (previewBtn) {
      previewBtn.addEventListener("click", this.previewData.bind(this));
    }

    if (importBtn) {
      importBtn.addEventListener("click", this.importData.bind(this));
    }

    if (backBtn) {
      backBtn.addEventListener("click", this.showMapping.bind(this));
    }

    if (retryBtn) {
      retryBtn.addEventListener("click", this.resetUpload.bind(this));
    }

    if (downloadTemplateBtn) {
      downloadTemplateBtn.addEventListener(
        "click",
        this.downloadTemplate.bind(this)
      );
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  }

  handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    // Validate file
    if (!this.validateFile(file)) return;

    this.file = file;
    this.showFileInfo(file);
    this.showLoading();

    // Read Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        this.processExcelData(jsonData);
        this.hideLoading();
        this.showMapping();
      } catch (error) {
        this.showError("Error reading Excel file: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      this.showError(
        "Unsupported file type. Only .xlsx and .xls files are allowed"
      );
      return false;
    }

    if (file.size > maxSize) {
      this.showError("File is too large. Maximum size is 10MB");
      return false;
    }

    return true;
  }

  processExcelData(jsonData) {
    if (jsonData.length < 2) {
      this.showError(
        "The file must contain at least one row of data in addition to the headers"
      );
      return;
    }

    this.excelHeaders = jsonData[0];
    this.excelData = jsonData.slice(1);
  }

  showFileInfo(file) {
    const fileInfo = document.getElementById("file-info");
    const fileName = document.getElementById("file-name");
    const fileDetails = document.getElementById("file-details");

    fileName.textContent = file.name;
    fileDetails.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    fileInfo.classList.remove("hidden");
  }

  showMapping() {
    const columnMapping = document.getElementById("column-mapping");
    const mappingFields = document.getElementById("mapping-fields");

    // Generate mapping fields
    const allFields = [...this.requiredFields, ...this.optionalFields];
    mappingFields.innerHTML = allFields
      .map(
        (field) => `
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">
            ${this.getFieldLabel(field)}
            ${
              this.requiredFields.includes(field)
                ? '<span class="text-red-400">*</span>'
                : ""
            }
          </label>
          <select class="input-field w-full mapping-select" data-field="${field}">
            <option value="">-- Select column --</option>
            ${this.excelHeaders
              .map(
                (header, index) => `
              <option value="${index}">${header}</option>
            `
              )
              .join("")}
          </select>
        </div>
      `
      )
      .join("");

    columnMapping.classList.remove("hidden");
    this.bindMappingEvents();
  }

  getFieldLabel(field) {
    const labels = {
      product_name: "Product Name",
      price: "Price",
      category: "Category",
      product_description: "Product Description",
    };
    return labels[field] || field;
  }

  bindMappingEvents() {
    const selects = document.querySelectorAll(".mapping-select");
    selects.forEach((select) => {
      select.addEventListener("change", this.updateMappingProgress.bind(this));
    });
    this.updateMappingProgress();
  }

  updateMappingProgress() {
    const selects = document.querySelectorAll(".mapping-select");
    const mappedCount = Array.from(selects).filter(
      (s) => s.value !== ""
    ).length;
    const requiredMapped = Array.from(selects).filter(
      (s) => this.requiredFields.includes(s.dataset.field) && s.value !== ""
    ).length;

    document.getElementById("mapped-count").textContent = mappedCount;
    document.getElementById("total-fields").textContent = selects.length;

    const previewBtn = document.getElementById("preview-data");
    previewBtn.disabled = requiredMapped < this.requiredFields.length;

    if (!previewBtn.disabled) {
      previewBtn.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      previewBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  previewData() {
    const mapping = this.createMapping();
    this.mappedData = this.mapData(mapping);
    this.showPreview();
  }

  createMapping() {
    const selects = document.querySelectorAll(".mapping-select");
    const mapping = {};

    selects.forEach((select) => {
      if (select.value !== "") {
        mapping[select.dataset.field] = parseInt(select.value);
      }
    });

    return mapping;
  }

  mapData(mapping) {
    return this.excelData.map((row) => {
      const mappedRow = {};

      Object.keys(mapping).forEach((field) => {
        const columnIndex = mapping[field];
        let value = row[columnIndex];

        // Format specific fields
        if (field === "price" && value) {
          value = parseFloat(
            value
              .toString()
              .replace(/[^\d.,]/g, "")
              .replace(",", ".")
          );
        }

        mappedRow[field] = value || "";
      });

      return mappedRow;
    });
  }

  showPreview() {
    const dataPreview = document.getElementById("data-preview");
    const previewTable = document.getElementById("preview-table");
    const totalRecords = document.getElementById("total-records");

    // Show only first 10 records
    const previewData = this.mappedData.slice(0, 10);
    const headers = Object.keys(previewData[0]);

    previewTable.innerHTML = `
        <thead class="bg-slate-700">
          <tr>
            ${headers
              .map(
                (header) => `
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                ${this.getFieldLabel(header)}
              </th>
            `
              )
              .join("")}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          ${previewData
            .map(
              (row) => `
            <tr class="hover:bg-slate-750">
              ${headers
                .map(
                  (header) => `
                <td class="px-4 py-3 text-sm text-white">
                  ${header === "price" ? `$${row[header]}` : row[header]}
                </td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      `;

    totalRecords.textContent = this.mappedData.length;
    dataPreview.classList.remove("hidden");

    // Hide mapping
    document.getElementById("column-mapping").classList.add("hidden");
  }

  async importData() {
    this.showLoading();

    try {
      const response = await this.sendDataToAPI(this.mappedData);

      if (response.success) {
        this.showSuccess(
          response.message ||
            `${this.mappedData.length} products imported successfully`
        );
        setTimeout(() => {
          // Navigate back to dashboard
          if (window.app && window.app.router) {
            window.app.router.navigate("/dashboard");
          }
        }, 2000);
      } else {
        this.showError(response.message || "Error importing data");
      }
    } catch (error) {
      this.showError("Connection error: " + error.message);
    }

    this.hideLoading();
  }

  async sendDataToAPI(data) {
    try {
      // Send products one by one to the products endpoint
      const nit_store = window.app.authManager.currentUser.nit_store;
      let successCount = 0;
      let errorCount = 0;

      for (const product of data) {
        try {
          const productPayload = {
            product_name: product.product_name,
            price: parseFloat(product.price) || 0,
            category: product.category || "Other",
            id_store: nit_store, // Use nit_store as reference
            sold_out: false, // Default in stock
          };

          await this.productsService.addProduct(productPayload);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      if (errorCount === 0) {
        return { success: true, imported: successCount };
      } else {
        return {
          success: true,
          imported: successCount,
          message: `Imported ${successCount} products. ${errorCount} products with errors.`,
        };
      }
    } catch (error) {
      throw new Error("Connection error: " + error.message);
    }
  }

  showLoading() {
    document.getElementById("loading-state").classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loading-state").classList.add("hidden");
  }

  showError(message) {
    document.getElementById("error-message").textContent = message;
    document.getElementById("error-state").classList.remove("hidden");
    this.hideLoading();
  }

  showSuccess(message) {
    // Create success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  removeFile() {
    this.file = null;
    this.resetUpload();
  }

  resetUpload() {
    document.getElementById("file-info").classList.add("hidden");
    document.getElementById("column-mapping").classList.add("hidden");
    document.getElementById("data-preview").classList.add("hidden");
    document.getElementById("error-state").classList.add("hidden");
    document.getElementById("excel-file-input").value = "";
    this.hideLoading();
  }

  downloadTemplate() {
    try {
      // Create example data for template
      const templateData = [
        ["Product Name", "Price", "Category", "Description"],
        [
          "Professional Hammer",
          25000,
          "Hardware",
          "Steel hammer with ergonomic handle",
        ],
        ["White Paint 1L", 18000, "Paint", "High quality acrylic paint"],
        [
          "Electrical Cable 2.5mm",
          12000,
          "Electrical",
          "Cable for electrical installations",
        ],
        ["Adjustable Wrench", 8500, "Hardware", "8-inch adjustable wrench"],
        ["Water Pump", 45000, "Plumbing", "Submersible pump for wells"],
      ];

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(templateData);

      // Adjust column widths
      const columnWidths = [
        { wch: 25 }, // Product Name
        { wch: 12 }, // Price
        { wch: 15 }, // Category
        { wch: 40 }, // Description
      ];
      worksheet["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products Template");

      // Generate file and download
      const fileName = "products_template_nearme.xlsx";
      XLSX.writeFile(workbook, fileName);

      // Show success notification
      this.showSuccess("Template downloaded successfully");
    } catch (error) {
      console.error("Error generating template:", error);
      this.showError("Error generating template: " + error.message);
    }
  }
}
