const multer = require('multer');
const axios = require('axios');
const Subsnaskah = require('../models/subsnaskahModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper'); // Mengimpor file helper yang sudah diperbarui

// 1. Konfigurasi Multer
const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSubsnaskahFiles = upload.fields([
  { name: 'gambar_cover', maxCount: 1 },
  { name: 'file_dokumen', maxCount: 1 },
]);

// 2. Membuat Naskah Baru (CREATE)
exports.createSubsnaskah = catchAsync(async (req, res, next) => {
  const { nama_naskah, pengarang, kategori_naskah, isi_naskah } = req.body;

  if (!req.files || !req.files.file_dokumen) {
    return next(new AppError('File dokumen (PDF/DOCX) wajib diunggah.', 400));
  }
  if (!nama_naskah) {
    return next(new AppError('Judul naskah wajib diisi.', 400));
  }

  // Menggunakan fileHelper untuk upload dokumen, otomatis set resource_type: 'raw'
  const docFile = req.files.file_dokumen[0];
  const uploadedDoc = await fileHelper.upload(docFile.buffer, 'documents');
  if (!uploadedDoc) return next(new AppError('Gagal mengunggah dokumen.', 500));

  let coverUrl = '';
  // Menggunakan fileHelper untuk upload gambar, otomatis set resource_type: 'auto'
  if (req.files.gambar_cover) {
    const coverFile = req.files.gambar_cover[0];
    const uploadedCover = await fileHelper.upload(coverFile.buffer, 'covers');
    if (uploadedCover) coverUrl = uploadedCover.secure_url;
  }

  const subsnaskah = await Subsnaskah.create({
    nama_naskah,
    pengarang,
    kategori_naskah,
    isi_naskah,
    gambar_cover: coverUrl,
    file_dokumen: uploadedDoc.secure_url,
    public_id_dokumen: uploadedDoc.public_id,
    nama_file_asli: docFile.originalname,
  });

  res.status(201).json({
    status: 'success',
    data: subsnaskah,
  });
});

// 3. Mengambil Semua Naskah (READ ALL)
exports.getAllSubsnaskah = catchAsync(async (req, res, next) => {
  const allNaskah = await Subsnaskah.findAll({
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({
    status: 'success',
    results: allNaskah.length,
    data: allNaskah,
  });
});

// 4. Mengambil Satu Naskah (READ ONE)
exports.getSubsnaskah = catchAsync(async (req, res, next) => {
  const naskah = await Subsnaskah.findByPk(req.params.id);
  if (!naskah) {
    return next(
      new AppError('Naskah dengan ID tersebut tidak ditemukan.', 404)
    );
  }
  res.status(200).json({ status: 'success', data: naskah });
});

// 5. Mengupdate Naskah (UPDATE)
exports.updateSubsnaskah = catchAsync(async (req, res, next) => {
  const naskahLama = await Subsnaskah.findByPk(req.params.id);
  if (!naskahLama) {
    return next(
      new AppError('Naskah dengan ID tersebut tidak ditemukan.', 404)
    );
  }

  const { nama_naskah, pengarang, kategori_naskah, isi_naskah } = req.body;
  const dataUpdate = { nama_naskah, pengarang, kategori_naskah, isi_naskah };

  // Cek jika ada file dokumen baru yang diupload
  if (req.files && req.files.file_dokumen) {
    const docFile = req.files.file_dokumen[0];
    // [PENYESUAIAN] Memanfaatkan fileHelper baru untuk menghapus file lama saat upload yang baru
    const uploadedDoc = await fileHelper.upload(
      docFile.buffer,
      'documents',
      naskahLama.public_id_dokumen
    );
    if (!uploadedDoc)
      return next(new AppError('Gagal mengunggah dokumen baru.', 500));
    dataUpdate.file_dokumen = uploadedDoc.secure_url;
    dataUpdate.public_id_dokumen = uploadedDoc.public_id;
    dataUpdate.nama_file_asli = docFile.originalname;
  }

  // Cek jika ada gambar cover baru yang diupload
  if (req.files && req.files.gambar_cover) {
    const coverFile = req.files.gambar_cover[0];
    // Anda juga bisa menambahkan public_id untuk gambar cover di model jika ingin menghapus cover lama
    const uploadedCover = await fileHelper.upload(
      coverFile.buffer,
      'covers' /*, naskahLama.public_id_cover */
    );
    if (uploadedCover) dataUpdate.gambar_cover = uploadedCover.secure_url;
  }

  const naskahUpdate = await naskahLama.update(dataUpdate);
  res.status(200).json({ status: 'success', data: naskahUpdate });
});

// 6. Menghapus Naskah (DELETE)
exports.deleteSubsnaskah = catchAsync(async (req, res, next) => {
  const naskah = await Subsnaskah.findByPk(req.params.id);
  if (!naskah) {
    return next(
      new AppError('Naskah dengan ID tersebut tidak ditemukan.', 404)
    );
  }

  // [PENYESUAIAN] Menggunakan fungsi destroy dari fileHelper untuk menghapus file di Cloudinary
  if (naskah.public_id_dokumen) {
    await fileHelper.destroy(naskah.public_id_dokumen);
  }

  await naskah.destroy();
  res.status(204).json({ status: 'success', data: null });
});

// 7. Fungsi untuk Download File
exports.downloadNaskah = catchAsync(async (req, res, next) => {
  const naskah = await Subsnaskah.findByPk(req.params.id);
  if (!naskah || !naskah.file_dokumen) {
    return next(new AppError('Dokumen tidak ditemukan.', 404));
  }

  const fileName = naskah.nama_file_asli;
  const fileUrl = naskah.file_dokumen;

  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('GAGAL MENGAMBIL FILE DARI CLOUDINARY:', error.message);
    return next(new AppError('Gagal mengunduh file dari cloud.', 500));
  }
});
