const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Subsnaskah = sequelize.define(
  'subs_naskahs',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama_naskah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // [UBAH] Kolom untuk URL cover/thumbnail
    gambar_cover: {
      type: DataTypes.STRING,
      allowNull: true, // Boleh kosong jika tidak ada cover
    },
    // [TAMBAH] Kolom untuk URL file dokumen (PDF/DOCX)
    file_dokumen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // [TAMBAH] Untuk menyimpan public_id dari Cloudinary agar bisa dihapus
    public_id_dokumen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // [TAMBAH] Untuk menyimpan nama file asli
    nama_file_asli: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengarang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kategori_naskah: {
      type: DataTypes.ENUM(['naskah', 'buku']),
    },
    // [UBAH] Kolom ini kita gunakan untuk sinopsis/ringkasan, bukan link
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // [HAPUS] Kolom `isi_naskah` bisa dihapus jika isinya sudah ada di file docx/pdf.
    // Atau bisa dipertahankan untuk sinopsis panjang. Kita pertahankan dulu.
    isi_naskah: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Subsnaskah;
