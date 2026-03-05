import { useState } from "react";
import "./WartaFormPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";

const EMPTY_FORM = {
  title: "",
  date: "",
  description: "",
  paragraphs: [""],
};

const WartaFormPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleParagraphChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.paragraphs];
      updated[index] = value;
      return { ...prev, paragraphs: updated };
    });
  };

  const addParagraph = () => {
    setForm((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  };

  const removeParagraph = (index) => {
    setForm((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  const isValid =
    form.title.trim() &&
    form.date &&
    form.description.trim() &&
    form.paragraphs.some((p) => p.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    // Replace this with actual API/persistence logic
    console.log("Warta submitted:", {
      ...form,
      paragraphs: form.paragraphs.filter((p) => p.trim()),
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setSubmitted(false);
  };

  return (
    <>
      <Navbar />
      <main className="warta-form-page">
        <section className="warta-form-hero">
          <div className="warta-form-hero-content">
            <p className="warta-form-kicker">GKJ Kebonarum Klaten</p>
            <h1 className="warta-form-title">
              Input Warta Gereja
              <br />
              GKJ Kebonarum
            </h1>
            <p className="warta-form-lead">
              Isi formulir di bawah untuk menambahkan warta jemaat baru ke arsip
              GKJ Kebonarum.
            </p>
          </div>
        </section>

        <section className="warta-form-section">
          <div className="warta-form-inner">
            <div className="warta-form-card">
              {submitted ? (
                <div className="warta-form-success">
                  <div className="warta-form-success-icon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>Warta Berhasil Disimpan</h3>
                  <p>
                    Warta gereja <strong>{form.title}</strong> telah berhasil
                    disimpan.
                  </p>
                  <button className="warta-form-new-btn" onClick={handleReset}>
                    Input Warta Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="warta-field-row">
                    <div className="warta-field">
                      <label className="warta-label warta-label-required">
                        Judul Warta
                      </label>
                      <input
                        className="warta-input"
                        type="text"
                        placeholder="Warta Gereja Minggu, 1 Maret 2026"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                      />
                    </div>
                    <div className="warta-field">
                      <label className="warta-label warta-label-required">
                        Tanggal
                      </label>
                      <input
                        className="warta-input"
                        type="date"
                        value={form.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="warta-field-full">
                    <label className="warta-label warta-label-required">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      className="warta-textarea"
                      placeholder="Ringkasan singkat isi warta gereja untuk ditampilkan di halaman daftar..."
                      value={form.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="warta-field-full">
                    <p className="warta-paragraphs-label">
                      Isi Warta <span style={{ color: "#c0392b" }}>*</span>
                    </p>
                    <div className="warta-paragraphs">
                      {form.paragraphs.map((para, index) => (
                        <div key={index} className="warta-paragraph-row">
                          <span className="warta-paragraph-number">
                            {index + 1}
                          </span>
                          <textarea
                            className="warta-textarea warta-textarea-content"
                            placeholder={`Paragraf ${index + 1}...`}
                            value={para}
                            onChange={(e) =>
                              handleParagraphChange(index, e.target.value)
                            }
                          />
                          {form.paragraphs.length > 1 && (
                            <button
                              type="button"
                              className="warta-paragraph-remove"
                              onClick={() => removeParagraph(index)}
                              title="Hapus paragraf"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="warta-add-paragraph-btn"
                        onClick={addParagraph}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Paragraf
                      </button>
                    </div>
                  </div>

                  <div className="warta-form-actions">
                    <button
                      type="button"
                      className="warta-form-reset-btn"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="warta-form-submit-btn"
                      disabled={!isValid}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Simpan Warta
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WartaFormPage;
