import React, { useState, useEffect, useContext } from "react";
import { apiCall } from "../../adminApi";
import { AuthContext } from "../../auth/authContext";
import "./DatabaseJemaatPage.css";

const DatabaseJemaatPage = () => {
  const { user } = useContext(AuthContext);
  const [jemaatList, setJemaatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPeran, setFilterPeran] = useState("");

  // Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pribadi"); // 'pribadi' | 'sakramen' | 'keluarga' | 'pelayanan'
  const [submitting, setSubmitting] = useState(false);

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
        setSuccess(
          `Data jemaat "${formData.namaLengkap}" berhasil diperbarui.`,
        );
      } else {
        await apiCall("/jemaat", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setSuccess(
          `Data jemaat "${formData.namaLengkap}" berhasil ditambahkan.`,
        );
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
      setSuccess(`Data jemaat "${deletingItem.namaLengkap}" berhasil dihapus.`);
      setDeletingItem(null);
      fetchJemaat();
    } catch (err) {
      setError(err.message || "Gagal menghapus data jemaat.");
    } finally {
      setSubmitting(false);
    }
  };

  const isReadOnly = (user?.role || "").toLowerCase() === "users";

  return (
    <div className="database-jemaat-page">
      {/* Header */}
      <div className="jemaat-header">
        <div className="header-title-group">
          <h2>Database &bull; DataJemaat</h2>
          <p>
            Pengelolaan data pribadi, sakramen, keluarga, dan keterlibatan
            pelayanan jemaat GKJ Kebonarum.
          </p>
        </div>
        {!isReadOnly && (
          <button className="admin-btn" onClick={openAddModal}>
            <i className="fas fa-user-plus"></i> Tambah Data Jemaat
          </button>
        )}
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <i className="fas fa-check-circle"></i> {success}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="jemaat-filter-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrap">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="admin-input search-input"
              placeholder="Cari berdasarkan nama, NIK, alamat, HP, atau komisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn search-btn">
            Cari
          </button>
        </form>

        <div className="filter-dropdowns">
          <select
            className="admin-select filter-select"
            value={filterPeran}
            onChange={(e) => setFilterPeran(e.target.value)}
          >
            <option value="">Semua Peran</option>
            <option value="Majelis">Majelis (Diaken & Penatua)</option>
            <option value="Jemaat">Jemaat</option>
          </select>

          <select
            className="admin-select filter-select"
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
            className="admin-select filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Pindah">Pindah</option>
            <option value="Meninggal">Meninggal</option>
          </select>
        </div>
      </div>

      {/* Jemaat Table */}
      <div className="jemaat-table-card">
        {loading ? (
          <div className="jemaat-loading">
            <i className="fas fa-spinner fa-spin"></i> Memuat database jemaat...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="jemaat-table">
              <thead>
                <tr>
                  <th>Peran Gereja</th>
                  <th>Nama & NIK</th>
                  <th>Wilayah & Komisi</th>
                  <th>Kontak & Alamat</th>
                  <th>Status</th>
                  {!isReadOnly && <th style={{ textAlign: "right" }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {jemaatList.length > 0 ? (
                  jemaatList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {/* Peran Gereja Role Pill */}
                        {(() => {
                          const peran = item.peranGereja || "Jemaat";
                          const sub = item.subPeran;
                          if (peran === "Pendeta")
                            return (
                              <span className="peran-pill peran-pendeta">
                                <i className="fas fa-cross"></i> Pendeta
                              </span>
                            );
                          if (peran === "Majelis" && sub === "Penatua")
                            return (
                              <span className="peran-pill peran-penatua">
                                <i className="fas fa-star"></i> Majelis ·
                                Penatua
                              </span>
                            );
                          if (peran === "Majelis" && sub === "Diaken")
                            return (
                              <span className="peran-pill peran-diaken">
                                <i className="fas fa-hands-helping"></i> Majelis
                                · Diaken
                              </span>
                            );
                          if (peran === "Majelis")
                            return (
                              <span className="peran-pill peran-majelis">
                                <i className="fas fa-shield-alt"></i> Majelis
                              </span>
                            );
                          return (
                            <span className="peran-pill peran-jemaat">
                              <i className="fas fa-user"></i> Jemaat
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <div className="jemaat-nama-cell">
                          <span className="jemaat-name">
                            {item.namaLengkap}
                          </span>
                          <span className="jemaat-nik">
                            NIK: {item.nik || "—"}
                          </span>
                          <span className="jemaat-sub-meta">
                            {item.jenisKelamin} &bull; {item.statusPerkawinan || 'Belum Menikah'} &bull; {item.pekerjaan || 'Lainnya'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="jemaat-wilayah-cell">
                          <span className="wilayah-badge">
                            <i className="fas fa-church"></i>{" "}
                            {item.wilayah || "Kebonarum"}
                          </span>
                          <span className="komisi-tag">
                            {item.jabatanPelayanan || item.komisi || "Jemaat"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="jemaat-kontak-cell">
                          <span className="hp-text">
                            <i className="fas fa-phone-alt"></i>{" "}
                            {item.noHp || "—"}
                          </span>
                          <span className="alamat-text">
                            {item.alamat || "—"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-${(item.statusKeanggotaan || "aktif").toLowerCase()}`}
                        >
                          {item.statusKeanggotaan || "Aktif"}
                        </span>
                      </td>
                      {!isReadOnly && (
                        <td className="jemaat-actions-cell">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => openEditModal(item)}
                            title="Edit Data Jemaat"
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => setDeletingItem(item)}
                            title="Hapus Data Jemaat"
                          >
                            <i className="fas fa-trash-alt"></i> Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isReadOnly ? 5 : 6} className="table-empty">
                      Tidak ada data jemaat yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Tabbed Modal */}
      {showModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="admin-modal-panel jemaat-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>
                <i className="fas fa-user-edit modal-icon"></i>
                {editingItem
                  ? `Edit Data Jemaat: ${editingItem.namaLengkap}`
                  : "Tambah Data Jemaat Baru"}
              </h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs Navigation */}
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
                2. Sakramen & Status
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "keluarga" ? "active" : ""}`}
                onClick={() => setActiveTab("keluarga")}
              >
                3. Data Keluarga
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "pelayanan" ? "active" : ""}`}
                onClick={() => setActiveTab("pelayanan")}
              >
                4. Pelayanan & Talenta
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-body">
              {/* Tab 1: Data Pribadi */}
              {activeTab === "pribadi" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Nama Lengkap *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Nama lengkap jemaat"
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
                    <div className="form-group">
                      <label>NIK (Nomor Induk Kependudukan)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="16 digit NIK"
                        value={formData.nik}
                        onChange={(e) =>
                          setFormData({ ...formData, nik: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Tempat Lahir</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Kota / Tempat lahir"
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
                      <label>Tanggal Lahir</label>
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
                    <div className="form-group">
                      <label>Jenis Kelamin</label>
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

                  <div className="form-group">
                    <label>Alamat Lengkap</label>
                    <textarea
                      className="admin-textarea"
                      rows="2"
                      placeholder="Alamat tempat tinggal saat ini"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Status Perkawinan</label>
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
                        <option value="Janda / Duda">Janda / Duda</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Pekerjaan / Profesi</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: Karyawan Swasta, PNS, Wiraswasta"
                        value={formData.pekerjaan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pekerjaan: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Kewarganegaraan</label>
                      <select
                        className="admin-select"
                        value={formData.kewarganegaraan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kewarganegaraan: e.target.value,
                          })
                        }
                      >
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>No. Handphone / WhatsApp</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Contoh: 081234567890"
                      value={formData.noHp}
                      onChange={(e) =>
                        setFormData({ ...formData, noHp: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Sakramen & Keanggotaan */}
              {activeTab === "sakramen" && (
                <div className="tab-pane">
                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Tanggal Baptis</label>
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
                      <label>Tanggal Sidi</label>
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
                    <div className="form-group">
                      <label>Tanggal Pernikahan</label>
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
                  </div>

                  <div className="form-group">
                    <label>Status Keanggotaan *</label>
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
                      <option value="Pindah">Pindah</option>
                      <option value="Meninggal">Meninggal</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 3: Data Keluarga */}
              {activeTab === "keluarga" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Nama Kepala Keluarga</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Nama kepala keluarga"
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
                      <label>No. Kartu Keluarga (KK)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="16 digit Nomor KK"
                        value={formData.noKK}
                        onChange={(e) =>
                          setFormData({ ...formData, noKK: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status Hubungan dalam Keluarga</label>
                    <select
                      className="admin-select"
                      value={formData.statusKeluarga}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statusKeluarga: e.target.value,
                        })
                      }
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Mertua">Mertua</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 4: Pelayanan & Keterlibatan */}
              {activeTab === "pelayanan" && (
                <div className="tab-pane">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Wilayah / Sektor *</label>
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
                      <label>Komisi / Kategori Jemaat</label>
                      <select
                        className="admin-select"
                        value={formData.komisi}
                        onChange={(e) =>
                          setFormData({ ...formData, komisi: e.target.value })
                        }
                      >
                        <option value="Komisi Anak">
                          Komisi Anak (Sekolah Minggu)
                        </option>
                        <option value="Komisi Remaja">Komisi Remaja</option>
                        <option value="Komisi Pemuda">Komisi Pemuda</option>
                        <option value="Komisi Dewasa">Komisi Dewasa</option>
                        <option value="Komisi Wanita / PWG">
                          Komisi Wanita / PWG
                        </option>
                        <option value="Komisi Adiyuswa">
                          Komisi Adiyuswa (Lansia)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Jabatan / Keterlibatan Pelayanan</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Contoh: Penatua, Diaken, Pengajar Sekolah Minggu, Tim Musisi"
                      value={formData.jabatanPelayanan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jabatanPelayanan: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Talenta / Keahlian Khusus</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Contoh: Musik / Gitar, IT / Streaming, Dekorasi, Masak"
                      value={formData.talentaKeahlian}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          talentaKeahlian: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Peran Gereja */}
                  <div className="form-section-divider">
                    <span>Peran dalam Gereja</span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Peran Gereja *</label>
                      <select
                        className="admin-select"
                        value={formData.peranGereja}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            peranGereja: val,
                            subPeran: val === "Jemaat" ? "" : formData.subPeran,
                          });
                        }}
                      >
                        <option value="Jemaat">Jemaat (Anggota Biasa)</option>
                        <option value="Majelis">Majelis</option>
                      </select>
                    </div>

                    {formData.peranGereja === "Majelis" && (
                      <div className="form-group">
                        <label>Sub-Peran Majelis *</label>
                        <select
                          className="admin-select"
                          value={formData.subPeran}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subPeran: e.target.value,
                            })
                          }
                        >
                          <option value="">Pilih Sub-Peran...</option>
                          <option value="Penatua">Penatua</option>
                          <option value="Diaken">Diaken</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Majelis Extra Fields */}
                  {formData.peranGereja === "Majelis" && (
                    <div className="form-group">
                      <label>Periode Jabatan</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: 2023 – 2026"
                        value={formData.periodeJabatan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            periodeJabatan: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>URL Foto / Profil</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="https://... atau kosongkan"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Simpan Data Jemaat
                    </>
                  )}
                </button>
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
            className="admin-modal-panel confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header danger-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i> Hapus Data
                Jemaat
              </h3>
              <button
                className="admin-modal-close"
                onClick={() => setDeletingItem(null)}
              >
                &times;
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Apakah Anda yakin ingin menghapus data jemaat{" "}
                <strong>{deletingItem.namaLengkap}</strong>?
              </p>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setDeletingItem(null)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={handleDeleteItem}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Menghapus...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt"></i> Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseJemaatPage;
