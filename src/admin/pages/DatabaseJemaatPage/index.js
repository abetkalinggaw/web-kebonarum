import React, { useState, useEffect, useContext } from "react";
import { apiCall } from "../../adminApi";
import { AuthContext } from "../../auth/authContext";
import { AdminToastContext } from "../../components/AdminLayout";
import "./DatabaseJemaatPage.css";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  Edit,
  Grid,
  IdCard,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  Loader,
  Phone,
  Printer,
  Save,
  Search,
  Shield,
  Trash2,
  Upload,
  UserPlus,
  X,
  FileSpreadsheet,
} from "lucide-react";

const DatabaseJemaatPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(AdminToastContext);
  const [jemaatList, setJemaatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPeran, setFilterPeran] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Selected Items for Batch Action
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pribadi");
  const [submitting, setSubmitting] = useState(false);

  // Kartu Jemaat Modal State
  const [cardItem, setCardItem] = useState(null);

  // Delete State
  const [deletingItem, setDeletingItem] = useState(null);

  const initialForm = {
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki",
    alamat: "",
    noHp: "",
    tanggalBaptis: "",
    tanggalSidi: "",
    tanggalNikah: "",
    statusKeanggotaan: "Aktif",
    kewarganegaraan: "WNI",
    statusPerkawinan: "Belum Menikah",
    pekerjaan: "",
    namaKepalaKeluarga: "",
    statusKeluarga: "Kepala Keluarga",
    noKK: "",
    komisi: "Komisi Dewasa",
    wilayah: "Sumberejo",
    jabatanPelayanan: "",
    talentaKeahlian: "",
    peranGereja: "Jemaat",
    subPeran: "",
    gelar: "",
    pendidikan: "",
    periodeJabatan: "",
    imageUrl: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchJemaat = async () => {
    setLoading(true);
    setError("");
    try {
      let query = "?";
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (filterWilayah)
        query += `wilayah=${encodeURIComponent(filterWilayah)}&`;
      if (filterStatus) query += `status=${encodeURIComponent(filterStatus)}&`;
      if (filterPeran)
        query += `peranGereja=${encodeURIComponent(filterPeran)}&`;

      const data = await apiCall(`/jemaat${query}`);
      setJemaatList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Gagal memuat data jemaat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJemaat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWilayah, filterStatus, filterPeran]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJemaat();
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setActiveTab("pribadi");
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      namaLengkap: item.namaLengkap || "",
      nik: item.nik || "",
      tempatLahir: item.tempatLahir || "",
      tanggalLahir: item.tanggalLahir || "",
      jenisKelamin: item.jenisKelamin || "Laki-laki",
      alamat: item.alamat || "",
      noHp: item.noHp || "",
      tanggalBaptis: item.tanggalBaptis || "",
      tanggalSidi: item.tanggalSidi || "",
      tanggalNikah: item.tanggalNikah || "",
      statusKeanggotaan: item.statusKeanggotaan || "Aktif",
      kewarganegaraan: item.kewarganegaraan || "WNI",
      statusPerkawinan: item.statusPerkawinan || "Belum Menikah",
      pekerjaan: item.pekerjaan || "",
      namaKepalaKeluarga: item.namaKepalaKeluarga || "",
      statusKeluarga: item.statusKeluarga || "Kepala Keluarga",
      noKK: item.noKK || "",
      komisi: item.komisi || "Komisi Dewasa",
      wilayah: item.wilayah || "Sumberejo",
      jabatanPelayanan: item.jabatanPelayanan || "",
      talentaKeahlian: item.talentaKeahlian || "",
      peranGereja: item.peranGereja || "Jemaat",
      subPeran: item.subPeran || "",
      gelar: item.gelar || "",
      pendidikan: item.pendidikan || "",
      periodeJabatan: item.periodeJabatan || "",
      imageUrl: item.imageUrl || "",
    });
    setActiveTab("pribadi");
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingItem) {
        await apiCall(`/jemaat/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        const msg = `Data jemaat "${formData.namaLengkap}" berhasil diperbarui.`;
        setSuccess(msg);
        showToast(msg, "success");
      } else {
        await apiCall("/jemaat", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        const msg = `Data jemaat "${formData.namaLengkap}" berhasil ditambahkan.`;
        setSuccess(msg);
        showToast(msg, "success");
      }

      setShowModal(false);
      fetchJemaat();
    } catch (err) {
      setError(err.message || "Gagal menyimpan data jemaat.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await apiCall(`/jemaat/${deletingItem.id}`, {
        method: "DELETE",
      });
      const msg = `Data jemaat "${deletingItem.namaLengkap}" berhasil dihapus.`;
      setSuccess(msg);
      showToast(msg, "success");
      setDeletingItem(null);
      fetchJemaat();
    } catch (err) {
      setError(err.message || "Gagal menghapus data jemaat.");
    } finally {
      setSubmitting(false);
    }
  };

  // Export CSV Helper
  const exportToCSV = () => {
    const dataToExport =
      selectedIds.length > 0
        ? jemaatList.filter((j) => selectedIds.includes(j.id))
        : jemaatList;

    if (dataToExport.length === 0) {
      showToast("Tidak ada data untuk diekspor", "danger");
      return;
    }

    const headers = [
      "ID",
      "NIK",
      "Nama Lengkap",
      "Peran Gereja",
      "Sub Peran",
      "Wilayah",
      "Komisi",
      "Status Keanggotaan",
      "Jenis Kelamin",
      "No HP",
      "Alamat",
      "Status Perkawinan",
    ];

    const rows = dataToExport.map((j) => [
      j.id,
      `"${j.nik || ""}"`,
      `"${j.namaLengkap || ""}"`,
      `"${j.peranGereja || ""}"`,
      `"${j.subPeran || ""}"`,
      `"${j.wilayah || ""}"`,
      `"${j.komisi || ""}"`,
      `"${j.statusKeanggotaan || ""}"`,
      `"${j.jenisKelamin || ""}"`,
      `"${j.noHp || ""}"`,
      `"${(j.alamat || "").replace(/"/g, '""')}"`,
      `"${j.statusPerkawinan || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Data_Jemaat_GKJ_Kebonarum_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      `Berhasil mengekspor ${dataToExport.length} data jemaat ke CSV`,
      "success",
    );
  };

  const isReadOnly = (user?.role || "").toLowerCase() === "users";

  const getPeranBadgeClass = (peran) => {
    const p = (peran || "").toLowerCase();
    if (p.includes("pendeta")) return "peran-pendeta";
    if (p.includes("penatua")) return "peran-penatua";
    if (p.includes("diaken")) return "peran-diaken";
    if (p.includes("majelis")) return "peran-majelis";
    return "peran-jemaat";
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(jemaatList.map((j) => j.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="database-jemaat-page">
      {/* Header */}
      <div className="jemaat-header">
        <div className="header-title-group">
          <h2>Database &bull; Digital Jemaat</h2>
          <p>
            Pengelolaan data pribadi, sakramen, keluarga, dan komisi pelayanan
            jemaat GKJ Kebonarum.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            className="admin-btn secondary"
            onClick={exportToCSV}
            title="Ekspor Data ke CSV"
          >
            <FileSpreadsheet size={17} /> Ekspor CSV (
            {selectedIds.length > 0 ? selectedIds.length : "Semua"})
          </button>
          {!isReadOnly && (
            <button className="admin-btn" onClick={openAddModal}>
              <UserPlus size={18} /> Tambah Data Jemaat
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-alert error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* 2-Row Filter Card */}
      <div className="admin-filter-card">
        {/* Row 1: Search input bar and search button */}
        <form onSubmit={handleSearchSubmit} className="admin-filter-row-1">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="admin-input search-input"
              placeholder="Cari berdasarkan nama, NIK, alamat, HP, atau komisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn search-btn">
            <Search size={16} /> Cari
          </button>
        </form>

        {/* Row 2: Filters and view mode toggle */}
        <div className="admin-filter-row-2">
          <div className="admin-filter-dropdowns">
            <select
              className="admin-select admin-filter-select"
              value={filterPeran}
              onChange={(e) => setFilterPeran(e.target.value)}
            >
              <option value="">Semua Peran</option>
              <option value="Majelis">Majelis (Diaken & Penatua)</option>
              <option value="Jemaat">Jemaat</option>
            </select>

            <select
              className="admin-select admin-filter-select"
              value={filterWilayah}
              onChange={(e) => setFilterWilayah(e.target.value)}
            >
              <option value="">Semua Wilayah</option>
              <option value="Sumberejo">Sumberejo</option>
              <option value="Krosok">Krosok</option>
              <option value="Pluneng">Pluneng</option>
              <option value="Ngrundul">Ngrundul</option>
              <option value="Prayan">Prayan</option>
            </select>

            <select
              className="admin-select admin-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Pindah">Pindah</option>
              <option value="Meninggal">Meninggal</option>
            </select>
          </div>

          <div className="admin-view-toggle">
            <button
              type="button"
              className={`admin-view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Tampilan Tabel"
            >
              <List size={15} /> <span>Tabel</span>
            </button>
            <button
              type="button"
              className={`admin-view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Tampilan Kartu"
            >
              <Grid size={15} /> <span>Kartu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Jemaat Table / Card Grid */}
      <div className="jemaat-table-card">
        {loading ? (
          <div className="jemaat-loading">
            <Loader
              size={20}
              className="fa-spin"
              style={{ color: "var(--admin-accent)", marginRight: "8px" }}
            />
            Memuat database jemaat...
          </div>
        ) : viewMode === "table" ? (
          <div className="table-responsive">
            <table className="jemaat-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === jemaatList.length
                      }
                    />
                  </th>
                  <th>Peran Gereja</th>
                  <th>Nama & NIK</th>
                  <th>Wilayah & Komisi</th>
                  <th>Kontak & Alamat</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jemaatList.length > 0 ? (
                  jemaatList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </td>
                      <td>
                        <span
                          className={`peran-pill ${getPeranBadgeClass(item.peranGereja)}`}
                        >
                          <Shield size={13} />
                          {item.subPeran || item.peranGereja || "Jemaat"}
                        </span>
                      </td>
                      <td>
                        <div className="jemaat-nama-cell">
                          <span className="jemaat-name">
                            {item.namaLengkap}
                          </span>
                          <span className="jemaat-nik">
                            NIK: {item.nik || "-"}
                          </span>
                          {item.tanggalLahir && (
                            <span className="jemaat-sub-meta">
                              {item.tempatLahir ? `${item.tempatLahir}, ` : ""}
                              {item.tanggalLahir}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="jemaat-wilayah-cell">
                          <span className="wilayah-badge">
                            {item.wilayah || "Sumberejo"}
                          </span>
                          <span className="komisi-tag">
                            {item.komisi || "Komisi Dewasa"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="jemaat-kontak-cell">
                          {item.noHp && (
                            <span className="hp-text">
                              <Phone size={14} /> {item.noHp}
                            </span>
                          )}
                          <span className="alamat-text">
                            {item.alamat || "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-${(
                            item.statusKeanggotaan || "Aktif"
                          ).toLowerCase()}`}
                        >
                          {item.statusKeanggotaan || "Aktif"}
                        </span>
                      </td>
                      <td>
                        <div className="jemaat-actions-cell">
                          <button
                            className="admin-btn secondary sm"
                            onClick={() => setCardItem(item)}
                            title="Kartu Anggota"
                          >
                            <IdCard size={15} />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                className="admin-btn secondary sm"
                                onClick={() => openEditModal(item)}
                                title="Edit Data"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                className="admin-btn danger sm"
                                onClick={() => setDeletingItem(item)}
                                title="Hapus Data"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="table-empty">
                      Tidak ada data jemaat yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards Grid Mode */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
              padding: "1.5rem",
            }}
          >
            {jemaatList.map((item) => (
              <div
                key={item.id}
                className="admin-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`peran-pill ${getPeranBadgeClass(item.peranGereja)}`}
                  >
                    <Shield size={13} />{" "}
                    {item.subPeran || item.peranGereja || "Jemaat"}
                  </span>
                  <span
                    className={`status-pill status-${(item.statusKeanggotaan || "Aktif").toLowerCase()}`}
                  >
                    {item.statusKeanggotaan || "Aktif"}
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      margin: "0 0 0.2rem",
                      fontFamily: "var(--admin-font-heading)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.namaLengkap}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      color: "var(--admin-accent)",
                      fontFamily: "var(--admin-font-mono)",
                    }}
                  >
                    NIK: {item.nik || "-"}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--admin-text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  }}
                >
                  <div>
                    <strong>Wilayah:</strong> {item.wilayah || "Sumberejo"}
                  </div>
                  <div>
                    <strong>Komisi:</strong> {item.komisi || "Komisi Dewasa"}
                  </div>
                  {item.noHp && (
                    <div>
                      <strong>HP:</strong> {item.noHp}
                    </div>
                  )}
                  {item.alamat && (
                    <div>
                      <strong>Alamat:</strong> {item.alamat}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "auto",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--admin-border)",
                  }}
                >
                  <button
                    className="admin-btn secondary sm"
                    style={{ flex: 1 }}
                    onClick={() => setCardItem(item)}
                  >
                    <IdCard size={14} /> Kartu
                  </button>
                  {!isReadOnly && (
                    <>
                      <button
                        className="admin-btn secondary sm"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="admin-btn danger sm"
                        onClick={() => setDeletingItem(item)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kartu Anggota Jemaat Modal */}
      {cardItem && (
        <div className="admin-modal-overlay" onClick={() => setCardItem(null)}>
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", padding: "0", overflow: "hidden" }}
          >
            <div
              style={{
                background: "#1A2821",
                color: "#F4F6F4",
                padding: "1.5rem",
                position: "relative",
              }}
            >
              <button
                onClick={() => setCardItem(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    background: "var(--admin-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {cardItem.namaLengkap?.charAt(0) || "J"}
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontFamily: "var(--admin-font-heading)",
                    }}
                  >
                    Gereja Kristen Jawa Kebonarum
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--admin-accent)",
                      fontFamily: "var(--admin-font-mono)",
                    }}
                  >
                    KARTU TANDA ANGGOTA JEMAAT
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  fontSize: "0.88rem",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    NAMA LENGKAP
                  </span>
                  <strong>{cardItem.namaLengkap}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    NIK
                  </span>
                  <strong
                    style={{
                      fontFamily: "var(--admin-font-mono)",
                      color: "var(--admin-accent)",
                    }}
                  >
                    {cardItem.nik || "-"}
                  </strong>
                </div>
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    WILAYAH
                  </span>
                  <strong>{cardItem.wilayah || "Sumberejo"}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    KOMISI
                  </span>
                  <strong>{cardItem.komisi || "Komisi Dewasa"}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    PERAN GEREJA
                  </span>
                  <strong>
                    {cardItem.subPeran || cardItem.peranGereja || "Jemaat"}
                  </strong>
                </div>
                <div>
                  <span
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    STATUS
                  </span>
                  <strong>{cardItem.statusKeanggotaan || "Aktif"}</strong>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px dashed var(--admin-border)",
                  paddingTop: "0.75rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--admin-text-muted)",
                  }}
                >
                  GKJ Kebonarum &bull; Klaten, Jawa Tengah
                </span>
                <button className="admin-btn sm" onClick={() => window.print()}>
                  <Printer size={14} /> Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="admin-modal-content jemaat-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="admin-modal-header"
              style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--admin-border)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>
                {editingItem
                  ? `Edit Jemaat: ${editingItem.namaLengkap}`
                  : "Tambah Data Jemaat Baru"}
              </h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="modal-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === "pribadi" ? "active" : ""}`}
                onClick={() => setActiveTab("pribadi")}
              >
                1. Data Pribadi
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "sakramen" ? "active" : ""}`}
                onClick={() => setActiveTab("sakramen")}
              >
                2. Data Sakramen
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "keluarga" ? "active" : ""}`}
                onClick={() => setActiveTab("keluarga")}
              >
                3. Keluarga & Wilayah
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "pelayanan" ? "active" : ""}`}
                onClick={() => setActiveTab("pelayanan")}
              >
                4. Pelayanan & Talenta
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "foto" ? "active" : ""}`}
                onClick={() => setActiveTab("foto")}
              >
                5. Foto Diri
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: "1.5rem" }}>
              {/* Tab 1: Data Pribadi */}
              {activeTab === "pribadi" && (
                <div className="tab-pane">
                  <div className="form-group">
                    <label className="admin-input-label">
                      Nama Lengkap (dengan Gelar jika ada)
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Contoh: Bpk. Sugeng Wibowo, S.Th."
                      value={formData.namaLengkap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          namaLengkap: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        NIK (16 Digit)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="3310..."
                        value={formData.nik}
                        onChange={(e) =>
                          setFormData({ ...formData, nik: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">Jenis Kelamin</label>
                      <select
                        className="admin-select"
                        value={formData.jenisKelamin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jenisKelamin: e.target.value,
                          })
                        }
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">Tempat Lahir</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Klaten"
                        value={formData.tempatLahir}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tempatLahir: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">Tanggal Lahir</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={formData.tanggalLahir}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tanggalLahir: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        No. Telepon / WhatsApp
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="0812..."
                        value={formData.noHp}
                        onChange={(e) =>
                          setFormData({ ...formData, noHp: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">Pekerjaan</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="PNS / Swasta / Guru"
                        value={formData.pekerjaan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pekerjaan: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="admin-input-label">
                      Alamat Tempat Tinggal
                    </label>
                    <textarea
                      className="admin-textarea"
                      rows="2"
                      placeholder="Dukuh, RT/RW, Desa, Kebonarum, Klaten"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Data Sakramen */}
              {activeTab === "sakramen" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        Tanggal Baptis
                      </label>
                      <input
                        type="date"
                        className="admin-input"
                        value={formData.tanggalBaptis}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tanggalBaptis: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">Tanggal Sidi</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={formData.tanggalSidi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tanggalSidi: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        Tanggal Pernikahan Gerejawi
                      </label>
                      <input
                        type="date"
                        className="admin-input"
                        value={formData.tanggalNikah}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tanggalNikah: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">
                        Status Perkawinan
                      </label>
                      <select
                        className="admin-select"
                        value={formData.statusPerkawinan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            statusPerkawinan: e.target.value,
                          })
                        }
                      >
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Janda/Duda">Janda/Duda</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="admin-input-label">
                      Status Keanggotaan Gereja
                    </label>
                    <select
                      className="admin-select"
                      value={formData.statusKeanggotaan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statusKeanggotaan: e.target.value,
                        })
                      }
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Pindah">Pindah Gereja</option>
                      <option value="Meninggal">Meninggal Dunia</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 3: Keluarga & Wilayah */}
              {activeTab === "keluarga" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        Wilayah / Sektor Jemaat
                      </label>
                      <select
                        className="admin-select"
                        value={formData.wilayah}
                        onChange={(e) =>
                          setFormData({ ...formData, wilayah: e.target.value })
                        }
                      >
                        <option value="Sumberejo">Sumberejo</option>
                        <option value="Krosok">Krosok</option>
                        <option value="Pluneng">Pluneng</option>
                        <option value="Ngrundul">Ngrundul</option>
                        <option value="Prayan">Prayan</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">Komisi Jemaat</label>
                      <select
                        className="admin-select"
                        value={formData.komisi}
                        onChange={(e) =>
                          setFormData({ ...formData, komisi: e.target.value })
                        }
                      >
                        <option value="Anak (Sekolah Minggu)">
                          Anak (Sekolah Minggu)
                        </option>
                        <option value="Remaja">Komisi Remaja</option>
                        <option value="Pemuda">Komisi Pemuda</option>
                        <option value="Komisi Dewasa">Komisi Dewasa</option>
                        <option value="Komisi Lansia (Adi Yuswa)">
                          Komisi Lansia (Adi Yuswa)
                        </option>
                        <option value="Komisi Perempuann (PWG)">
                          Komisi Perempuan (PWG)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        Nama Kepala Keluarga (KK)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Nama KK"
                        value={formData.namaKepalaKeluarga}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            namaKepalaKeluarga: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">
                        No. Kartu Keluarga (KK)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="3310..."
                        value={formData.noKK}
                        onChange={(e) =>
                          setFormData({ ...formData, noKK: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Pelayanan & Talenta */}
              {activeTab === "pelayanan" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="admin-input-label">
                        Peran Utama Gereja
                      </label>
                      <select
                        className="admin-select"
                        value={formData.peranGereja}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            peranGereja: e.target.value,
                          })
                        }
                      >
                        <option value="Jemaat">Jemaat Umum</option>
                        <option value="Majelis">Majelis Gereja</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="admin-input-label">
                        Sub Peran (Diaken / Penatua / Pendeta)
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: Penatua Wilayah Sumberejo"
                        value={formData.subPeran}
                        onChange={(e) =>
                          setFormData({ ...formData, subPeran: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="admin-input-label">
                      Talenta & Keahlian Khusus
                    </label>
                    <textarea
                      className="admin-textarea"
                      rows="2"
                      placeholder="Contoh: Musik (Organ/Gitar), Sound System, Multimedia, Mengajar..."
                      value={formData.talentaKeahlian}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          talentaKeahlian: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Foto Diri (Majelis & Kartu Jemaat) */}
              {activeTab === "foto" && (
                <div className="tab-pane">
                  <div className="foto-upload-notice">
                    <Camera size={18} />
                    <span>
                      Foto ini digunakan untuk <strong>Kartu Jemaat</strong> dan{" "}
                      <strong>Profil Struktur Majelis</strong> di website
                      publik.
                    </span>
                  </div>

                  <div className="foto-upload-container">
                    <div
                      className="dropzone-area"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("drag-over");
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("drag-over");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("drag-over");
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onload = (loadEvent) => {
                              setFormData({
                                ...formData,
                                imageUrl: loadEvent.target.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          } else {
                            showToast(
                              "Silakan pilih file gambar (JPG/PNG/WEBP).",
                              "error",
                            );
                          }
                        }
                      }}
                    >
                      {formData.imageUrl ? (
                        <div className="foto-preview-wrapper">
                          <img
                            src={formData.imageUrl}
                            alt="Preview Foto"
                            className="foto-preview-img"
                          />
                          <button
                            type="button"
                            className="remove-foto-btn"
                            title="Hapus / Ganti Foto"
                            onClick={() =>
                              setFormData({ ...formData, imageUrl: "" })
                            }
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="dropzone-content">
                          <div className="upload-icon-circle">
                            <Upload size={24} />
                          </div>
                          <p className="dropzone-title">
                            Tarik & Lepas Foto di Sini
                          </p>
                          <p className="dropzone-sub">
                            atau klik tombol di bawah untuk memilih file dari
                            komputer
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        id="fotoFileInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (loadEvent) => {
                              setFormData({
                                ...formData,
                                imageUrl: loadEvent.target.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      <div className="dropzone-actions">
                        <label
                          htmlFor="fotoFileInput"
                          className="admin-btn secondary select-file-btn"
                        >
                          <ImageIcon size={16} /> Pilih File Gambar
                        </label>
                      </div>
                    </div>

                    <div className="form-group margin-top-md">
                      <label className="admin-input-label">
                        <LinkIcon
                          size={14}
                          style={{ display: "inline", marginRight: "4px" }}
                        />{" "}
                        Atau Masukkan URL Foto Online
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="https://domain.com/foto-jemaat.jpg"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--admin-border)",
                }}
              >
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <div
                  onClick={(e) => {
                    if (!formData.namaLengkap?.trim()) {
                      e.preventDefault();
                      showToast("Harap isi Nama Lengkap Jemaat", "warning");
                    }
                  }}
                  style={{ display: "inline-block" }}
                >
                  <button
                    type="submit"
                    className="admin-btn"
                    disabled={submitting || !formData.namaLengkap?.trim()}
                    style={{
                      opacity: !formData.namaLengkap?.trim() ? 0.5 : 1,
                      cursor: !formData.namaLengkap?.trim() ? "not-allowed" : "pointer",
                      background: !formData.namaLengkap?.trim() ? "#9ca3af" : undefined,
                      borderColor: !formData.namaLengkap?.trim() ? "#9ca3af" : undefined,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader size={18} className="fa-spin" /> Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Simpan Data Jemaat
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div
          className="admin-modal-overlay"
          onClick={() => setDeletingItem(null)}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "450px", padding: "1.5rem" }}
          >
            <h3
              style={{
                margin: "0 0 0.75rem",
                color: "var(--admin-danger)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertTriangle size={20} /> Konfirmasi Hapus Data
            </h3>
            <p
              style={{
                margin: "0 0 1.25rem",
                fontSize: "0.92rem",
                color: "var(--admin-text-secondary)",
              }}
            >
              Apakah Anda yakin ingin menghapus data jemaat{" "}
              <strong>{deletingItem.namaLengkap}</strong>? Data yang dihapus
              tidak dapat dikembalikan.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                className="admin-btn secondary"
                onClick={() => setDeletingItem(null)}
                disabled={submitting}
              >
                Batal
              </button>
              <button
                className="admin-btn danger"
                onClick={handleDeleteItem}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader size={18} className="fa-spin" />
                ) : (
                  <Trash2 size={18} />
                )}{" "}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseJemaatPage;
